import {useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import axios, { AxiosError } from 'axios';
import '/src/fonts/fonts.css';
import {Container, Row, Col, Form, Button, Alert, Spinner, Navbar, Nav} from 'react-bootstrap';

interface FormState {
    name: string;
    email: string;
    password: string;
    error: string | null;
}

interface ApiResponse {
    id: bigint;
    name: string;
    email: string;
}

interface loginResponse {
    token: string
}

const Register: React.FC = () => {

    const [formData, setFormData] = useState<FormState>({
        name: '',
        email: '',
        password: '',
        error: null
    });

    const [serverResponse, setServerResponse] = useState<ApiResponse | null>(null);

    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null)
        setIsLoading(true)
        if (!formData.email || !formData.password || !formData.name) {
            setFormData({...formData, error: 'Заполните все поля!'})
        }
        try {
            const response = await axios.post<ApiResponse>(
                'http://localhost:8081/register',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const loginResponse = await axios.post<loginResponse>(
                'http://localhost:8081/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            setServerResponse(response.data)
            localStorage.setItem("authToken", loginResponse.data.token)
            navigate('/profile')
            console.log('Успешный ответ:', response.data);
        } catch (err) {
            const error = err as AxiosError;
            if (error.response) {
                setError(error.response.statusText || "SERVER ERROR")
            } else {
                setError("Cannot connect")
            }
        } finally {
            setIsLoading(false)
        }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (

            <Container fluid className="d-flex justify-content-center align-items-center flex-column bg-image-reg login w-100 px-0">
                <Navbar expand="lg" className="w-100 border border-2 border-black rounded-bottom-2"
                        style={{
                            backgroundColor: "rgba(74,107,142,0.7)",
                        }}>
                    <Container fluid className="px-0" style={{ fontFamily: "Scumbria" }}>
                        <Row className="w-100 mx-0">
                            <Col className="d-flex justify-content-start align-items-center col-md-8">
                                <Navbar.Brand href="#home" className="">
                                    <text className="flex-text">
                                        Outdoor Exploration
                                    </text>
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        <Nav.Link href="#login" onClick={() => navigate("/")}>Главная</Nav.Link>
                                        <Nav.Link href="#about">О нас</Nav.Link>
                                        <Nav.Link href="#services">Услуги</Nav.Link>
                                        <Nav.Link href="#contact">Контакты</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Col>
                            {/*<Col className="d-flex justify-content-center align-items-center">*/}

                            {/*</Col>*/}
                            <Col className="d-flex justify-content-end align-items-center col-md-4">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isLoading}
                                    style={{ fontFamily: "Scumbria",}}
                                    onClick={() => navigate("/")}
                                >
                                    Войти
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
                {/*<Row className="justify-content-end" style={{*/}
                {/*    width:"100vw"*/}
                {/*}}>*/}
                {/*    <Col className="col-2 mx-0 my-0 d-flex justify-content-end py-2">*/}

                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="mt-auto ">

                </Row>
                <Row className="d-flex text-center mb-auto flex-column justify-content-center align-items-center">
                    <Col className="">
                        <h1 className="mb-3 stroke-1 rounded-2" style={{
                            color:"whitesmoke",
                            fontFamily:"G8"
                        }}>
                            Давайте познакомимся?
                        </h1>
                    </Col>
                    <Col className="col-12 col-md-12 col-8 col-lg-8">
                        {/*<h2 className="mb-5 text-center">Вас приветствует Travel Planner!</h2>*/}
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {"Кажется Вы уже регистрировались..."}
                            </Alert>
                        )}

                        {/* Блок успешного ответа */}
                        {serverResponse && (
                            <Alert variant="success" className="mb-3">
                                {"Все гуд!"}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit} >
                            <Form.Group controlId="name" className="mb-1 form">
                                <Form.Label className="stroke-1 fs-4" style={{color:"honeydew", fontFamily:"G8"}}>Как Вас зовут?</Form.Label>
                                <Form.Control
                                    type="name"
                                    name="name"
                                    placeholder="Ivan Pavlov"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="email" className="mb-1 form">
                                <Form.Label className="stroke-1 fs-4" style={{color:"ghostwhite", fontFamily:"G8"}}>Почта</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="password" className="mb-1 form">
                                <Form.Label className="stroke-1 fs-4" style={{color:"honeydew", fontFamily:"G8"}}>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 submit-btn mt-3"
                                disabled={isLoading}
                                style={{fontFamily:"Scumbria"}}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Отправка...</span>
                                    </>
                                ) : (
                                    'Зарегистрироваться'
                                )}
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="d-flex w-100">
                    <Col className="fs-6 text-end" style={{color:"whitesmoke"}}>
                        photo by @ilmenkov_egor
                    </Col>
                </Row>
            </Container>
    );
};

export default Register;