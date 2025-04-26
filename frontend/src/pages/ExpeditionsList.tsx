import {useState, useEffect} from "react";
import {Button, Col, Container} from "react-bootstrap";
import Navbar from "../elements/Navbar.tsx";
import {Expedition} from "../../types.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Load from "../elements/Loading.tsx";
import ErrorPage from "../elements/Error.tsx";
import Contacts from "../elements/Contacts.tsx";

const Expeditions = () => {
    const [expeditions, setExpeditions] = useState<Expedition[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const fetchExpeditions = async () => {
        try {
            const responseExpeditions = await axios.get<Expedition[]>('http://localhost:8081/expeditions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
            setExpeditions(responseExpeditions.data)
            setError('')
        } catch (err) {
            setError('Ошибка при загрузке экспедиций')
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchExpeditions()
    }, []);

    if (loading) return (<Load/>);
    if (error) return <ErrorPage error={error}/>

    return (
        <Container fluid className="d-flex flex-column w-100 h-100 px-0 align-items-start pb-4 expeditions"
                   style={{
                       minHeight:'100vh',
                       minWidth:'100vw',
                       backgroundColor: '#1A1A1A',
        }}>
            <Navbar hide={false} expeditionsShadow={true}
                    aboutShadow={false} profileShadow={false}
                    contactsShadow={false}/>
            <Container fluid className="d-flex expedition w-100 h-100" style={{fontFamily:'G8-Bold', marginTop:'90px', marginBottom:'70px'}}>
                {/*<Row className="d-flex column-gap-5 row-gap-3 py-2 mx-2 justify-content-start w-100" style={{height:'25vh'}}>*/}
                    {expeditions.map((e) => (
                        <Col
                            className="d-flex flex-column border border-3 rounded-3 justify-content-center align-items-center px-0 expedition-card"
                            key={e.id}
                            style={{borderColor: '#3D3D3D', }}>
                            <Button
                                variant="custom"
                                className='m-0 w-100 h-100 rounded-1'
                                onClick={() => navigate(`/expeditions?id=${e.id}`)}
                                style={{
                                    backgroundColor: 'rgba(45,45,45,0.85)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                }}>
                                <p className="fs-3 mb-1" style={{color: '#DAA520'}}>
                                    {e.name}
                                </p>
                                <p className="fs-6 text-center mb-1" style={{color: '#B0B0B0'}}>
                                    {new Date(e.starts_at).toLocaleString('ru-RU', {
                                        timeZone: 'Europe/Moscow',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}-{new Date(e.ends_at).toLocaleString('ru-RU', {
                                        timeZone: 'Europe/Moscow',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </p>
                                <p className='multiline-truncate mb-1' style={{textAlign:'justify', color: '#C0C0C0'}}>
                                    {e.description}
                                </p>
                                <p className='fs-5' style={{color: '#DAA520'}}>
                                    Экипажей: {e.crews.length}
                                </p>
                            </Button>
                        </Col>
                    ))}
                {/*</Row>*/}
            </Container>
        <Contacts/>
        </Container>
    )
}

export default Expeditions