import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Car, Crew, User} from "../../types.ts";
import {Modal} from "react-bootstrap";
import axios from "axios";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    driverId: number;
    expeditionId: number;
}


const ShowCrew: React.FC<ModalProps> = ({show, onHide, driverId, expeditionId}) => {
    const [crew, setCrew] = useState<Crew | null>(null);
    const [driver, setDriver] = useState<User | null>(null);
    const [crewCar, setCrewCar] = useState<Car | null>(null)
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
        }
    };

    useEffect(() => {
        fetchCrew()
    }, [driverId, expeditionId]);

    useEffect(() => {
        let car;
        if (driver && crew) {
            car = driver.cars.find((car) => car.id === crew.car_id)
        }
        if (car) {
            setCrewCar(car)
        }
    }, [crew , driver]);

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
            }
        }
    }

    useEffect(() => {
        findUser()
    }, [crew]);

    interface CrewProps {
        title: string;
        items: Array<{
            id: number;
            name: string;
        }>;
        emptyText?: string;
    }


    const CrewList: React.FC<CrewProps> = ({ title, items, emptyText = 'Нет данных' }) => (
        <div className="crew-list text-light info-card">
            <div className="crew-list-title">
                <span>{title}</span>
                <span className="badge bg-primary-soft text-primary rounded-pill">
                    {items.length}
                </span>
            </div>
            {items.length > 0 ? (
                <ul className="crew-list-items">
                    {items.map(item => (
                        <li key={item.id} className="crew-list-item bg-dark">
                            {item.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-muted small">{emptyText}</div>
            )}
        </div>
    );

    return (
        driver && crew ?
        <div className='mx-auto' style={{overflowY:'scroll'}}>
            <Modal
                show={show}
                onHide={onHide}
                centered
                className="crew-modal"
                contentClassName="border-0 shadow-lg bg-dark text-light"
            >
                <Modal.Header className="p-4 border-bottom-0">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="h4 text-primary">
                            <span className="badge bg-primary-soft text-light">Экипаж #{crew.id}</span>
                        </Modal.Title>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onHide}
                            aria-label="Close"
                        />
                    </div>
                </Modal.Header>

                <Modal.Body className="p-4 pt-0">
                    <div className="d-grid gap-3">
                        <div className="info-card bg-light-soft">
                            <div className="info-label text-muted">Водитель</div>
                            <div className="info-value text-light fw-medium">
                                {driver?.name || <span className="text-muted">Не назначен</span>}
                            </div>
                        </div>

                        <div className="info-card bg-light-soft">
                            <div className="info-label text-muted">Автомобиль</div>
                            <div className="info-value text-light fw-medium">
                                {crewCar?.name || <span className="text-muted">Не выбран</span>}
                            </div>
                        </div>

                        <div className="d-grid gap-3">
                            <CrewList
                                title="Пассажиры"
                                items={crew.members.filter(m => m.id !== crew.driver_id)}
                                emptyText="Налегке!"
                            />

                            <CrewList
                                title="Снаряжение"
                                items={crew.equipment}
                            />

                            <CrewList
                                title="Продукты"
                                items={crew.goods}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div> : null
    )
}

export default ShowCrew