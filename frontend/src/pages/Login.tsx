import {useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import axios, { AxiosError } from 'axios';
import '/src/fonts/fonts.css';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Navbar from "../elements/Navbar.tsx";

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
        if (!formData.email || !formData.password) {
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
        <Container fluid className="d-flex justify-content-center align-items-center login bg-image-login flex-column">
            <Navbar hide={true} expeditionsShadow={false}
                    aboutShadow={false} profileShadow={false}
                    contactsShadow={false}/>
            <Row className="justify-content-center m-0">
                <Col className="col-md-12 col-sm-12 col-12">
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

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>
                                {/*<p className="my-0 russo stroke" style={{opacity: "95%", color: 'honeydew'}}>Email</p>*/}
                                <p className="my-0"
                                   style={{opacity: "95%", color: 'honeydew', fontFamily: "Rubik"}}>Почта</p>
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
                                <p className="my-0"
                                   style={{opacity: "95%", color: 'honeydew', fontFamily: "Rubik"}}>Пароль</p>
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
                                className="submit-btn w-75"
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
                                    <p className="my-0" style={{fontFamily: "Rubik"}}>Войти</p>
                                )}
                            </Button>
                        </div>
                        <div className='d-flex justify-content-center mt-1   mx-auto'>
                            <a href='/register' className='register-link'>Нет аккаунта?..</a>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;