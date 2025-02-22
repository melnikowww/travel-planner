import {useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import axios, { AxiosError } from 'axios';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';

interface FormState {
    name: string;
    email: string;
    password: string;
    error: string | null;
}

interface ApiResponse {
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
                'http://localhost:8081/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            setServerResponse(response.data)
            const token = response.data.token;
            localStorage.setItem("authToken", token);
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
        <Container fluid className="d-grid justify-content-center align-items-center vh-100 login bg-image" style={{
            backgroundImage: "url('src/assets/onega.jpg')"
        }}>
            {/*<Row className="text-center my-0" style={{maxHeight:"fit-content"}}>*/}
            {/*    <Col>*/}
            {/*        /!*<p className="text-center russo" style={{fontSize: "4rem", color:"whitesmoke"}}>Скучали по приключениям?</p>*!/*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <Row className="justify-content-md-center w-100 justify-content-center">
                <Col className="col-12 col-md-12" style={{flexGrow:"0", flexShrink:"0"}}>
                    {/*<h2 className="mb-5 text-center russo">Скучали по приключениям?</h2>*/}
                    {/* Блок ошибок */}
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {"Что-то пошло не так..."}
                        </Alert>
                    )}

                    {serverResponse && (
                        <Alert variant="success" className="mb-3">
                            {"Все гуд!"}
                        </Alert>
                    )}

                    {/* Форма */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>
                                <p className="my-0 russo">Email</p>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="love@overland.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form"
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>
                                <p className="my-0 russo">Пароль</p>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                                className="submit-btn"
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
                                        <span className="ms-2">Ищем Вас...</span>
                                    </>
                                ) : (
                                    <p className="my-0 russo">Войти</p>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;