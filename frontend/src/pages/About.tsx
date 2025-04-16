import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import Navbar from "../elements/Navbar.tsx";

const About = () => {
    const navigate = useNavigate()

    return(
        <Container
            fluid
            className="d-flex flex-column px-0 about-page bg-image-profile"
            style={{
                minWidth: "100vw",
                minHeight: "100vh",
                paddingTop: "90px",
            }}
        >
            <Navbar hide={false} expeditionsShadow={false}
                    aboutShadow={true} profileShadow={false}
                    contactsShadow={false}/>
            <Row className="mx-1 flex-grow-1 px-5" style={{margin: "0 auto"}}>
                <Col  className="d-flex flex-column gap-4">
                     Заголовок
                    <h1 className="text-center mb-4" style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "4.5rem",
                        color: "#DAA520",
                        letterSpacing: "4px",
                        textTransform: "uppercase"
                    }}>
                        OUTDOOR EXPLORATION
                    </h1>

                    {/* Блок "Наша миссия" */}
                    <div className="p-4 rounded-3 mission-block" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "2px solid #3D3D3D",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                    }}>
                        <h2 style={{
                            fontFamily: "'Rubik', sans-serif",
                            color: "#DAA520",
                            fontSize: "2.5rem",
                            marginBottom: "1.5rem"
                        }}>
                            Наша миссия
                        </h2>

                        <p style={{
                            fontFamily: "'Rubik', sans-serif",
                            fontSize: "1.1rem",
                            lineHeight: "1.6",
                            color: "#FFFFFF"
                        }}>
                            Outdoor Exploration - это профессиональный инструмент для организации внедорожных экспедиций.
                            Мы помогаем командам эффективно планировать маршруты, управлять ресурсами и координировать
                            действия всех участников приключения.
                        </p>
                    </div>

                    {/* Функционал сервиса */}
                    <div className="p-4 rounded-3 features-block" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "2px solid #3D3D3D",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                    }}>
                        <h2 style={{
                            fontFamily: "'Rubik', sans-serif",
                            color: "#DAA520",
                            fontSize: "2.5rem",
                            marginBottom: "2rem"
                        }}>
                            Возможности платформы
                        </h2>

                        <div className="d-flex flex-column gap-4">
                            {/* Карточки возможностей */}
                            {[
                                {
                                    title: "Планирование экспедиций",
                                    content: "Создавайте детальные планы маршрутов с указанием контрольных точек, временных рамок и необходимого снаряжения"
                                },
                                {
                                    title: "Управление экипажами",
                                    content: "Формируйте команды, распределяйте роли и отслеживайте готовность каждого участника"
                                },
                                {
                                    title: "Логистика снаряжения",
                                    content: "Контролируйте распределение оборудования и провизии между транспортными средствами"
                                },
                                // {
                                //     title: "Аналитика маршрутов",
                                //     content: "Получайте автоматизированные расчеты расхода топлива и оптимальных точек дозаправки"
                                // }
                            ].map((feature, index) => (
                                <div key={index} className="p-3 rounded-2 feature-card" style={{
                                    backgroundColor: "#1A1A1A",
                                    border: "1px solid #3D3D3D",
                                    transition: "all 0.3s ease"
                                }}>
                                    <h3 style={{
                                        fontFamily: "'Rubik', sans-serif",
                                        color: "#DAA520",
                                        fontSize: "1.8rem",
                                        marginBottom: "0.5rem"
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        fontFamily: "'Rubik', sans-serif",
                                        color: "#B0B0B0",
                                        lineHeight: "1.5"
                                    }}>
                                        {feature.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Призыв к действию */}
                    <div className="text-center mt-5">
                        <Button
                            variant="warning"
                            className="px-5 py-3 rounded-pill mb-4"
                            style={{
                                fontFamily: "'Rubik', sans-serif",
                                fontSize: "1.5rem",
                                letterSpacing: "1px",
                                background: "#DAA520",
                                border: "none",
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => navigate('/profile')}
                        >
                            ПОЕХАЛИ!
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default About