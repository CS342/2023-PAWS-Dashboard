import { Container, Form, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setMessage("");
            setError("");
            setLoading(true);

            await resetPassword(emailRef.current.value);
            setMessage("Check your e-mail for a link to reset your password.")
        } catch {
            setError("Unable to reset your password.")
        }

        setLoading(false);
    }

    return (
        <Container>
            <Card className="mt-3" style={{ width: '25em', margin: '0 auto' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error &&
                        <Alert variant="danger"> {error} </Alert>
                    }
                    {message &&
                        <Alert variant="info"> {message} </Alert>
                    }
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <br />
                        <Button disabled={loading} className="w-100" type="submit">
                            Reset Password
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/login">Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
};

export default ForgotPassword;
