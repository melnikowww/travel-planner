import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, {useEffect, useState} from 'react';
import {Crew, Equipment, Good, User} from "../../types.ts";
import {Button, Col, Container, Dropdown, Form, FormGroup, Modal, Row} from "react-bootstrap";
import axios from "axios";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    driverId: number;
    expeditionId: number;
}
interface equipState {
    name: string;
    crew_id: number | null;
}
interface goodState {
    name: string;
    crew_id: number | null;
}

const UpdateCrew: React.FC<ModalProps> = ({show, onHide, driverId, expeditionId}) => {
    const [crew, setCrew] = useState<Crew | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [equipData, setEquip] = useState<equipState>({
        name: '',
        crew_id: null,
    })
    const [goodData, setGood] = useState<goodState>({
        name: '',
        crew_id: null,
    })
    const [error, setError] = useState('')

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
    }, []);

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

    const [equipText, setEquipText] = useState('');
    const [goodText, setGoodText] = useState('');

    const handleEquipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEquip({
            ...equipData,
            [e.target.name]: e.target.value,
        });
        setEquipText(e.target.value)
    };

    const addEquip = async (e: React.FormEvent)=>{
        e.preventDefault();
        if (crew) {
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
                setEquipText('')
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
        setGoodText(e.target.value)
    };

    const addGood = async (e: React.FormEvent)=>{
        e.preventDefault();
        if (crew) {
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
                setGoodText('')
            } catch (err) {
                setError('Ошибка добавлении продуктов')
                console.error(error)
            }
        }
    }

    return (
        <div>
            <Modal show={show} onHide={onHide} centered style={{fontFamily:"G8"}}>
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
                                            <FormGroup>
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
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-center w-100 flex-row">
                                            <Form.Group controlId="name" className="">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Form.Label>Новый элемент снаряжения?</Form.Label>
                                                </div>
                                                <div className="d-flex pb-3">
                                                    <Form.Control
                                                        id="equip"
                                                        type="name"
                                                        name="name"
                                                        placeholder="Хайджек"
                                                        value={equipText}
                                                        onChange={handleEquipChange}
                                                    />
                                                    <Button variant="outline-dark" className="mx-2" onClick={addEquip}>
                                                        <FontAwesomeIcon icon={faPlus} className="mx-0" />
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-center w-100 flex-row">
                                            <Form.Group controlId="name" className="">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <Form.Label>Новый продукт?</Form.Label>
                                                </div>
                                                <div className="d-flex pb-3">
                                                    <Form.Control
                                                        id="good"
                                                        type="name"
                                                        name="name"
                                                        placeholder="Сгущенка"
                                                        value={goodText}
                                                        onChange={handleGoodChange}
                                                    />
                                                    <Button variant="outline-dark" className="mx-2" onClick={addGood}>
                                                        <FontAwesomeIcon icon={faPlus} className="mx-0" />
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                        <Row>
                            <Button className="m-2">Все верно!</Button>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UpdateCrew