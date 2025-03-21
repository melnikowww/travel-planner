import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import {useState, useEffect} from "react";
import {Expedition, User} from "../../types.ts";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {useNavigate, useSearchParams} from "react-router-dom";
import Navbar from "../elements/Navbar.tsx"
import CrewCreate from "../elements/CreateCrew.tsx";

const ExpeditionProfile = () => {
    const [exp, setExp] = useState<Expedition | null>(null)
    const [drivers, setDrivers] = useState<User[]>([])
    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [buttonDisabled, setbuttonDisabled] = useState(false)
    const [searchParams, _] = useSearchParams();

    const fetchExp = async () => {
        const expeditionId = searchParams.get('id');
        try {
          const responseExp = await axios.get<Expedition>('http://localhost:8081/expeditions?id=' +
              expeditionId, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`
              }
          })
          const responseDrivers = await axios.get<User[]>(
              'http://localhost:8081/expedition_drivers?id='+ expeditionId,
              {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`
              }
          })
          const responseUser = await axios.get<User>('http://localhost:8081/user', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
          });
          setExp(responseExp.data);
          setDrivers(responseDrivers.data);
          setCurrentUser(responseUser.data);
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
            setbuttonDisabled(isDriverPresent);
        }
    }, [currentUser, drivers]);

    useEffect(() => {
        fetchExp()
    }, []);

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
        if (localStorage.getItem("authToken") == null) {
            navigate("/register")
        } else {
            setCrewModal(true)
        }
    }

    if (loading) return (
        <Container className="d-flex flex-column align-items-center justify-content-center" style={{
            minWidth:"100vw",
            minHeight:"100vh"
        }}>
            <Row className="justify-content-md-center">
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Row>
        </Container>
    );
    if (error) return (
        <Container className="d-flex flex-column align-items-center" style={{
            minWidth:"100vw",
            minHeight:"100vh"
        }}>
            <Row className="d-flex w-100 mx-0 px-0 h-100">
                <Col className="d-flex justify-content-center align-items-start">
                    <Navbar hide={false} expeditionsShadow={false}
                            aboutShadow={false} profileShadow={false}
                            contactsShadow={false}/>
                </Col>
            </Row>
            <Container className="d-flex w-100 mx-0 px-0 justify-content-center align-items-center" style={{
                minWidth:"100vw",
                minHeight:"100vh"
            }}>
                    {error}😒
            </Container>
        </Container>
    )

    return (
        <Container
            className="d-flex flex-column ps-0 scroll"
            style={{
                fontFamily: "G8",
                minWidth:"100vw",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >
            <Row className="w-100 mx-0 px-0">
                <Navbar hide={false} expeditionsShadow={false}
                        aboutShadow={false} profileShadow={false}
                        contactsShadow={false}/>
            </Row>
            <Row className="w-100 mx-0 px-0 mt-5">
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
            <Row className="w-100 mx-0 px-2 mb-3">
                <Col className="mx-0 px-0">
                    <div className="fs-4 justify-content-center align-items-center " style={{ textAlign: "justify" }}>
                        {exp?.description}
                    </div>
                </Col>
            </Row>
            <Row className="d-flex expedition mt-2 mx-0 px-0">
                <Col className="d-flex align-items-center flex-column mx-0 px-0">
                    <h1 style={{fontFamily: "G8-Bold"}}>Экипажи:</h1>
                    <ol className="fs-4">
                        {exp?.crews?.map((c) => {
                            let driver = drivers.find(d => d.id === c.driver_id);
                            console.log(driver)
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
                </Col>
                <Col className="d-flex align-items-center flex-column mx-0 px-0 mb-4">
                    <h1 style={{fontFamily: "G8-Bold"}}>Контрольные точки:</h1>
                    <ol className="fs-4">
                        {exp?.points.map((e) => (
                            <li key={e.id}>{e.name} ({e.location})</li>
                        )) || 0}
                    </ol>
                </Col>
            </Row>
            <Row className="pb-0" hidden={buttonDisabled}>
                <Col className="d-flex justify-content-center">
                    <Button className="submit-btn" style={{width:"fit-content"}} onClick={()=>registerToExpedition()}>
                        <p className="fs-4 my-0">Поехали!</p>
                    </Button>
                    <CrewCreate show={showCrewModal} onHide={()=>{setCrewModal(false)}}/>
                </Col>
            </Row>
        </Container>
    )
}
export default ExpeditionProfile