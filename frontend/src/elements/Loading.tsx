import {Container, Row} from "react-bootstrap";
import Navbar from "./Navbar.tsx";
import pulseGif from "../assets/pulse.gif";


const Load = ()=> {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center" style={{
            minWidth:"100vw",
            minHeight:"100vh"
        }}>
            <Row className="justify-content-md-center">
                <Navbar hide={false} expeditionsShadow={false}
                        aboutShadow={false} profileShadow={false}
                        contactsShadow={false}/>
                <img
                    src={pulseGif}
                    style={{
                        width: '140px',
                    }}
                    alt="Loading"
                />
            </Row>
        </Container>
    );
}

export default Load