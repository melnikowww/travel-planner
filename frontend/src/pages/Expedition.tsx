import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import {useState, useEffect} from "react";
import {Expedition, User} from "../../types.ts";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate, useSearchParams} from "react-router-dom";
import Navbar from "../elements/Navbar.tsx"
import CrewChoice from "../elements/CrewChoice.tsx";
import Load from "../elements/Loading.tsx";
import ErrorPage from "../elements/Error.tsx";
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import Contacts from "../elements/Contacts.tsx";

const ExpeditionProfile = () => {
    const [user, setUser] = useState<User | null>(null)
    const [exp, setExp] = useState<Expedition | null>(null)
    const [drivers, setDrivers] = useState<User[]>([])
    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [searchParams, _] = useSearchParams();
    const [markers] = useState<[number, number][]>([]);

    const fetchExp = async () => {
        const expeditionId = searchParams.get('id');
        try {
            const [expeditionResponse, driversResponse, userResponse] = await Promise.all([
                axios.get<Expedition>(`http://localhost:8081/expeditions?id=${expeditionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }),
                axios.get<User[]>(`http://localhost:8081/expedition_drivers?id=${expeditionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }),
                axios.get<User>('http://localhost:8081/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                })
            ]);
            setExp(expeditionResponse.data);
            setDrivers(driversResponse.data);
            setCurrentUser(userResponse.data);
          setError('');
      } catch (err) {
          setError('Ошибка при загрузке экспедиции')
          console.log(error)
      } finally {
          setLoading(false)
      }
    }

    useEffect(() => {
        const driverId = localStorage.getItem("id") ? parseInt(localStorage.getItem("id") as string) : 0;
        if (drivers) {
            const isDriverPresent = drivers.filter((driver) => driver.id === driverId).length > 0;
            setButtonDisabled(isDriverPresent);
        }
    }, [currentUser, drivers]);

    useEffect(() => {
        fetchExp()
    }, []);


    useEffect(() => {
        exp?.points.map((point) => {
            let coords = point.location.split(',')
            let coord1 = parseFloat(coords[0])
            let coord2 = parseFloat(coords[1])
            let arr = [coord1, coord2] as [number, number]
            markers.push(arr)
        })
    }, [exp]);

    useEffect(()=> {
        if (exp) {
            const start = new Date(exp.starts_at).toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setDateStart(start)
            const end = new Date(exp.ends_at).toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setDateEnd(end)
        }
    }, [exp])

    const [showCrewModal, setCrewModal] = useState(false)
    const registerToExpedition = async () => {
        if (localStorage.getItem("authToken") === null) {
            navigate("/")
        } else {
            setCrewModal(true)
        }
    }

    if (loading) return (<Load/>);
    if (error) return <ErrorPage error={error}/>

    return (
        <Container
            className="d-flex flex-column ps-0 scroll expedition-page"
            style={{
                fontFamily: "Rubik",
                fontWeight:'lighter',
                minWidth:"100vw",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >
            <Row className="w-100 mx-0 px-0">
                <Navbar hide={false} expeditionsShadow={false}
                        aboutShadow={false} profileShadow={false}
                        contactsShadow={false} userData={(user) => setUser(user)}/>
            </Row>
            <Row className="w-100 mx-0 px-0 mt-5" >
                <Col className="d-flex justify-content-center py-3">
                    <p className="mb-0" style={{ fontSize: "50px", fontFamily: "G8-Bold" }}>
                        {exp?.name}
                    </p>
                </Col>
            </Row>
            <Row className="w-100 mx-0 px-0">
                <Col className="d-flex justify-content-center py-3">
                    <p className="mb-0" style={{ fontSize: "25px", fontFamily: "G8-Bold" }}>
                        {dateStart}-{dateEnd}
                    </p>
                </Col>
            </Row>
            {exp && (exp?.description.length > 0) && <Row className="d-flex mx-2 px-2 py-4 mb-3 rounded-4" style={{
                backgroundColor: "rgba(45,45,45,0.8)",
                border: "2px solid #DAA520",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                color:"honeydew"
            }}>
                <Col className="mx-0 px-0">
                    <div className="fs-4 justify-content-center align-items-center text-center" style={{ textAlign: "justify" }}>
                        {exp?.description}
                    </div>
                </Col>
            </Row>}
            <Row className="d-flex expedition mt-2 mx-0 px-0">
                {exp && exp.crews.length > 0 && <Col className="d-flex align-items-center flex-column px-0">
                    <div className='rounded-4 px-5 py-3 mx-2' style={{
                        backgroundColor: "rgba(45,45,45,0.8)",
                        border: "2px solid #DAA520",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        color:'honeydew'
                    }}>
                        <h1 style={{fontFamily: "G8-Bold"}}>Экипажи:</h1>
                        <ol className="fs-4">
                            {exp?.crews?.map((c) => {
                                let driver = drivers.find(d => d.id === c.driver_id);
                                let car;
                                if (driver) {
                                    car = driver.cars.find(car => car.id === c.car_id)
                                }
                                return (
                                    <li key={c.id}>
                                        {driver && car ? `${driver.name}, ${car.name}` : null}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </Col>}
                {exp && exp.points.length > 0 && <Col className="d-flex align-items-center flex-column mx-0 px-0 mb-4 mt-4">
                    <div className='rounded-4 px-5 py-3 mx-2' style={{
                        backgroundColor: "rgba(45,45,45,0.8)",
                        border: "2px solid #DAA520",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        color: 'honeydew'
                    }}>
                        <h1 style={{fontFamily: "G8-Bold"}}>Контрольные точки:</h1>
                        <ol className="fs-4">
                            {exp?.points.sort((a, b) => a.position - b.position).map((e) => (
                                <li key={e.id}>{e.name} ({e.location})</li>
                            )) || 0}
                        </ol>
                    </div>
                </Col>}
            </Row>
            <Row>
                <Col>
                    <div className='m-4 mt-3 rounded-4' style={{
                        backgroundColor: "rgba(45,45,45,0.8)",
                        border: "2px solid #DAA520",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        color: 'honeydew',
                        overflow:'hidden',
                    }}>
                        <YMaps
                            query={{
                                load: "package.full",
                                apikey: "6896548d-124b-46a2-866d-67213d6c0a46"
                            }}
                        >
                            <Map
                                defaultState={{ center: markers.length > 0 ? markers[0] : [59.95, 30.37], zoom: 7 }}
                                style={{height:'500px'}}
                            >
                                {markers.map((pnt, index) => (
                                    <Placemark
                                        key={`marker-${index}`}
                                        geometry={pnt}
                                        options={{
                                            preset: 'islands#darkBlueCircleDotIcon',
                                            draggable: false

                                        }}
                                        properties={{
                                            hintContent: exp?.points[index].name,
                                        }}
                                    />
                                ))}
                            </Map>
                        </YMaps>
                    </div>
                </Col>
            </Row>
            <Row className="pb-0" hidden={buttonDisabled}>
                <Col className="d-flex justify-content-center">
                    <Button className="submit-btn mb-2" style={{width: "fit-content"}}
                            onClick={() => registerToExpedition()}>
                        <p className="fs-4 m-0">Поехали!</p>
                    </Button>
                    {showCrewModal && <CrewChoice userData={user} drivers={drivers} expedition={exp ? exp : null} show={showCrewModal} onHide={()=>{setCrewModal(false)}}/>}
                </Col>
            </Row>
            <Contacts/>
        </Container>
    )
}
export default ExpeditionProfile