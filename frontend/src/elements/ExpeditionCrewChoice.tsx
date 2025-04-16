import React, {useState} from "react";
import {Button, Container, Modal, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import UpdateCrew from "./UpdateCrew.tsx";
import ShowCrew from "./ShowCrew.tsx";

interface ModalProps {
    show: boolean;
    onHide: () => void;
    driverId: number;
    expeditionId: number;
    disabledExp: boolean;
    disabledCrew: boolean;
}

const ExpeditionCrew: React.FC<ModalProps> = ({show, onHide, expeditionId, driverId, disabledExp, disabledCrew}) => {
    const navigate = useNavigate()
    const [showCrewUpdate, setShowCrewUpdate] = useState(false)
    const [showCrew, setShowCrew] = useState(false)
    return (
        <div>
            <Modal show={show} onHide={onHide} centered contentClassName='bg-dark text-light'>
                <Modal.Header closeButton className="p-2">
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">
                                    Что делаем?
                                </p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="px-0">
                    <Container className="d-flex w-100 justify-content-center flex-column p-0 align-items-center justify-content-center row-gap-2">
                        <Row className="w-100 justify-content-center">
                            <Button variant="primary" className="submit-btn w-75"
                                    onClick={()=> navigate("/expeditions?id=" + expeditionId)}>
                                Посмотрим экспедицию
                            </Button>
                        </Row>
                        {!disabledExp &&
                            <Row className="w-100 justify-content-center">
                                <Button variant="primary" className= "submit-btn w-75">
                                    Отредактируем экспедицию
                                </Button>
                            </Row>
                        }
                        <Row className="w-100 justify-content-center">
                            <Button variant="primary" className="submit-btn w-75"
                                    onClick={()=> {onHide(); setShowCrew(true)}}>
                                Посмотрим экипаж
                            </Button>
                        </Row>
                        {!disabledCrew &&
                            <Row className="w-100 justify-content-center">
                                <Button disabled={disabledCrew} variant="primary" className="submit-btn w-75" onClick={()=> {onHide(); setShowCrewUpdate(true)}}>
                                    Отредактируем экипаж
                                </Button>
                            </Row>
                        }
                    </Container>
                </Modal.Body>
            </Modal>
            {showCrewUpdate ? <UpdateCrew
                show={showCrewUpdate}
                onHide={()=>setShowCrewUpdate(false)}
                driverId={driverId}
                expeditionId={expeditionId}/> : null}
            {showCrew ? <ShowCrew
                show={showCrew}
                onHide={()=>setShowCrew(false)}
                driverId={driverId}
                expeditionId={expeditionId}/> : null}
        </div>
    );
};

export default ExpeditionCrew;