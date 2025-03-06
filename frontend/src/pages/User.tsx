import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import React, {useState, useEffect} from "react";
import {Expedition, User} from "../../types.ts";
import {Button, Col, Container, Form, Modal, Nav, Navbar, Row, Spinner} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import UploadButton from "../elements/UploadButton.tsx";
import AddCarModal from "../elements/AddCar.tsx";
import UpdateCar from "../elements/UpdateCar.tsx";


const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [expeditions, setExpeditions] = useState<Expedition[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')
    const navigate = useNavigate()

    interface FormState {
        id: bigint | null;
        name: string;
        email: string;
        password: string;
        error: string | null;
    }

    const [formData, setFormData] = useState<FormState>({
        id: null,
        name: '',
        email: '',
        password: '',
        error: null
    });

    const fetchUser = async () => {
        try {
            const responseUser = await axios.get<User>('http://localhost:8081/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            const responseExpeditions = await axios.get<Expedition[]>('http://localhost:8081/user&exp', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            setUser(responseUser.data)
            setExpeditions(responseExpeditions.data)
            localStorage.setItem("avatar", responseUser.data.imgSrc)
            localStorage.setItem("id", responseUser.data.id.toString())
            setError('')
        } catch (err) {
            setError('Ошибка при загрузке пользователя')
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const [showUserSettings, setShowUserSettings] = useState(false);
    const [showCarCreate, setCarCreate] = useState(false);
    const [showCarUpdate, setCarUpdate] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.id != null) {
            try {
                await axios.patch<User>(`http://localhost:8081/users?id=${user?.id}`,
                    formData, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                setError('')
                fetchUser()
            } catch (err) {
                setError('Ошибка при изменении пользователя')
                console.error(err)
            } finally {
                setShowUserSettings(false);
            }
        } else {
            setError('пользователь не найден!')
        }
    }
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

    const handleCarAdd = () => {
        setCarCreate(true);
    }

    const [carId, setCarId] = useState(0)
    const handleCarUpdate = (id: number) => {
        setCarUpdate(true);
        setCarId(id)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) return (
        <Container>
            <Row className="justify-content-md-center">
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Row>
        </Container>
    );
    if (error) return <div>{error}</div>

    return (
        <Container
            fluid
            className="d-flex flex-column px-0 bg-image-profile"
            style={{
                fontFamily: "Montserrat",
                minWidth: "100vw",
                minHeight: "100vh",
            }}
        >
            <Navbar expand="lg" className="w-100 border-bottom border-2 border-black rounded-bottom-2"
                    style={{
                        backgroundColor: "rgba(54, 69, 79, 0.7)",
                    }}>
                <Container fluid className="d-flex flex-column px-0 " style={{ fontFamily: "Scumbria" }}>
                    <Row className="w-100 mx-0">
                        <Col className="d-flex justify-content-start align-items-center z-3">
                            <Button
                                variant="primary"
                                type="submit"
                                className="submit-btn"
                                style={{ fontFamily: "Scumbria", color:"darkred"}}
                                onClick={() => {
                                    navigate("/")
                                    localStorage.removeItem("authToken")
                                }}
                            >
                                Выйти
                            </Button>
                        </Col>

                        <Col className="d-flex position-absolute justify-content-center">
                            <Navbar.Brand href="/profile" className="mx-1">
                                <p className="mb-0">
                                    Outdoor Exploration
                                </p>
                            </Navbar.Brand>
                        </Col>

                        <Col className="d-flex justify-content-end h-auto z-3">
                            <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-2" style={{zIndex:"11"}}/>
                            <Navbar.Collapse id="basic-navbar-nav" role="navigation" style={{
                                position:"absolute",
                                zIndex:"10"
                            }}>
                                <Nav className="hamburger h-auto">
                                    <Nav.Link onClick={()=>{navigate("/")}}>Главная</Nav.Link>
                                    <Nav.Link href="">О нас</Nav.Link>
                                    <Nav.Link href="">Услуги</Nav.Link>
                                    <Nav.Link href="">Контакты</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Col>
                    </Row>
                </Container>
            </Navbar>


            <Row className="d-flex rounded-4 border border-3 border-black mx-2 mt-1 py-3" style={{fontFamily: "G8-Bold"}}>
                <Col className="d-flex object-fit-contain justify-content-start align-items-center col-auto ">
                    <UploadButton/>
                </Col>
                <Col className="justify-content-center align-self-center">
                    <p className="fs-1 name py-0 mb-0 ms-lg-5">{user?.name}</p>
                </Col>
                <Col className="d-flex settings col-auto align-self-center" style={{height:"-webkit-fit-content"}}>
                    <Button variant="light" className="set-btn" style={{
                    }} onClick={handleShow}>
                        <img
                            src="/src/assets/settings.png"
                            alt="Кнопка"
                            style={{ width: "50px", height: "auto", background:"rgba(0,0,0,0)"}}
                        />
                    </Button>
                </Col>
            </Row>

            <Row className="mt-3 mx-0 w-100 row-column stroke-1" style={{fontFamily: "G8-Bold"}}>
                <Col className="d-flex fs-4 align-items-center justify-content-start flex-column">
                    <p className="fs-1" >Экспедиции: </p>
                    <ol className="">
                        {expeditions.map((exp) => (
                            <li key={exp.id}>{exp.name}</li>
                        )) || 0}
                    </ol>
                </Col>
                <Col className="d-flex fs-4 align-items-center justify-content-start flex-column">
                    <p className="fs-1">Автомобили: </p>
                    <ol className="">
                        {user?.cars?.map((car) => (
                            <li key={car.id}>
                                <Button variant="outline-dark" className="my-1"  style={{border:"hidden"}}
                                        onClick={()=>handleCarUpdate(car.id)}>
                                    <p className="fs-4 my-auto py-0">
                                        {car.name}
                                    </p>
                                </Button>
                            </li>
                        )) || 0}
                    </ol>
                    <UpdateCar show={showCarUpdate} onHide={()=>setCarUpdate(false)} id={carId} />
                    <Button variant="outline-dark" className="" onClick={()=>(handleCarAdd())}>
                        <p className="fs-4 my-0">Добавить</p>
                    </Button>
                    <AddCarModal show={showCarCreate} onHide={()=> {setCarCreate(false)}}/>
                </Col>
            </Row>


            <Modal show={showUserSettings} onHide={() => setShowUserSettings(false)} centered style={{fontFamily:"G8"}}>
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
                            <p className="my-0 text-center" style={{fontSize:"15px"}}>
                                *если не хотите менять пароль, то просто не трогайте это поле...
                            </p>
                        </Form.Group>
                        <div className="d-flex container w-100">
                            <div className="d-flex col justify-content-center">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-50"
                                >
                                    Подтвердить
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )

}

export default Profile