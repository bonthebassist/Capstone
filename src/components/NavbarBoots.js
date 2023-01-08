import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useContext } from 'react'
import { AuthContext } from "../context/AuthProvider"
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

function NavbarBoots() {
  const { auth, setAuth } = useContext(AuthContext)
    const Logout = () => {
        console.log("in the logout function")
        setAuth({ user_id: "", token:"" })
        localStorage.clear();
      }

  return (
    <>
      {[true, 'sm', 'md'].map((expand) => (
        <Navbar key={expand} fixed="top" expand={expand} className="mb-3" bg="light" variant="light">
          <Container fluid>
            <LinkContainer to="/">
            <Navbar.Brand to="/" id="site-title">Chuta</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Chuta
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  
                  {!auth.user_id ?
                  <>
                  <LinkContainer to="/Login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/Register">
                    <Nav.Link>Sign Up</Nav.Link>
                  </LinkContainer>
                  </> 
                  : null}
                  {auth.token ? 
                  <>
                  <LinkContainer to="/Schools">
                    <Nav.Link>Schools</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/Students">
                    <Nav.Link>Students</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/Attendance">
                    <Nav.Link>Attendance</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/Invoice">
                    <Nav.Link>Invoicing</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/MyDetails">
                    <Nav.Link>My Details</Nav.Link>
                  </LinkContainer>
                  <Button onClick={Logout}>Logout</Button>
                  </>
                  : null}
                  
                  
                  </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavbarBoots;