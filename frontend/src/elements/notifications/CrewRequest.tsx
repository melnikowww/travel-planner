import {Button, Col, Container, Row} from "react-bootstrap";
import React from "react";
import {Message, Status} from "../../../types.ts";
import axios from "axios";

interface Props {
    n: Message;
    onAccept: () => void;
    onReject: () => void;
}

// Управление запросами на участие
const CrewRequest: React.FC<Props> = ({n, onAccept, onReject}) => {

    const acceptRequest = async () => {
        // Достаем экипаж
        const crewToUpdate = await axios.get("http://localhost:8081/crews?id=" + n.crewId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })

        // Достаем пользователя для добавления
        const userToAdd = await axios.get("http://localhost:8081/users?id=" + n.producerId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })

        crewToUpdate.data.seats = crewToUpdate.data.seats - 1;
        crewToUpdate.data.members = [...crewToUpdate.data.members, userToAdd.data];

        //Обновляем экипаж
        await axios.patch("http://localhost:8081/crews?id=" + crewToUpdate.data.id, crewToUpdate.data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })

        // Обновляем сообщение
        n.status = Status.Approved;
        let consumer = n.consumerId;
        n.consumerId = n.producerId;
        n.producerId = consumer;
        await axios.patch("http://localhost:8081/message?id=" + n.id, n, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        onAccept();
    }

    const rejectRequest = async () => {
        // Обновляем сообщение
        n.status = Status.Rejected;
        let consumer = n.consumerId;
        n.consumerId = n.producerId;
        n.producerId = consumer;
        await axios.patch("http://localhost:8081/message?id=" + n.id, n, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        onReject();
    }

    return (
        <Container>
            <Row>
                <Col lg={8} className={"d-flex align-self-center"}>
                    <>{n.expeditionName}: Запрос на участие в экипаже от {n.producerName}</>
                </Col>
                <Col lg={4} className={"d-flex justify-content-end align-self-center column-gap-3"} style={{height: "fit-content"}}>
                    <Button className={"submit-btn"} onClick={acceptRequest}>
                        Принять
                    </Button>
                    <Button variant={"danger"} onClick={rejectRequest}>
                        Отклонить
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}
export default CrewRequest;