import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import React, {useState, useEffect} from "react";
import {User} from "../../types.ts";
import {Button, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";


const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')

    interface FormState {
        id: bigint | null;
        name: string;
        email: string;
        password: string
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
            const response = await axios.get<User>('http://localhost:8081/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            setUser(response.data)
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

    const [show, setShow] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password: " + formData.password);
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
                setShow(false);
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
                password: "",
                error: null,
            });
        }
        setShow(true);
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
            className="px-0 bg-image"
            style={{
                fontFamily: "Montserrat",
                backgroundImage: "url('/src/assets/back1.jpg')",
                filter: "brightness(120%)",
                textAlign: 'center'
            }}
        >
            <Row className="mx-2 my-2 rounded-4 border border-3 border-black ">
                <Col className="px-0">
                    <div className="d-flex align-self-center p-3 text-start">
                        <img src="/src/assets/avatar.png" className="me-5 avatar" />
                        <p className="fs-1 name mb-0 align-self-center">{user?.name}</p>
                    </div>
                </Col>
                <Col className="align-self-center text-end px-5">

                    <Button variant="light" className="p-0 border-0" onClick={handleShow}>
                        <img
                            src="/src/assets/settings.png"
                            alt="Кнопка"
                            style={{ width: "50px", height: "auto" }}
                        />
                    </Button>

                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="fs-3">
                    <p className="fs-2 fw-bolder">Мои экспедиции: </p>
                </Col>
                <Col className="fs-3">
                    <p className="fs-2 fw-bolder">Мои автомобили: </p>
                    <p className="fw-bold">
                        {user?.cars?.map((car) => (
                            <li key={car.id}>{car.name}</li>
                        )) || 0}
                    </p>
                </Col>
            </Row>
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Введите новые данные</Modal.Title>
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
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                        >
                            Подтвердить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )

}

export default Profile