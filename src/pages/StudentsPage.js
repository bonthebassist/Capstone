import React, { useContext, useState, useEffect } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBInputGroup,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import DashboardElements from './DashboardPage';
import {AuthContext} from '../context/AuthProvider';
import axios from 'axios'


export default function StudentsPage() {
  const navigate = useNavigate();
  
  function handleClick(path) {
    navigate(path);
  }

  const {auth} = useContext(AuthContext)
  const [studentData, setStudentData] = useState([])

  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/studentsAll?email=${auth.email}`, config)
    .then((resp) => {
      console.log(resp.data)
      setStudentData(resp.data)
    })
  }, [auth.email, auth.token])

  //dynamically create cards based on user data
  let cardsMap = studentData.map((student)=>{
    let card = (


<MDBCard className='student-card'>
<MDBCardBody onClick={() => handleClick(`/DisplayStudent/${student.studentFirstName+" "+student.studentLastName}`)}>
  <MDBCardTitle>{student.studentFirstName} {student.studentLastName}</MDBCardTitle>
  <MDBCardText>
    {student.school} . Year {student.yearLevel} . {student.instrument}
  </MDBCardText>
</MDBCardBody>
</MDBCard>
      )
      return card
    })


  return (
    <>
    <DashboardElements/>
    <div className='content-div'>
    
    <MDBInputGroup>
      <MDBInput label='Search' />
      <MDBBtn rippleColor='dark'>
        <MDBIcon icon='search' />
      </MDBBtn>
    </MDBInputGroup>
    
{cardsMap}

    <MDBCard className='add-card' >
      <MDBCardBody onClick={() => handleClick(`NewStudent`)}> 
      <MDBCardTitle> <MDBIcon fas icon="plus" /> Add a Student</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>
    </div>
    </>
  );
}