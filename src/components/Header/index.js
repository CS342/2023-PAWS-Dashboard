import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../paws-logo.svg';
import {  Stack } from '@mui/material';

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
            <Stack direction="row" spacing={2}>
              <Nav className="me-auto">
                  <Nav.Link href="/">Patients</Nav.Link>
                </Nav>
                <Nav className="me-auto">
                  <Nav.Link href="/records">All Records</Nav.Link>
                </Nav>
            </Stack>
             
            <div className="ml-auto"> {/* Use ml-auto to align the content to the right */}
              <Nav>
                <Nav.Link onClick={() => logout()}>
                  Log out
                </Nav.Link>
              </Nav>
            </div>
            </>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
