import { Container, Card } from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons'; 

export default function AdminWarning() {
    return (
        <Container>
            <Card className="mt-3" style={{ width: '25em', margin: '0 auto' }}>
                <Card.Body>
                    <ExclamationTriangle size={50} />
                    <h2 className="text-center mb-4">Error</h2>
                    <p>Only admins are allowed to access the dashboard. Please log in with an admin account.</p>
                </Card.Body>
            </Card>
        </Container>
    )
}
