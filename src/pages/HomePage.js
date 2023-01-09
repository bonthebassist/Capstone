import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import bigLogo from '../ChutaLogo-01.svg'
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

function HomePage() {

  //Navigation
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
              <h4 style={{ color: '#333', backgroundColor: 'rgba(67, 224, 230, .1)', padding: '10px' }}>As instrumental tutors our admin time isn't paid for. <br /> Use Chuta to stay on top!</h4>
              <button className="sign-up-button" onClick={() => handleClick(`Register`)}>Sign up</button>
              <button className="sign-up-button" onClick={() => handleClick(`login`)}>Log In</button>
            </Col>
          </Row>
          <Row>
            <Col className="about-div">
              <h4 style={{ color: '#333', backgroundColor: 'rgba(67, 224, 230, .1)', padding: '10px' }}>Specifically designed for <strong>instrumental tutors</strong></h4>
            </Col>
          </Row>
          <Row xs={1} md={3} xlg={3} className="g-4 home-card-div">
            <Col >
              <Card className="home-cards">
                <Card.Body className='home-cards-body'>
                  <Card.Title className='go-to-title' style={{ fontSize: '2em' }}>Track attendance </Card.Title>
                  <Card.Text className='go-to-title'><Icon icon="ic:baseline-table-view" width="80" /></Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>

              <Card className="home-cards">
                <Card.Body className='home-cards-body'>
                  <Card.Title className='home-card-title' style={{ fontSize: '2em' }}> Keep lesson notes</Card.Title>
                  <Card.Text className='go-to-title'><Icon icon="material-symbols:export-notes" width="80" /></Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>

              <Card className="home-cards">
                <Card.Body className='home-cards-body'>
                  <Card.Title className='home-card-title' style={{ fontSize: '2em' }}>Key Contacts</Card.Title>
                  <Card.Text className='go-to-title'><Icon icon="ri:contacts-fill" width="80" /></Card.Text>
                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default HomePage