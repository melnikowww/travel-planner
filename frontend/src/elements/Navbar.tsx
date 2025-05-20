import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Navbar, Container, Row, Col, Button, Nav, Modal, Form} from 'react-bootstrap';
import {User} from "../../types.ts";
import axios from "axios";
import UploadButton from "./UploadButton.tsx";

interface Props {
    hide: boolean;
    profileShadow: boolean;
    expeditionsShadow: boolean;
    aboutShadow: boolean;
    contactsShadow: boolean;
}

interface FormState {
    id: bigint | null;
    name: string;
    email: string;
    password: string;
    error: string | null;
}

const CustomNavbar: React.FC<Props> = ({
                                           hide,
                                           profileShadow,
                                           expeditionsShadow,
                                           aboutShadow,
                                           contactsShadow
}) => {
    const navigate = useNavigate();

    const [showUserSettings, setShowUserSettings] = useState(false);

    const handleLogout = () => {
        navigate('/');
        localStorage.removeItem('authToken');
    };

    const [user, setUser] = useState<User>()
    const getUser = async () => {
        try {
            const responseUser = await axios.get<User>('http://localhost:8081/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            setUser(responseUser.data)
            localStorage.setItem("avatar", responseUser.data.imgSrc)
            localStorage.setItem("id", responseUser.data.id.toString())
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const [formData, setFormData] = useState<FormState>({
        id: null,
        name: '',
        email: '',
        password: '',
        error: null
    });

    const handleShow = () => {
        if (user) {
            setFormData({
                id: null,
                name: user.name,
                email: user.email,
                password: '',
                error: null,
            });
        }
        setShowUserSettings(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.id != null) {
            try {
                console.log(formData)
                await axios.patch<User>(`http://localhost:8081/users?id=${user?.id}`,
                    formData, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                // setError('')
                getUser()
            } catch (err) {
                // setError('Ошибка при изменении пользователя')
                console.error(err)
            } finally {
                setShowUserSettings(false);
            }
        } else {
            // setError('пользователь не найден!')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Navbar
            expand="xl"
            className="w-100 border-bottom border-2 border-black rounded-bottom-2 py-0"
            style={{
                backgroundColor: '#1A1A1A',
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                boxShadow: "0 1px 5px rgba(218, 165, 32, 0.4)",
                minHeight: "fit-content",
            }}
        >
            <Container fluid className="d-flex align-items-center px-0" style={{maxHeight: 'fit-content'}}>
                <Row className="w-100 align-items-center justify-content-between py-1">
                    <Col xs={1} lg={4} hidden={hide} className="d-flex justify-content-start align-items-center">
                        {user && localStorage.getItem('avatar') &&
                            <div style={{
                                width: '60px',
                                height: '60px'
                            }} className='ms-2 d-none d-md-block'
                            >
                                <img
                                    src={localStorage.getItem('avatar') || undefined}
                                    alt={'Аватар'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center'
                                    }}
                                    className='rounded-circle'
                                />
                            </div>
                        }

                        {user && <h1 className="mb-0 profile-name mx-3 fs-5 p-0 d-none d-md-block" style={{
                            fontFamily: "'Rubik', sans-serif",
                            color: "#DAA520",
                            letterSpacing: "0.5px"
                        }}>
                            {user?.name}
                        </h1>}

                        {user && <Button
                            variant="link"
                            type='button'
                            onClick={handleShow}
                            className="p-0 rounded-5 d-none d-md-block"
                        >
                            <img
                                src='src/assets/settings.webp'
                                alt="Настройки"
                                style={{
                                    width: "20px",
                                    filter: "invert(72%) sepia(22%) saturate(999%) hue-rotate(5deg) brightness(92%) contrast(89%)"
                                }}
                            />
                        </Button>}
                    </Col>

                    <Col xs={4} lg={4} className="d-flex justify-content-center navbar-logo ">
                        <Navbar.Brand
                            href="/profile"
                            className="m-0"
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                color: '#DAA520',
                                fontSize: '2rem',
                                lineHeight: 1
                            }}
                        >
                            Outdoor Exploration
                        </Navbar.Brand>
                    </Col>

                    <Col xs={4} lg={4} className="d-flex justify-content-end align-items-center position-relative">
                        <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            className="me-2"
                            style={{
                                zIndex: '11',
                                position: 'relative',
                                borderColor: '#DAA520'
                            }}
                        />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                            role="navigation"
                            className='hamburger'
                            style={{
                                top: '100%',
                                right: 0,
                                zIndex: '12',
                                backgroundColor: '#1A1A1A',
                                minWidth: '200px'
                            }}
                        >
                            <Nav className="p-0 gap-2">
                                <Nav.Link
                                    onClick={() => navigate('/profile')}
                                    className='nav-link-custom'
                                    style={{
                                        color: profileShadow ? '#DAA520' : '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif",
                                        fontWeight: 500,
                                        alignContent: 'center'
                                    }}
                                >
                                    Профиль
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/expeditions_all')}
                                    className='nav-link-custom'
                                    style={{
                                        color: expeditionsShadow ? '#DAA520' :  '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif",
                                        fontWeight: 500,
                                        alignContent: 'center'
                                    }}
                                >
                                    Экспедиции
                                </Nav.Link>
                                <Nav.Link
                                    onClick={()=>navigate('/about')}
                                    className='nav-link-custom'
                                    style={{
                                        color: aboutShadow ? '#DAA520' : '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif",
                                        alignContent: 'center'
                                    }}
                                >
                                    О нас
                                </Nav.Link>
                                <Nav.Link
                                    className='nav-link-custom d-none'
                                    style={{
                                        color: contactsShadow ? '#DAA520' :  '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif"
                                    }}
                                >
                                    Контакты
                                </Nav.Link>
                                <div className='d-xl-none'>
                                    <Nav.Link
                                        onClick={handleLogout}
                                        style={{
                                            color: '#C14545',
                                            fontFamily: "'Rubik', sans-serif"
                                        }}
                                    >
                                        Выйти
                                    </Nav.Link>
                                </div>
                                <div className='d-none d-md-block'>
                                    {user && <Button
                                        variant="primary"
                                        type="submit"
                                        className="logout-btn justify-content-center text-center px-0"
                                        style={{ fontFamily: "Rubik", color: '#C14545' }}
                                        onClick={handleLogout}
                                    >
                                        <img src='src/assets/logout.png' style={{maxWidth: '100%'}} className='p-1'/>
                                    </Button>}
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Col>
                </Row>
            </Container>


            <Modal
                show={showUserSettings}
                onHide={() => setShowUserSettings(false)}
                centered
                contentClassName="bg-dark text-light"
                style={{fontFamily:'Rubik'}}
            >
                <Modal.Header closeButton>
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">
                                    Введите новые данные
                                </p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <UploadButton/>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Как Вас теперь зовут?</Form.Label>
                            <Form.Control
                                type="name"
                                name="name"
                                placeholder={user?.name}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder={user?.email}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder=""
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <p className="my-0 text-center" style={{fontSize:"10px"}}>
                                *если не хотите менять пароль, то просто не трогайте это поле...
                            </p>
                        </Form.Group>
                        <div className="d-flex container w-100">
                            <div className="d-flex col justify-content-center">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-50 submit-btn"
                                >
                                    Подтвердить
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Navbar>
    );
};

export default CustomNavbar;