import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Row, Col, Button, Nav } from 'react-bootstrap';

interface Props {
    hide: boolean;
}

const CustomNavbar: React.FC<Props> = ({hide}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        localStorage.removeItem('authToken');
    };

    return (
        <Navbar
            expand="lg"
            className="w-100 border-bottom border-2 border-black rounded-bottom-2"
            style={{
                backgroundColor: 'rgba(54, 69, 79, 0.9)',
                position:"fixed"
            }}
        >
            <Container fluid className="d-flex flex-column px-0" style={{ fontFamily: 'Scumbria'}}>
                <Row className="d-flex w-100 mx-0" style={{height:"40px"}}>
                    <Col className="d-flex justify-content-start align-items-center z-3">
                        <Button
                            hidden={hide}
                            variant="primary"
                            type="submit"
                            className="submit-btn"
                            style={{ fontFamily: 'Scumbria', color: 'darkred' }}
                            onClick={handleLogout}
                        >
                            Выйти
                        </Button>
                    </Col>

                    <Col className="d-flex position-absolute justify-content-center">
                        <Navbar.Brand href="/profile" className="mx-1">
                            <p className="mb-0 stroke-1">Outdoor Exploration</p>
                        </Navbar.Brand>
                    </Col>

                    <Col className="d-flex justify-content-end h-auto z-3 stroke-1">
                        <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            className="me-2"
                            style={{ zIndex: '11' }}
                        />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                            role="navigation"
                            style={{
                                position: 'absolute',
                                zIndex: '10',
                            }}
                        >
                            <Nav className="hamburger h-auto">
                                <Nav.Link onClick={() => navigate('/profile')}>Профиль</Nav.Link>
                                <Nav.Link onClick={() => navigate('/expeditions_all')}>Экспедиции</Nav.Link>
                                <Nav.Link href="">О нас</Nav.Link>
                                <Nav.Link href="">Контакты</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;