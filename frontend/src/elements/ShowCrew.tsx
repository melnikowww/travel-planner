import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Crew, User} from "../../types.ts";
import {Col, Container, Modal, Row, Spinner} from "react-bootstrap";
import axios from "axios";
import Navbar from "./Navbar.tsx";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    driverId: number;
    expeditionId: number;
}


const ShowCrew: React.FC<ModalProps> = ({show, onHide, driverId, expeditionId}) => {
    const [crew, setCrew] = useState<Crew | null>(null);
    const [driver, setDriver] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


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

            const responseCrew = await axios.get<Crew>(`http://localhost:8081/crew?${params}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });

            setCrew(responseCrew.data);
            setError('');
        } catch (e) {
            setError('Ошибка при поиске экипажа😐');
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchCrew()
    }, [driverId, expeditionId]);

    const findUser = async () => {
        if (crew) {
            try {
                const responseUser = await axios.get<User>(`http://localhost:8081/users?id=${crew.driver_id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                })
                setDriver(responseUser.data)
                setError('')
            } catch (e) {
                setError('Ошибка при поиске водителя😥')
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        findUser()
    }, [crew]);


    return (
        driver && crew ?
        <div>
            <Modal show={show} onHide={onHide} centered style={{fontFamily:"G8"}}>
                <Modal.Header closeButton className="p-3">
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">Данные об экипаже</p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body style={{
                    padding:0,
                    paddingBottom: "10px",
                }}>
                    <Container className="d-flex w-100 justify-content-center fs-5 flex-column align-items-center">
                        <Row className="w-100 m-1 column-gap-1">
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                Водитель
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                    {driver?.name}
                            </Col>
                        </Row>
                        <Row className="w-100 m-1 column-gap-1">
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                Автомобиль
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                    {driver&&crew ? driver.cars.find((car) => car.id === crew.car_id).name || "Машина не найдена" : null}
                            </Col>
                        </Row>
                        <Row className="w-100 m-1 column-gap-1">
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                Пассажиры
                            </Col>
                            <Col className="d-flex justify-content-start align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                {crew.members.length === 0 ?
                                    <p>Налегке!</p> :
                                    <ol className="m-0">
                                    {crew.members.map((m) => (
                                        m.id != crew.driver_id ?
                                            <li key={m.id}>
                                                {m.name}
                                            </li> :
                                            null)) || 0}
                                    </ol>}
                            </Col>
                        </Row>
                        <Row className="w-100 m-1 column-gap-1">
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                Снаряжение
                            </Col>
                            <Col
                                className="d-flex justify-content-start align-items-center border border-black rounded-2"
                                style={{backgroundColor: "blanchedalmond"}}>
                                <ol className="m-0">
                                    {crew.equipment.map((eq) => (
                                        <li key={eq.id}>
                                            {eq.name}
                                        </li>
                                    )) || 0}
                                </ol>
                            </Col>
                        </Row>
                        <Row className="w-100 m-1 column-gap-1">
                            <Col className="d-flex justify-content-center align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                Продукты
                            </Col>
                            <Col className="d-flex justify-content-start align-items-center border border-black rounded-2" style={{backgroundColor:"blanchedalmond"}}>
                                <ol className="m-0">
                                    {crew.goods.map((g) => (
                                        <li key={g.id}>
                                            {g.name}
                                        </li>
                                    )) || 0}
                                </ol>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div> : null
    )
}

export default ShowCrew