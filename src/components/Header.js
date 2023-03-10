import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { logout, currentUser } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">PAWS Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser &&
            <>
              <Nav className="me-auto">
                <Nav.Link href="/">Patient List</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={() => logout()}>Log out</Nav.Link>
              </Nav>
            </>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;