import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Button, Card, CardGroup } from 'react-bootstrap'
import axios from 'axios'
import { AuthContext } from '../context/AuthProvider';
import { MDBIcon } from 'mdb-react-ui-kit';
// import { Icon } from '@iconify/react';

function DisplaySchoolInfo() {
  const params = useParams();
  const schoolName = params.schoolName
  const { auth } = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState()
  const [studentData, setStudentData] = useState()
  const [studentEmails, setStudentEmails] = useState([])
  const [parentEmails, setParentEmails] = useState([])
  const [addAdminClick, setAddAdminClick] = useState(false)
  const [addLinkClick, setAddLinkClick] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    contactName: '',
    contactEmail:''
  })

  const navigate = useNavigate();

  function handleClick(path) { navigate(path); }


  useEffect(() => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/schoolsBytutorID?tutor=${auth.user_id}`, config)
      .then((resp) => {
        console.log("in the .then")
        console.log(resp)
        let allSchools = resp.data
        let actualSchool = allSchools.filter(function (el) {
          return el.schoolName === schoolName
        })
        setSchoolsData(actualSchool[0])
      })
  }, [auth])

  useEffect(() => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/studentsBytutorID?tutor=${auth.user_id}`, config)
      .then((resp) => {
        console.log("in the .then of students effect")
        console.log(resp.data)
        let allStudents = resp.data
        let actualStudents = allStudents.filter(function (el) {
          return el.schoolName === schoolName
        })
        setStudentData(actualStudents)

        console.log(actualStudents)
        let studentEmailArray = actualStudents.map((student)=>{
          return student.studentEmail
        })
        let joinedStudentEmails = studentEmailArray.join()
        setStudentEmails(joinedStudentEmails[0])

        let parentEmailArray = actualStudents.map((student)=>{
          return student.parentEmail
        })
        let joinedParentEmails = parentEmailArray.join()
        setParentEmails(joinedParentEmails[0])
      })
  }, [auth])

  const saveNewAdmin = () => {
    const reqBody = {
      school_id: schoolsData._id,
      contactName: newAdmin.contactName,
      contactEmail: newAdmin.contactEmail
    }
    console.log(reqBody)
  }
 
  return (
    <>
      {!schoolsData ? null : (
        <div className='content-div'>
          <h2 className='page-title'>{schoolName}</h2>
          <h5>Contacts</h5>
          <CardGroup>
            <Card className='add-card' >
              <Card.Body onClick={(e) => {
                e.preventDefault();
                window.location.href = `mailto:${schoolsData.schoolAdmin[0].contactEmail}`;
              }}>
                <Card.Title>{schoolsData.schoolAdmin[0].contactName}</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body onClick={(e) => {
                e.preventDefault();
                console.log(studentEmails)
                window.location.href = `mailto:${studentEmails}?cc=${parentEmails}`;
              }}>
                <Card.Title>All students</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body onClick={(e) => {
                e.preventDefault();
                console.log(parentEmails)
                window.location.href = `mailto:${parentEmails}`;
              }}>
                <Card.Title>All parents</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body onClick={() => setAddAdminClick(true)}>
                <Card.Title> <MDBIcon fas icon="plus" /> Add </Card.Title>
              </Card.Body>
            </Card>
          </CardGroup>
          {/* {!setAddAdminClick ? null : (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Administrator Name</Form.Label>
                <Form.Control
                type='text'
                value={newAdmin.contactName}
                onChange={(e)=> setNewAdmin({...newAdmin, contactName: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Administrator Email</Form.Label>
                <Form.Control
                type='email'
                value={newAdmin.contactName}
                onChange={(e)=> setNewAdmin({...newAdmin, contactEmail: e.target.value})}
                />
              </Form.Group>
              <Button onClick={saveNewAdmin}>Save</Button>
            </Form>
          )} */}
          <h5>Quick Links</h5>
          <CardGroup>
            <Card className='add-card' >
              <Card.Body onClick={(e) => {
                e.preventDefault();
                window.location.href = `${schoolsData.usefulLinks[0].linkURL}`;
              }}>
                <Card.Title>{schoolsData.usefulLinks[0].linkTitle}</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body onClick={() => setAddLinkClick(true)}>
                <Card.Title> <MDBIcon fas icon="plus" /> Add </Card.Title>
              </Card.Body>
            </Card>
          </CardGroup>

          {/* {!setAddLinkClick ? null : (
            <Form>
              <Form.Group>
                <Form.Label>Administrator Name</Form.Label>
                <Form.Control
                type='text'
                value={newAdmin.contactName}
                onChange={(e)=> setNewAdmin({...newAdmin, contactName: e.target.value})}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Administrator Email</Form.Label>
                <Form.Control
                type='email'
                value={newAdmin.contactName}
                onChange={(e)=> setNewAdmin({...newAdmin, contactEmail: e.target.value})}
                />
              </Form.Group>
              <Button onClick={saveNewAdmin}>Save</Button>
            </Form>
          )} */}

          <h4>Students</h4>
          {studentData ? studentData.map((student) => {
            return (
              <CardGroup>
                <Card className='student-card'>
                  <Card.Body onClick={() => handleClick(`/DisplayStudent/${student.studentFirstName + " " + student.studentLastName}`)}>
                    <Card.Title className='student.card.title'>{student.studentFirstName} {student.studentLastName}</Card.Title>
                    <Card.Text>{student.instrument} . Year {student.yearLevel}</Card.Text>
                  </Card.Body>
                </Card>
              </CardGroup>
            )
          }) : null}
          <Card className='add-card' >
            <Card.Body onClick={() => handleClick(`/Students/NewStudent`)}>
              <Card.Title> <MDBIcon fas icon="plus" /> Add a Student</Card.Title>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  )
}

export default DisplaySchoolInfo