import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../paws-logo.svg';

export default function Header() {
  const { logout, currentUser } = useAuth();

  return (
    <Navbar className="color-nav" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          PAWS Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser &&
            <>
              <Nav className="me-auto">
                <Nav.Link href="/">Patient List</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={() => logout()}>

                  Log out
                </Nav.Link>
              </Nav>
            </>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
