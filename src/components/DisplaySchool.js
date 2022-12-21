import React from 'react'
import { MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit'
import { Card, CardGroup } from 'react-bootstrap'

function DisplaySchool() {
  let studentCards
  let attendanceTable
  let links
  let adminContact
  return (
    <div className='content-div'>
        <h2>Hills School</h2>
        <h4>Quick Links</h4>
        <ul>links here</ul>
        <h4>Attendance</h4>
        <table>table here</table>
        <h4>Music Diaries</h4>
        <CardGroup>
          <Card>
            <Card.Body>
              Clickable Student Cards
            </Card.Body>
          </Card>
        </CardGroup>
        <MDBBtn>Contact admin</MDBBtn>

    </div>
  )
}

export default DisplaySchool