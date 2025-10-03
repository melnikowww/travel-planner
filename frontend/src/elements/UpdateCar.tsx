import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Form, Modal} from "react-bootstrap";
import {Car} from "../../types.ts";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    id: number
}

const UpdateCar: React.FC<ModalProps> = ({show, onHide, id}) => {
    if (!show) return null;

    const [car, setCar] = useState<Car | null>(null);
    const [error, setError] = useState('')
    interface FormState {
        id: bigint | null;
        name: string;
        error: string | null;
    }

    const [formData, setFormData] = useState<FormState>({
        id: null,
        name: '',
        error: null
    });

    const fetchCar = async () => {
        try {
            const responseCar = await axios.get<Car>(`http://localhost:8081/cars?id=` + id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            setCar(responseCar.data)
            localStorage.setItem("carId", responseCar.data.id.toString())
            setError('')
        } catch (err) {
            setError('Ошибка при загрузке автомобиля')
            console.error(error)
        }
    };

    useEffect(() => {
        fetchCar()
    }, []);

    useEffect(() => {
        if (car) {
            setFormData({
                id: null,
                name: car.name, // Устанавливаем имя машины в formData
                error: null,
            });
        }
    }, [car]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.patch<Car>(`http://localhost:8081/cars?id=${car?.id}`,
                formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                })
            setError('')
            window.location.reload()
        } catch (err) {
            setError('Ошибка при изменении автомобиля')
            console.error(error.toString())
        }
    }

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.delete<Car>(`http://localhost:8081/cars?id=${car?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                })
            setError('')
            show=false
            window.location.reload()
        } catch (err) {
            setError('Ошибка при удалении автомобиля')
            console.error(error.toString())
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered style={{fontFamily:"Rubik"}} contentClassName='bg-dark text-light'>
            <Modal.Header closeButton>
                <div className="d-flex container">
                    <div className="d-flex col justify-content-center">
                        <Modal.Title>
                            <p className="my-0">
                                Что-то изменилось?..
                            </p>
                        </Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Введите новые марку и модель!</Form.Label>
                        <Form.Control
                            type="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className="d-flex container w-100">
                        <div className="d-flex">
                            <Button
                                variant="danger"
                                className="justify-content-start"
                                style={{background:'#C14545'}}
                                onClick={handleDelete}
                            >
                                Удалить
                            </Button>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                className="justify-content-end submit-btn"
                                onClick={()=>{show=false}}
                            >
                                Изменить
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateCar;