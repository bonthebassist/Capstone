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
      setSchoolsData(resp.data)
    })
  }}, [auth])

  
  return (
    <div>
        <h2>{schoolName}</h2>
        <Button>Contact admin</Button>
        <h4>Quick Links</h4>
        <a href={schoolsData[0].usefulLinks[0].linkURL}>{schoolsData[0].usefulLinks[0].linkTitle}</a>
        <h4>Attendance</h4>
        <table></table>
        <h4>Music Diaries</h4>
        <CardGroup>
          <Card>
            <Card.Body>
              Clickable Student Cards
            </Card.Body>
          </Card>
        </CardGroup>

        <Card className='add-card' >
          <Card.Body onClick={() => handleClick(`/Students/NewStudent`)}> 
          <Card.Title> <MDBIcon fas icon="plus" /> Add a Student</Card.Title>
          </Card.Body>
        </Card>
    </div>
  )
}

export default DisplaySchoolInfo