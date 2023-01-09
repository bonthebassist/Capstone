import React from 'react'
import { AuthContext } from "../context/AuthProvider"
import { useContext } from 'react'
import { Card, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { Icon } from '@iconify/react';

function LoggedInHome() {
    //Context
    const { auth } = useContext(AuthContext)

    //Navigation
    const navigate = useNavigate();

    function handleClick(path) {
        navigate(path);
    }

    return (
        <Container>
            <div className='content-div'>
                <h4 className='welcome-msg'>Hi {auth.firstName}! What school are we at today?</h4>

                <Card className='go-to-cards'>
                    <Card.Body style={{ cursor: 'pointer' }} onClick={() => handleClick('/Schools')}>
                        <Card.Title className='go-to-title'>Go to Schools</Card.Title>
                        <Card.Text className='go-to-title'><Icon icon="fa6-solid:school" width="70" /></Card.Text>
                    </Card.Body>
                </Card>
                <Card className='go-to-cards'>
                    <Card.Body style={{ cursor: 'pointer' }} onClick={() => handleClick('/Students')}>
                        <Card.Title className='go-to-title'>Go to Students</Card.Title>
                        <Card.Text className='go-to-title'><Icon icon="mdi:account-music-outline" width="70" /></Card.Text>
                    </Card.Body>
                </Card>
                <Card className='go-to-cards'>
                    <Card.Body style={{ cursor: 'pointer' }} onClick={() => handleClick('/Attendance')}>
                        <Card.Title className='go-to-title'>View Attendance</Card.Title>
                        <Card.Text className='go-to-title'><Icon icon="ic:baseline-table-view" width="70" /></Card.Text>
                    </Card.Body>
                </Card>

            </div>
        </Container>
    )
}

export default LoggedInHome