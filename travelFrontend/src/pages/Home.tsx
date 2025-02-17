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
    id: bigint;
    name: string;
    email: string;
}

const Home: React.FC = () => {

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
                'http://localhost:8081/users',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            setServerResponse(response.data)
            navigate('/users')
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
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={100}>
                    <h2 className="mb-5 text-center">Вас приветствует Travel Planner!</h2>
                    <h4 className="mb-3">Давайте познакомимся?</h4>

                    {/* Блок ошибок */}
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

                    {/* Форма */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Как Вас зовут?</Form.Label>
                            <Form.Control
                                type="name"
                                name="name"
                                placeholder="Ivan Pavlov"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Пароль</Form.Label>
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
                            className="w-100"
                            disabled={isLoading}
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
                                'Войти'
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;