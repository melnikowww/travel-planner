import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, {useEffect, useState} from 'react';
import {Crew, Equipment, Good, User} from "../../types.ts";
import {Button, Col, Container, Dropdown, Form, Modal, Row} from "react-bootstrap";
import axios from "axios";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    driverId: number;
    expeditionId: number;
}
interface equipState {
    name: string;
    expedition_id: number | null
    crew_id: number | null;
}
interface goodState {
    name: string;
    expedition_id: number | null
    crew_id: number | null;
}

const UpdateCrew: React.FC<ModalProps> = ({show, onHide, driverId, expeditionId}) => {
    const [crew, setCrew] = useState<Crew | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState('');
    const [equipData, setEquip] = useState<equipState>({
        name: '',
        expedition_id: expeditionId,
        crew_id: null,
    })
    const [goodData, setGood] = useState<goodState>({
        name: '',
        expedition_id: expeditionId,
        crew_id: null,
    })

    interface CrewForm {
        car_id: number | null;
        members: User[];
        equipment: Equipment[];
        goods: Good[];
    }

    const [crewForm, setCrewForm] = useState<CrewForm>({
        car_id: null,
        members: [],
        equipment: [],
        goods: [],
    })

    const [selectedItem, setSelectedItem] = useState('Выберите автомобиль');

    const fetchCrew = async () => {
        try {
            if (!driverId || !expeditionId) {
                setError('Не указаны driverId или expeditionId');
                return;
            }

            const params = new URLSearchParams({
                driver_id: driverId.toString(),
                expedition_id: expeditionId.toString()
            });
            const url = `http://localhost:8081/crew?${params}`;
            const [responseCrew, responseUser] = await Promise.all([
                axios.get<Crew>(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                }),
                axios.get<User>(`http://localhost:8081/users?id=${driverId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                })
            ]);

            setCrew(responseCrew.data);
            setUser(responseUser.data);
            setError('');
            const car = responseUser.data.cars.find(c => c.id === responseCrew.data.car_id);
            if (car) {
                setSelectedItem(car.name);
            }
        } catch (e) {
            setError('Ошибка при поиске экипажа😐');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCrew()
    }, [driverId, expeditionId]);

    const handleSelect = (eventKey: string | null) => {
        setSelectedItem(eventKey || 'Выберите автомобиль');
        if (eventKey && user?.cars) {
            const selectedCar = user.cars.find((car) => car.name === eventKey);
            if (selectedCar) {
                setCrewForm((prevData) => ({
                    ...prevData,
                    car_id: selectedCar.id,
                }));
            }
        }
    };

    const handleEquipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEquip({
            ...equipData,
            [e.target.name]: e.target.value,
        });
    };

    const addEquip = async (e: React.FormEvent)=>{
        e.preventDefault();
        if (crew && equipData.name != "") {
            equipData.crew_id = crew.id
            try {
                await axios.post<Equipment>(`http://localhost:8081/equip`,
                    equipData, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                setError('')
                setEquip({
                    name: '',
                    expedition_id: expeditionId,
                    crew_id: null,
                })
            } catch (err) {
                setError('Ошибка добавлении снаряжения')
                console.error(error)
            }
        }
    }

    const handleGoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGood({
            ...goodData,
            [e.target.name]: e.target.value,
        });
    };

    const addGood = async (e: React.FormEvent)=>{
        e.preventDefault();
        if (crew && goodData.name != "") {
            goodData.crew_id = crew.id
            try {
                await axios.post<Equipment>(`http://localhost:8081/goods`,
                    goodData, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                setError('')
                setGood({
                    name: '',
                    expedition_id: expeditionId,
                    crew_id: null,
                })
            } catch (err) {
                setError('Ошибка добавлении продуктов')
                console.error(error)
            }
        }
    }

    const updateCrew = async (e: React.FormEvent) => {
        e.preventDefault();
        if (crew) {
            try {
                await axios.patch<Crew>(`http://localhost:8081/crews?id=${crew.id}`,
                    crewForm, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        }
                    })
                setError('')
            } catch (err) {
                setError('Ошибка изменения экипажа')
                console.error(error)
            } finally {
                onHide()
            }
        }
    }

    return (
        <div>
            <Modal show={show} onHide={onHide} centered style={{fontFamily:"Rubik"}} contentClassName='bg-dark text-light'>
                <Modal.Header closeButton className="p-3">
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">Давайте сверимся...</p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body style={{
                    padding:0
                }}>
                    <Container className="d-flex align-items-center h-100 px-0 flex-column">
                                <Form className="w-100 justify-content-center">
                                    <Row className="mx-auto">
                                        <Col className="d-flex justify-content-center py-2">
                                            <Form.Group>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Label>Сменим машину?</Form.Label>
                                                </div>
                                                <Dropdown onSelect={handleSelect} className="justify-content-center">
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        {selectedItem}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {user?.cars.map((car) => (
                                                            <Dropdown.Item key={car.id} eventKey={car.name}>
                                                                {car.name}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-center w-100 flex-row">
                                            <Form.Group id="equip" className="">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Form.Label htmlFor="equip">Новый элемент снаряжения?</Form.Label>
                                                </div>
                                                <div className="d-flex pb-3">
                                                    <Form.Control
                                                        type="name"
                                                        name="name"
                                                        placeholder="Хайджек"
                                                        value={equipData.name}
                                                        onChange={handleEquipChange}
                                                    />
                                                    <Button type='submit' className="mx-2 submit-btn" onClick={addEquip}>
                                                        <FontAwesomeIcon icon={faPlus} className="mx-0" />
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-center w-100 flex-row">
                                            <Form.Group id="good" className="">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Form.Label htmlFor="good">Новый продукт?</Form.Label>
                                                </div>
                                                <div className="d-flex pb-3">
                                                    <Form.Control
                                                        type="name"
                                                        name="name"
                                                        placeholder="Сгущенка"
                                                        value={goodData.name}
                                                        onChange={handleGoodChange}
                                                    />
                                                    <Button className="mx-2 submit-btn" onClick={addGood}>
                                                        <FontAwesomeIcon icon={faPlus} className="mx-0" />
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                        <Row>
                            <Button className="m-2 submit-btn" onClick={updateCrew}>
                                Все верно!
                            </Button>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UpdateCrew