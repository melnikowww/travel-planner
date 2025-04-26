import { Container } from "react-bootstrap";

const Contacts = () => {
    return (
        <Container fluid className="telegram-container position-fixed bottom-0 start-0 p-3 text-end"
                   style={{pointerEvents: 'none'}}
        >
            <a
                href="https://t.me/ironasstour"
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-link"
                style={{pointerEvents:'fill'}}
            >
                <svg className="telegram-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.429.26-.107 0-.25-.035-.25-.192l.204-2.37 5.537-5.043c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.203-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
            </a>
        </Container>
    )
}

export default Contacts;