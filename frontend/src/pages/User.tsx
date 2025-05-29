import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import {useState, useEffect} from "react";
import {Expedition, Message, User} from "../../types.ts";
import {Button, Col, Container, Row} from "react-bootstrap";
import AddCarModal from "../elements/AddCar.tsx";
import UpdateCar from "../elements/UpdateCar.tsx";
import Navbar from "../elements/Navbar.tsx"
import ExpeditionCrew from "../elements/ExpeditionCrewChoice.tsx"
import Load from "../elements/Loading.tsx"
import ErrorPage from "../elements/Error.tsx";
import AddExpedition from "../elements/AddExpedition.tsx";
// import AddExpeditionMobile from "../elements/AddExpeditionMobile.tsx";
import ReactPaginate, {ReactPaginateProps} from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Contacts from "../elements/Contacts.tsx";
import AddExpeditionMobile from "../elements/AddExpeditionMobile.tsx";


const useMobile = (breakpoint = 1000) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

const Profile = () => {
    const isMobile = useMobile()
    const [user, setUser] = useState<User>();
    const [expeditions, setExpeditions] = useState<Expedition[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')

    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 2;
    const pageCount = Math.ceil(expeditions.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = expeditions.slice(offset, offset + itemsPerPage);
    const [direction, setDirection] = useState<"left" | "right">("right");

    const handlePage: ReactPaginateProps['onPageChange'] = ({ selected }) => {
        setDirection(selected > currentPage ? "right" : "left");
        setCurrentPage(selected)
    }



    const fetchUser = async () => {
        try {
            const responseUser = await axios.get<User>('http://localhost:8081/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            const responseExpeditions = await axios.get<Expedition[]>('http://localhost:8081/user-to-exp', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            setUser(responseUser.data)
            setExpeditions(responseExpeditions.data)
            localStorage.setItem("avatar", responseUser.data.imgSrc)
            localStorage.setItem("id", responseUser.data.id.toString())
            setError('')
        } catch (err) {
            setError('Ошибка при загрузке пользователя')
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const [showExpCreate, setExpCreate] = useState(false);
    const [showCarCreate, setCarCreate] = useState(false);
    const [showCarUpdate, setCarUpdate] = useState(false);

    const handleCarAdd = () => {
        setCarCreate(true);
    }

    const [carId, setCarId] = useState(0)
    const handleCarUpdate = (id: number) => {
        setCarUpdate(true);
        setCarId(id)
    }

    const [showExpChoice, setExpChoice] = useState(false)
    const [expId, setExpId] = useState(0)
    const [canNotUpdateExp, setCanNotUpdateExp] = useState(false)
    const [canNotUpdateCrew, setCanNotUpdateCrew] = useState(false)
    const [driverId, setDriverId] = useState(0)

    const handleExpButton = (exp: Expedition) => {
        if (exp && user) {
            setExpChoice(true);
            setExpId(exp.id ?? 0);
            setCanNotUpdateExp(user.id !== exp.creator_id);
            const hasCrew = exp?.crews?.some(crew => crew.driver_id === user?.id) ?? false;
            setCanNotUpdateCrew(!hasCrew);
            const newDriverId = hasCrew ? user.id : user.crews.find(crew => crew.expedition_id === exp?.id)?.driver_id
            if (newDriverId) {
                setDriverId(newDriverId);
            }
        }
    };


    const [notifications, setNotifications] = useState<Message[]>([])
    const [news, setNews] = useState<Message[]>([])

    useEffect(() => {
        const getMessages = async () => {
            if (user) {
                try {
                    const [notificationsResponse, newsResponse] = await Promise.all([
                        axios.get<Message[]>(`http://localhost:8081/cons_messages?user=` + user.id, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`
                            }
                        }),
                        axios.get<Message[]>(`http://localhost:8081/last_messages`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("authToken")}`
                            }
                        })
                    ])
                    setNotifications(notificationsResponse.data)
                    setNews(newsResponse.data)
                } catch (e) {
                    setError('Ошибка при получении новостей...')
                }
            }
        }

        getMessages()

    }, [user]);


    if (loading) return <Load/>
    if (error) return <ErrorPage error={error}/>

    return (
        <Container
            fluid
            className="d-flex flex-column px-0 bg-image-profile mb-0 flex-row"
            style={{
                fontFamily: "'Rubik', sans-serif",
                minWidth: "100vw",
                minHeight: "100vh",
                backgroundColor: "#1A1A1A",
                color: "#FFFFFF",
                paddingTop: "60px"
            }}
        >
            <Navbar hide={false} expeditionsShadow={false}
                    aboutShadow={false} profileShadow={true}
                    contactsShadow={false}/>

            <Row className="d-flex mt-4 mx-3 g-4 align-items-start justify-content-center">
                <Col md={6} lg={5} className="pe-lg-3">
                    <div className="p-4 rounded-3 pb-0 mb-4" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "1px solid #3D3D3D"
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="flex-text" style={{
                                fontFamily: "'Rubik', sans-serif",
                                color: "#DAA520",
                            }}>
                                Экспедиции
                            </h2>
                            <Button
                                variant="outline-warning"
                                onClick={() => setExpCreate(true)}
                                className='add-car-button'
                                style={{
                                    borderColor: "#DAA520",
                                    color: "#DAA520"
                                }}
                            >
                                Добавить
                            </Button>
                        </div>

                        <div className="d-grid gap-2">
                            {currentItems?.map((exp) => (
                                <AnimatePresence mode="wait" key={`presence-${exp.id}`}>
                                    <motion.ul
                                        key={expId}
                                        layoutId={`exp-${exp.id}`}
                                        initial={{opacity: 0, x: direction === "right" ? -25 : 25}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: direction === "right" ? 25 : -25}}
                                        transition={{duration: 0.75}}
                                        className="list"
                                        style={{width: '100%', padding: '0', margin: '0', overflow: 'hidden'}}
                                    >
                                        <Button
                                            key={exp.id}
                                            variant="dark"
                                            className="text-start py-3 rounded-2 w-100"
                                            style={{
                                                border: "1px solid #3D3D3D",
                                                transition: "all 0.3s ease"
                                            }}
                                            onClick={() => handleExpButton(exp)}
                                        >
                                            <span className="d-block" style={{color: "#DAA520"}}>{exp.name}</span>
                                            <small
                                                className="text-muted">Даты: {new Date(exp.starts_at).toLocaleString('ru-RU', {
                                                timeZone: 'Europe/Moscow',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}-{new Date(exp.ends_at).toLocaleString('ru-RU', {
                                                timeZone: 'Europe/Moscow',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}</small>
                                        </Button>
                                    </motion.ul>
                                </AnimatePresence>
                            ))}
                        </div>
                        <div className='d-flex w-100 justify-content-center align-items-center'>
                            <ReactPaginate
                                className='pagination'
                                previousLabel={currentPage > 0 ? <FaChevronLeft
                                    color='floralwhite' size='15' style={{paddingBottom: '2px'}}/> : null}
                                nextLabel={currentPage < pageCount - 1 ? <FaChevronRight
                                    color='floralwhite' size='15' style={{paddingBottom: '2px'}}/> : null}
                                pageCount={pageCount}
                                marginPagesDisplayed={0}
                                pageRangeDisplayed={0}
                                onPageChange={handlePage}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                    <ExpeditionCrew show={showExpChoice} disabledExp={canNotUpdateExp} disabledCrew={canNotUpdateCrew}
                                    driverId={driverId}
                                    onHide={() => {
                                        setExpChoice(false);
                                        fetchUser();
                                    }}
                                    expeditionId={expId}/>


                    <div className="p-4 rounded-3" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "1px solid #3D3D3D"
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="flex-text" style={{
                                fontFamily: "'Rubik', sans-serif",
                                color: "#DAA520",
                                margin: 0
                            }}>
                                Автомобили
                            </h2>
                            <Button
                                variant="outline-warning"
                                onClick={handleCarAdd}
                                className='add-car-button'
                                style={{
                                    borderColor: "#DAA520",
                                    color: "#DAA520"
                                }}
                            >
                                Добавить
                            </Button>
                        </div>

                        <div className="d-grid gap-2">
                            {user?.cars?.map((car) => (
                                <Button
                                    key={car.id}
                                    variant="dark"
                                    className="text-start py-3 rounded-2"
                                    style={{
                                        border: "1px solid #3D3D3D",
                                        transition: "all 0.3s ease"
                                    }}
                                    onClick={() => handleCarUpdate(car.id)}
                                >
                                    <span className="d-block" style={{color: "#B0B0B0"}}>{car.name}</span>
                                </Button>
                            ))}
                            <UpdateCar show={showCarUpdate} onHide={() => setCarUpdate(false)} id={carId}/>
                        </div>
                    </div>
                    <AddCarModal show={showCarCreate} onHide={() => {
                        setCarCreate(false)
                    }}/>
                </Col>

                <Col md={6} lg={5} className="ps-lg-3">
                    <div className="p-4 rounded-3 pb-4 mb-2" style={{
                        backgroundColor: "rgba(45,45,45,0.75)",
                        border: "1px solid #3D3D3D"
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="flex-text" style={{
                                fontFamily: "'Rubik', sans-serif",
                                color: "#DAA520",
                            }}>
                                Новости
                            </h2>
                        </div>

                        <div className="d-grid gap-2 bg-dark rounded-2 p-3"
                             style={{
                                 backgroundColor: "rgba(45,45,45,0.9)",
                             }}
                        >
                            Уведомления
                        </div>
                    </div>
                </Col>


                {isMobile && showExpCreate ?
                    <AddExpeditionMobile show={showExpCreate} onHide={() => {
                        setExpCreate(false)
                    }}/> :
                <AddExpedition show={showExpCreate} onHide={() => {
                    setExpCreate(false)
                    fetchUser()
                }}/>}
        </Row>

    <Contacts/>
</Container>
)

}

export default Profile