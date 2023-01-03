import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {useParams} from 'react-router-dom'
import { MDBBtn } from 'mdb-react-ui-kit'
import { Button, Card, CardGroup } from 'react-bootstrap'
import axios from 'axios'
import {AuthContext} from '../context/AuthProvider';
import {  MDBIcon } from 'mdb-react-ui-kit';

const SCHOOL_DATA = [
  {
    "schoolName": "Surry Hills",
    "schoolAdminDetails": [
      {
        "title": "Kim",
        "email": "kim@surryhills.com"
      }
    ],
    "usefulLinks": [
      {
        "linkTitle": "Surry Timetable",
        "linkURL": "www.surrytimetable.com"
      }
    ],
    "students": []
  },
  {
    "schoolName": "The Heights",
    "schoolAdminDetails": [
      {
        "title": "Penny",
        "email": "penny@theheights.com"
      }
    ],
    "usefulLinks": [
      {
        "linkTitle": "The Heights Timetable",
        "linkURL": "www.theheights.com/timetable"
      }
    ],
    "students": []
  }
]

function DisplaySchoolInfo() {
  const params = useParams();
  const schoolName = params.schoolName
  const {auth, setAuth} = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState()
  const [studentData, setStudentData] = useState()
  const navigate = useNavigate();
  
  function handleClick(path) {
    navigate(path);
  }

  
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = loggedInUser;
      // console.log(loggedInUser)
      setAuth(JSON.parse(foundUser));
      console.log(auth.email, auth.token)
    }
  }, []);

  useEffect(() => {
    if (auth.token){
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/schools?email=${auth.email}`, config)
    .then((resp) => {
      console.log(resp.data)
      let schoolsArray = resp.data
      let currentSchoolObj = schoolsArray.filter(function (el){
       return el.schoolName === schoolName
      })
      console.log(currentSchoolObj[0])
      setSchoolsData(currentSchoolObj[0])
    })
  }}, [auth])

  useEffect(() => {
    if (auth.token){
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/students?email=${auth.email}&school=${schoolName}`, config)
    .then((resp) => {
      console.log(resp.data)
      setStudentData(resp.data)
    })
  }}, [auth])


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
            <Card.Body className='student-card-title' onClick={() => handleClick(`/DisplayStudent/${student.studentFirstName}`)}>
              {student.studentFirstName} {student.studentLastName}
            </Card.Body>
            <Card.Footer className='student-card-footer'>
              <button className='student-card-button'>Late</button> //opens email dialog to student cc parents
              <button className='student-card-button'>Absent</button> //opens email dialog to parents cc student
              <button className='student-card-button'>Edit</button> //takes to edit student form
              <button className='student-card-button'>Delete</button> //opens modal - are you sure? then deletes from database
            </Card.Footer>
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