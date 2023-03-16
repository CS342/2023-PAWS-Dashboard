import { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from './paws-logo.svg';

export default function Login() {
   const emailRef = useRef();
   const passwordRef = useRef();
   const { login } = useAuth();
   const navigate = useNavigate();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         setError("");
         setLoading(true);
         await login(emailRef.current.value, passwordRef.current.value);
         navigate("/");
      } catch {
         setError("Failed to log in");
      }

      setLoading(false);
   }

   return (
      <Container>
         <Card className="mt-3" style={{width: '30em', height: '40em', margin: '0 auto'}}>
        
            <Card.Body>
           
            <img
              alt=""
              src={logo}
              width="100"
              height="100"
            />
              <h2 className="text-center mb-4"> </h2>
               <h2 className="text-center mb-4"> Log In</h2>
               
               {error && <Alert variant="danger">{error}</Alert>}
               <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                     <Form.Label >Email</Form.Label>
                     <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <Form.Group id="password">
                     <Form.Label>Password</Form.Label>
                     <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>
                  <br />
                  <Button style={{background: "salmon" }} disabled={loading} className="w-100" type="submit">
                     Log In
                  </Button>
               </Form>
               <div className="w-100 text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
               </div>

            </Card.Body>
       
         </Card>
      </Container>
   );
}
