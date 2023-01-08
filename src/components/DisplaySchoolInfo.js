import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {useParams} from 'react-router-dom'
import { Button, Card, CardGroup } from 'react-bootstrap'
import axios from 'axios'
import {AuthContext} from '../context/AuthProvider';
import {  MDBIcon } from 'mdb-react-ui-kit';

function DisplaySchoolInfo() {
  const params = useParams();
  const schoolName = params.schoolName
  const {auth} = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState()
  const [studentData, setStudentData] = useState()
  const navigate = useNavigate();

  function handleClick(path) { navigate(path);}


  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/schoolsBytutorID?tutor=${auth.user_id}`, config)
    .then((resp) => {
      console.log("in the .then")
      console.log(resp)
      let allSchools = resp.data
      let actualSchool = allSchools.filter(function (el){
        return el.schoolName === schoolName
      })
      setSchoolsData(actualSchool[0])
    })
  }, [auth])

  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/studentsBytutorID?tutor=${auth.user_id}`, config)
    .then((resp) => {
      console.log("in the .then of students effect")
      console.log(resp.data)
      setStudentData(resp.data)
    })
  }, [auth])


  return (
    <>
    {!schoolsData ? null : (
    <div>
        <h2>{schoolName}</h2>
        <Button>Contact admin</Button>
        <h4>Quick Links</h4>
        <a href={schoolsData.usefulLinks[0].linkURL}>{schoolsData.usefulLinks[0].linkTitle}</a>
        <h4>Attendance</h4>
        <table></table>
        <h4>Students</h4>
        {studentData ? studentData.map((student)=>{
        return (
        <CardGroup>
          <Card className='student-card'>
            <Card.Body onClick={() => handleClick(`/DisplayStudent/${student.studentFirstName+" "+student.studentLastName}`)}>
              <Card.Title className='student.card.title'>{student.studentFirstName} {student.studentLastName}</Card.Title>
              <Card.Text>{student.instrument} . Year {student.yearLevel}</Card.Text>
            </Card.Body>
          </Card>
        </CardGroup>
        )
      }):null}
        <Card className='add-card' >
          <Card.Body onClick={() => handleClick(`/Students/NewStudent`)}> 
          <Card.Title> <MDBIcon fas icon="plus" /> Add a Student</Card.Title>
          </Card.Body>
        </Card>
    </div>
    ) }
    </>
  )
}

export default DisplaySchoolInfo