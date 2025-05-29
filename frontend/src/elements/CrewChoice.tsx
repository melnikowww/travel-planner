import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import {Crew, Expedition, Message, MessageType, Status, User} from '../../types.ts';
import {useSearchParams} from "react-router-dom";
import { InputNumber } from 'antd';

interface ModalProps {
    show: boolean;
    onHide: () => void;
    expedition: Expedition | null;
    drivers: User[];
}

interface FormState {
    car_id: number | null;
    expedition_id: number | null;
    seats: number | null;
}

interface MessageState {
    type: MessageType | null;
    status: Status | null;
    producerId: number | null;
    consumerId: number | null;
    description: string | null;
    expeditionId: number | null;
    crewId: number | null;
}

const CrewChoice: React.FC<ModalProps> = ({ show, onHide, expedition, drivers }) => {
    const [user, setUser] = useState<User | null>(null);
    const [showChoice, setShowChoice] = useState(show);

    const [showNew, setNew] = useState(false);
    const [showJoinCrew, setJoinCrew] = useState(false);

    const [crews, setCrews] = useState<Crew[]>([])

    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');

    let userId = localStorage.getItem("id")
    let id = userId != null ? parseInt(userId) : 0;

    const [formData, setFormData] = useState<FormState>({
        car_id: null,
        expedition_id: null,
        seats: null,
    });

    const [crewRequest] = useState<MessageState>({
        type: null,
        status: null,
        producerId: null,
        consumerId: null,
        description: null,
        expeditionId: null,
        crewId: null,
    })

    const [searchParams, _] = useSearchParams();

    const [selectCar, setSelectCar] = useState('Выберите автомобиль');

    const createNew = async () => {
        setShowChoice(false);
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
            setError('Ошибка при загрузке пользователя');
            console.error(e);
        } finally {
            setLoad(false);
        }
    };

    const joinCrew = async () => {
        setJoinCrew(true)
        try {
            if (expedition) {
                const crews = await axios.get<Crew[]>(`http://localhost:8081/exp_crews?expedition_id=${expedition.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setCrews(crews.data.filter((crew) => crew.seats + 1 > crew.members.length));
            }
            setError('');
        } catch (e) {
            setError('Ошибка при загрузке экипажей');
            console.error(e);
        } finally {
            setLoad(false);
        }
    }

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

    const sendCrewRequest = async (requestData: typeof crewRequest) => {
        try {
            await axios.post<Message>("http://localhost:8081/message",
                requestData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    }
                })
            setJoinCrew(false)
            onHide();
        } catch (e) {
            setError('Ошибка при отправке заявки😥')
        }
    }

    const [hasRequest, setHasRequest] = useState(false);

    useEffect(() => {
        console.log(hasRequest)
        const checkRequest = async () => {
            try {
                const requests = await axios.get<Message[]>(`http://localhost:8081/prod_messages?user=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    }
                });

                if (expedition) {
                    setHasRequest(requests.data.some(request => request.expeditionId === expedition.id));
                }
            } catch (e) {
                setError('Ошибка при проверке списка заявок');
                setHasRequest(false);
            }
        };

        if (id && expedition) {
            checkRequest();
        }
    }, [id, expedition]);

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
                                <Button disabled={!(expedition && !hasRequest && expedition.crews.filter((crew) => crew.seats > 0).length)}
                                        className="fs-4 w-100" onClick={joinCrew}>
                                    Вписаться пассажиром
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            {showNew &&
                <Modal show={showNew} onHide={()=> {
                    setNew(false);
                    onHide()
                }} centered style={{ fontFamily: 'Rubik' }}
                       contentClassName='bg-dark text-light'>
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
                                        min={0}
                                        max={10}
                                        defaultValue={0}
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
            </Modal>}

            {showJoinCrew &&
                <Modal show={showJoinCrew} onHide={()=> {
                    setJoinCrew(false);
                    onHide()
                }} centered style={{fontFamily: 'Rubik'}}
                       contentClassName='bg-dark text-light'>
                    <Modal.Header closeButton>
                        Доступные для записи экипажи
                    </Modal.Header>
                    <Modal.Body>
                        {
                            (expedition && expedition.crews.length > 0) ?
                            <div>
                                {
                                    drivers.map((driver) => {
                                        let crew = crews.find((crew) => crew.driver_id === driver.id)
                                        if (!crew) {
                                            return null
                                        }
                                        let car = driver.cars.find((car) => car.id === crew.car_id)
                                        if (!car) {
                                            return null
                                        }
                                        return (
                                            <Button variant='outline-dark' className='p-3 my-2 gap-2 rounded-2 w-100 text-light'
                                                    style={{border: '1px solid rgba(0, 0, 0, 0.2)'}}
                                                    onClick={()=> {
                                                        const requestData = {
                                                            type: MessageType.CrewRequest,
                                                            status: Status.Active,
                                                            producerId: id,
                                                            consumerId: driver.id,
                                                            description: null,
                                                            expeditionId: expedition.id,
                                                            crewId: crew.id,
                                                        };
                                                        sendCrewRequest(requestData);
                                                    }}
                                            >
                                                {driver.name}, {car.name}
                                            </Button>
                                        )
                                    })
                                }
                            </div>
                                :
                            null
                        }
                    </Modal.Body>
                </Modal>
            }
        </div>
    );
};

export default CrewChoice;