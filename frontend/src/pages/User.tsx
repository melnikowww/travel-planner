import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import React, {useState, useEffect} from "react";
import {Expedition, User} from "../../types.ts";
import {Button, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import UploadButton from "../elements/UploadButton.tsx";
import AddCarModal from "../elements/AddCar.tsx";
import UpdateCar from "../elements/UpdateCar.tsx";
import Navbar from "../elements/Navbar.tsx"
import ExpeditionCrew from "../elements/ExpeditionCrewChoice.tsx"


const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [expeditions, setExpeditions] = useState<Expedition[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')

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
            const responseExpeditions = await axios.get<Expedition[]>('http://localhost:8081/user-to-exp', {
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

    const [showExpChoice, setExpChoice] = useState(false)
    const [expId, setExpId] = useState(0)
    const [canNotUpdateExp, setCanNotUpdateExp] = useState(false)
    const [canNotUpdateCrew, setCanNotUpdateCrew] = useState(false)
    const [driverId, setDriverId] = useState(0)

    const handleExpButton = (exp: Expedition) => {
        if (exp && user) {
            setExpChoice(true);
            setExpId(exp.id ?? 0);
            setCanNotUpdateExp(user.id !== exp.creator_id);
            const hasCrew = exp?.crews?.some(crew => crew.driver_id === user?.id) ?? false;
            setCanNotUpdateCrew(!hasCrew);
            const newDriverId = hasCrew ? user.id : user.crews.find(crew => crew.expedition_id === exp?.id)?.driver_id
            if (newDriverId) {
                setDriverId(newDriverId);
            }
        }
    };

    if (loading) return (
        <Container className="d-flex flex-column align-items-center justify-content-center" style={{
            minWidth:"100vw",
            minHeight:"100vh"
        }}>
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
    if (error) return (
        <Container className="d-flex flex-column align-items-center" style={{
            minWidth:"100vw",
            minHeight:"100vh"
        }}>
            <Row className="d-flex w-100 mx-0 px-0 h-100">
                <Col className="d-flex justify-content-center align-items-start">
                    <Navbar hide={false} expeditionsShadow={false}
                            aboutShadow={false} profileShadow={false}
                            contactsShadow={false}/>
                </Col>
            </Row>
            <Container className="d-flex w-100 mx-0 px-0 justify-content-center align-items-center" style={{
                minWidth:"100vw",
                minHeight:"100vh"
            }}>
                {error}😒
            </Container>
        </Container>
    )

    return (
        <Container
            fluid
            className="d-flex flex-column px-0 bg-image-profile mb-0 "
            style={{
                fontFamily: "'Rubik', sans-serif",
                minWidth: "100vw",
                minHeight: "100vh",
                backgroundColor: "#1A1A1A",
                color: "#FFFFFF",
                paddingTop: "80px"
            }}
        >
            <Navbar hide={false} expeditionsShadow={false}
                    aboutShadow={false} profileShadow={true}
                    contactsShadow={false}/>

            {/* Блок профиля */}
            <Row className="mx-3 rounded-3 py-4" style={{
                backgroundColor: "rgba(45,45,45,0.8)",
                border: "2px solid #DAA520",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
                <Col xs={3} className="d-flex align-items-center justify-content-center px-0">
                    <UploadButton/>
                </Col>

                <Col xs={6} className="d-flex align-items-center px-0">
                    <h1 className="mb-0 profile-name" style={{
                        fontFamily: "'Rubik', sans-serif",
                        color: "#DAA520",
                        letterSpacing: "1.5px"
                    }}>
                        {user?.name}
                    </h1>
                </Col>

                <Col xs={3} className="d-flex align-items-center justify-content-center">
                    <Button
                        variant="link"
                        onClick={handleShow}
                        className="p-0"
                    >
                        <img
                            src="/src/assets/settings.png"
                            alt="Настройки"
                            style={{
                                width: "40px",
                                filter: "invert(72%) sepia(22%) saturate(999%) hue-rotate(5deg) brightness(92%) contrast(89%)"
                            }}
                        />
                    </Button>
                </Col>
            </Row>

            <Row className="d-flex mt-4 mx-3 g-4 align-items-start justify-content-center">
                <Col lg={4} className="pe-lg-3">
                    <div className="p-4 rounded-3" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "1px solid #3D3D3D"
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="flex-text" style={{
                                fontFamily: "'Rubik', sans-serif",
                                color: "#DAA520",
                            }}>
                                Экспедиции
                            </h2>
                            <Button
                                variant="outline-warning"
                                // onClick={}
                                className='add-car-button'
                                style={{
                                    borderColor: "#DAA520",
                                    color: "#DAA520"
                                }}
                            >
                                Добавить
                            </Button>
                        </div>

                        <div className="d-grid gap-2">
                            {expeditions?.map((exp) => (
                                <Button
                                    key={exp.id}
                                    variant="dark"
                                    className="text-start py-3 rounded-2"
                                    style={{
                                        border: "1px solid #3D3D3D",
                                        transition: "all 0.3s ease"
                                    }}
                                    onClick={() => handleExpButton(exp)}
                                >
                                    <span className="d-block" style={{ color: "#DAA520" }}>{exp.name}</span>
                                    <small className="text-muted">Даты: {new Date(exp.starts_at).toLocaleString('ru-RU', {
                                        timeZone: 'Europe/Moscow',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}-{new Date(exp.ends_at).toLocaleString('ru-RU', {
                                        timeZone: 'Europe/Moscow',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}</small>
                                </Button>
                            ))}
                        </div>
                    </div>
                    <ExpeditionCrew show={showExpChoice} disabledExp={canNotUpdateExp} disabledCrew={canNotUpdateCrew}
                                    driverId={driverId} onHide={()=>setExpChoice(false)} expeditionId={expId}/>
                </Col>

                {/* Секция автомобилей */}
                <Col lg={4} className="ps-lg-3">
                    <div className="p-4 rounded-3" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "1px solid #3D3D3D"
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="flex-text" style={{
                                fontFamily: "'Rubik', sans-serif",
                                color: "#DAA520",
                                margin: 0
                            }}>
                                Автомобили
                            </h2>
                            <Button
                                variant="outline-warning"
                                onClick={handleCarAdd}
                                className='add-car-button'
                                style={{
                                    borderColor: "#DAA520",
                                    color: "#DAA520"
                                }}
                            >
                                Добавить
                            </Button>
                        </div>

                        <div className="d-grid gap-2">
                            {user?.cars?.map((car) => (
                                <Button
                                    key={car.id}
                                    variant="dark"
                                    className="text-start py-3 rounded-2"
                                    style={{
                                        border: "1px solid #3D3D3D",
                                        transition: "all 0.3s ease"
                                    }}
                                    onClick={() => handleCarUpdate(car.id)}
                                >
                                    <span className="d-block" style={{ color: "#B0B0B0" }}>{car.name}</span>
                                </Button>
                            ))}
                            <UpdateCar show={showCarUpdate} onHide={()=>setCarUpdate(false)} id={carId} />
                        </div>
                    </div>
                    <AddCarModal show={showCarCreate} onHide={()=> {setCarCreate(false)}}/>
                </Col>
            </Row>

            {/* Модальное окно настроек */}
            <Modal
                show={showUserSettings}
                onHide={() => setShowUserSettings(false)}
                centered
                contentClassName="bg-dark text-light"
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