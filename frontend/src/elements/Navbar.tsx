import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Row, Col, Button, Nav } from 'react-bootstrap';

interface Props {
    hide: boolean;
    profileShadow: boolean;
    expeditionsShadow: boolean;
    aboutShadow: boolean;
    contactsShadow: boolean;
}

const CustomNavbar: React.FC<Props> = ({
                                           hide,
                                           profileShadow,
                                           expeditionsShadow,
                                           aboutShadow,
                                           contactsShadow
}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        localStorage.removeItem('authToken');
    };

    return (
        <Navbar
            expand="xl"
            className="w-100 border-bottom border-2 border-black rounded-bottom-2"
            style={{
                backgroundColor: '#1A1A1A',
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                boxShadow: "0 1px 5px rgba(218, 165, 32, 0.4)",
                minHeight: "60px"
            }}
        >
            <Container fluid className="h-100 d-flex align-items-center px-0">
                <Row className="w-100 align-items-center justify-content-between">
                    <Col xs={1} lg={4} className="d-flex justify-content-start logout-btn">
                        <Button
                            hidden={hide}
                            variant="primary"
                            type="submit"
                            className="submit-btn justify-content-center text-center px-0 ms-2"
                            style={{ fontFamily: "Rubik", color: 'darkred' }}
                            onClick={handleLogout}
                        >
                            ВЫЙТИ
                        </Button>
                    </Col>

                    <Col xs={4} lg={4} className="d-flex justify-content-center navbar-logo">
                        <Navbar.Brand
                            href="/profile"
                            className="m-0"
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                color: '#DAA520',
                                fontSize: '2rem',
                                lineHeight: 1
                            }}
                        >
                            Outdoor Exploration
                        </Navbar.Brand>
                    </Col>

                    <Col xs={4} lg={4} className="d-flex justify-content-end align-items-center position-relative">
                        <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            className="me-2"
                            style={{
                                zIndex: '11',
                                position: 'relative',
                                borderColor: '#DAA520'
                            }}
                        />
                        <Navbar.Collapse
                            id="basic-navbar-nav"
                            role="navigation"
                            className='hamburger'
                            style={{
                                top: '100%',
                                right: 0,
                                zIndex: '12',
                                backgroundColor: '#1A1A1A',
                                minWidth: '200px'
                            }}
                        >
                            <Nav className="p-0 gap-2">
                                <Nav.Link
                                    onClick={() => navigate('/profile')}
                                    className='nav-link-custom'
                                    style={{
                                        color: profileShadow ? '#DAA520' : '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    Профиль
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/expeditions_all')}
                                    className='nav-link-custom'
                                    style={{
                                        color: expeditionsShadow ? '#DAA520' :  '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif",
                                        fontWeight: 500
                                    }}
                                >
                                    Экспедиции
                                </Nav.Link>
                                <Nav.Link
                                    onClick={()=>navigate('/about')}
                                    className='nav-link-custom'
                                    style={{
                                        color: aboutShadow ? '#DAA520' : '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif"
                                    }}
                                >
                                    О нас
                                </Nav.Link>
                                <Nav.Link
                                    className='nav-link-custom'
                                    style={{
                                        color: contactsShadow ? '#DAA520' :  '#FFFFFF',
                                        fontFamily: "'Rubik', sans-serif"
                                    }}
                                >
                                    Контакты
                                </Nav.Link>
                                <div className='d-lg-none'>
                                    <Nav.Link
                                        style={{
                                            color: 'darkred',
                                            fontFamily: "'Rubik', sans-serif"
                                        }}
                                    >
                                        Выйти
                                    </Nav.Link>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;