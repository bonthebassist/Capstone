import React from 'react';
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
import { Navigate, useNavigate } from "react-router-dom";
import DashboardElements from './DashboardPage';

export default function StudentsPage() {
  // const currentUser = useAuth();

  // if (currentUser === undefined) return (<h1>user not found</h1>)

  const navigate = useNavigate();
  
  function handleClick(path) {
    navigate(path);
  }
  return (
    // currentUser
    // ?
    <>
    <DashboardElements/>
    <div className='content-div'>
    
    <MDBInputGroup>
      <MDBInput label='Search' />
      <MDBBtn rippleColor='dark'>
        <MDBIcon icon='search' />
      </MDBBtn>
    </MDBInputGroup>
    
    <MDBCard>
      <MDBCardBody>
        <MDBCardTitle>Ashley K</MDBCardTitle>
        <MDBCardText>
          Hills School . Year 10 . Double Bass
        </MDBCardText>
        <MDBBtn>Contact</MDBBtn>
      </MDBCardBody>
    </MDBCard>

    <MDBCard className='add-card' >
      <MDBCardBody onClick={() => handleClick(`NewStudent`)}> 
      <MDBCardTitle> <MDBIcon fas icon="plus" /> Add a Student</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>
    </div>
    </>
  //   : <Navigate to='/login'/>
  );
}