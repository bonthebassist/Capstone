import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import bigLogo from '../ChutaLogo-01.svg'
import Diary from '../resources/home-icons-04.png'
import Mail from '../resources/home-icons-01.png'
import Invoice from '../resources/home-icons-03.png'
import Checklist from '../resources/home-icons-02.png'
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const navigate = useNavigate();

  function handleClick(path) {
    navigate(path);
  }

  return (
    <>
    <div className='home-div'>
      <Container fluid="true">
        <Row>
          <Col className="m-auto jumbo">
      <img
        className="d-block mx-auto img-fluid w-50"
        src={bigLogo}
        alt="chuta logo"
        id="home-logo"
      />
      </Col>
      </Row>
      <Row>
          <Col className="about-div">
          <h4>As instrumental tutors our admin time isn't paid for. Use Chuta to stay on top!</h4>
          <button className="sign-up-button" onClick={()=>handleClick(`Register`)}>Sign up</button>
          <button className="sign-up-button" onClick={()=>handleClick(`login`)}>Log In</button>
          </Col>
        </Row> 
      <Row>
        <Col className="about-div">
        <h4>Specifically designed for <strong>instrumental tutors</strong></h4>
        </Col>
      </Row>
        <Row xs={1} md={4} xlg={4}className="g-4 about-div">
        <Col >
        <Card className="home-cards">
          <Card.Img variant="top" src={Checklist} />
          <Card.Body className='home-cards-body'>
            <Card.Title className='home-card-title'>Log attendance</Card.Title>
          </Card.Body>
        </Card>
        </Col>
        <Col>
        
        <Card className="home-cards">
          <Card.Img variant="top" src={Diary} />
          <Card.Body className='home-cards-body'>
            <Card.Title className='home-card-title'>Send lesson notes</Card.Title>
          </Card.Body>
        </Card>
        </Col>
        <Col>
        
        <Card className="home-cards">
          <Card.Img variant="top" src={Invoice} />
          <Card.Body className='home-cards-body'>
            <Card.Title className='home-card-title'>Invoice fast</Card.Title>
          </Card.Body>
        </Card>
        </Col>
        <Col>
        
        <Card className="home-cards">
          <Card.Img variant="top" src={Mail} />
          <Card.Body className='home-cards-body'>
            <Card.Title className='home-card-title'>Key Contacts</Card.Title>
          </Card.Body>
        </Card>
        </Col>
        </Row>
      </Container>
      <footer>
      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2022 Copyright Bonnie Aue
      </div>
      </footer>
      </div>
      </>
  )
}

export default HomePage