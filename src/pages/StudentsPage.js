import React, { useContext, useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBIcon} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthProvider';
import axios from 'axios'
import { Container } from 'react-bootstrap';

export default function StudentsPage() {
  //Context and states
  const { auth } = useContext(AuthContext)
  const [studentData, setStudentData] = useState([])


  //Navigation
  const navigate = useNavigate();

  function handleClick(path) {
    navigate(path);
  }


  //userEffect for loading Students that match user_id
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
  }, [auth.user_id, auth.token])


  //dynamically create cards based on user data
  let cardsMap = studentData.map((student) => {
    let card = (
      <MDBCard className='student-card'>
        <MDBCardBody style={{cursor:'pointer'}} onClick={() => handleClick(`/DisplayStudent/${student.studentFirstName + " " + student.studentLastName}`)}>
          <MDBCardTitle>{student.studentFirstName} {student.studentLastName}</MDBCardTitle>
          <MDBCardText>
            {student.schoolName} . Year {student.yearLevel} . {student.instrument}
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    )
    return card
  })


  return (
    <>
    <Container>
      <div className='content-div'>
      <h2 className='page-title'>Students</h2>
      <MDBCard className='add-card' >
        <MDBCardBody style={{cursor:'pointer'}} onClick={() => handleClick(`NewStudent`)}>
          <MDBCardTitle> <MDBIcon fas icon="plus" /> Add a Student</MDBCardTitle>
        </MDBCardBody>
      </MDBCard>
      {cardsMap}
      </div>
      </Container>
    </>
  );
}