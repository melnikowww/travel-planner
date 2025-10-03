import {Col, Container, Row} from "react-bootstrap";
import Navbar from "./Navbar.tsx";
import React from "react";

interface ErrorProps {
    error: string;
}

const ErrorPage : React.FC<ErrorProps> = ({error})=> {
    return (
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
}

export default ErrorPage;