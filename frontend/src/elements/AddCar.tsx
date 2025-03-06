import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form, Modal} from "react-bootstrap";
import {User} from "../../types.ts";

interface ModalProps {
    show: boolean;
    onHide: () => void;
}

interface FormState {
    id: bigint | null;
    name: string;
    error: string | null;
}


const AddCar: React.FC<ModalProps> = ({show, onHide}) => {
    if (!show) return null;

    const [formData, setFormData] = useState<FormState>({
        id: null,
        name: '',
        error: null
    });

    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post<User>(`http://localhost:8081/cars`,
                formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                })
            setError('')
            window.location.reload()
        } catch (err) {
            setError('Ошибка при изменении пользователя')
            console.error(error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered style={{fontFamily:"G8"}}>
            <Modal.Header closeButton>
                <div className="d-flex container">
                    <div className="d-flex col justify-content-center">
                        <Modal.Title>
                            <p className="my-0">
                                Введите название автомобиля
                            </p>
                        </Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Введите марку и модель</Form.Label>
                        <Form.Control
                            type="name"
                            name="name"
                            placeholder="Lada Niva"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>


                    <div className="d-flex container w-100">
                        <div className="d-flex col justify-content-center">
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-50"
                            >
                                Подтвердить
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCar;