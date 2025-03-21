import {useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import axios, { AxiosError } from 'axios';
import '/src/fonts/fonts.css';
import {Container, Row, Col, Form, Button, Alert, Spinner} from 'react-bootstrap';
import Navbar from "../elements/Navbar.tsx"

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

            <Container fluid className="d-flex flex-column bg-image-reg login w-100 px-0">
                <Navbar hide={false} expeditionsShadow={false}
                        aboutShadow={false} profileShadow={true}
                        contactsShadow={false}/>
                <Row className="d-flex text-center my-auto flex-column justify-content-center align-items-center">
                    <Col className="">
                        <h1 className="mb-3 stroke-1 rounded-2" style={{
                            color:"whitesmoke",
                            fontFamily:"G8"
                        }}>
                            Давайте познакомимся?
                        </h1>
                    </Col>
                    <Col className="col-10 col-md-10 col-8 col-lg-4">
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {"Кажется Вы уже регистрировались..."}
                            </Alert>
                        )}

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
                                className="w-75 submit-btn mt-3"
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