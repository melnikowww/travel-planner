import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import {Crew, User} from '../../types.ts';
import {useSearchParams} from "react-router-dom";
import { InputNumber } from 'antd';

interface ModalProps {
    show: boolean;
    onHide: () => void;
}

interface FormState {
    car_id: number | null;
    expedition_id: number | null;
    seats: number | null;
}

const CrewCreate: React.FC<ModalProps> = ({ show, onHide }) => {
    const [user, setUser] = useState<User | null>(null);
    const [showChoice, setShowChoice] = useState(show);
    const [showNew, setNew] = useState(false);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<FormState>({
        car_id: null,
        expedition_id: null,
        seats: null,
    });
    const [searchParams, _] = useSearchParams();

    const [selectCar, setSelectCar] = useState('Выберите автомобиль');

    const createNew = async () => {
        setShowChoice(false);
        onHide();
        setLoad(true);
        try {
            const responseUser = await axios.get<User>('http://localhost:8081/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setUser(responseUser.data);
            setError('');
            setNew(true);
        } catch (e) {
            setError('Ошибка при загрузке автомобилей');
            console.error(e);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        setShowChoice(show);
    }, [show]);

    const handleSelect = (eventKey: string | null) => {
        setSelectCar(eventKey || 'Выберите автомобиль');
        if (eventKey && user?.cars) {
            const selectedCar = user.cars.find((car) => car.name === eventKey);
            if (selectedCar) {
                setFormData((prevData) => ({
                    ...prevData,
                    car_id: selectedCar.id,
                }));
            }
            const expId = searchParams.get('id');
            if (expId != null) {
                setFormData((prevData) => (
                    { ...prevData, expedition_id: parseInt(expId) })
                );
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoad(true)
        try {
            await axios.post<Crew>("http://localhost:8081/crews",
                formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    }
                })
            setError('')
            window.location.reload()
        } catch (e) {
            setError('Ошибка при создании экипажа')
            console.log(error)
        } finally {
            setLoad(false)
            setNew(false)
        }
    }

    if (load) {
        return (
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{
                minWidth: '100vw',
                minHeight: '100vh',
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
    }

    return (
        <div>
            <Modal show={showChoice} onHide={onHide} centered style={{ fontFamily: 'Rubik' }} contentClassName='bg-dark text-light'>
                <Modal.Header closeButton>
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">Введите вариант участия</p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Container className="d-flex flex-row justify-content-center">
                        <Row className="w-100">
                            <Col className="d-flex justify-content-center">
                                <Button className="fs-4 w-100" onClick={createNew}>
                                    Создать экипаж
                                </Button>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <Button disabled={true} className="fs-4 w-100">
                                    Вписаться пассажиром
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal show={showNew} onHide={() => setNew(false)} centered style={{ fontFamily: 'Rubik' }} contentClassName='bg-dark text-light'>
                <Modal.Header closeButton>
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">На чем едем?</p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Container className="d-flex container flex-column w-100">
                            <Row className="mb-3">
                                <Col className="d-flex justify-content-center">
                                    <Dropdown onSelect={handleSelect} className="justify-content-center">
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            {selectCar}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {user?.cars.map((car) => (
                                                <Dropdown.Item key={car.id} eventKey={car.name}>
                                                    {car.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <Row className='d-flex flex-column mb-2 align-content-center'>
                                <Col className="d-flex justify-content-center">
                                    <text className='px-1'>
                                        Сколько пассажиров возьмем?
                                    </text>
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        defaultValue={1}
                                        onChange={(event) => {
                                            if (event != null) {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    seats: event,
                                                }));
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="d-flex justify-content-center">
                                    <Button onClick={handleSubmit} variant="primary" type="submit" className="w-50">
                                        Подтвердить
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CrewCreate;