import React, { useContext, useEffect } from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import DashboardElements from './DashboardPage';
import {AuthContext} from '../context/AuthProvider';
import axios from 'axios';

export default function SchoolsPage() {
  const HillsSchoolPath = '/hills+school' //make this a query parameter set from school name
  const navigate = useNavigate();
  
  function handleClick(path) {
    navigate(path);
  }
  const {auth, setAuth} = useContext(AuthContext)
  console.log(auth.email)

  useEffect(() => {
    axios.get(`http://localhost:3500/user?email=${auth.email}`)
    .then((resp) => {
      console.log(resp.data)
    })
  }, [])

  return (
    <>
    
    <DashboardElements/>
    <div className='content-div'>
    <h1>{auth.email}</h1>
      <link
        href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
        rel="stylesheet"
    	/>
      <MDBCard className='school-card'>
      <MDBCardBody onClick={() => handleClick(`DisplaySchool`)}>
      <MDBCardTitle className='school-card-title'>Hills School</MDBCardTitle>
      {/* <MDBBtnGroup shadow='0' aria-label='Basic example'>
        <MDBBtn>Info</MDBBtn>
        <MDBBtn>Attendance</MDBBtn>
        <MDBBtn>Links</MDBBtn>
        <MDBBtn>Diaries</MDBBtn>
        <MDBBtn>Contact admin</MDBBtn>
        </MDBBtnGroup> */}
      </MDBCardBody>
    </MDBCard>

    <MDBCard className='add-card' >
      <MDBCardBody onClick={() => handleClick(`NewSchoolForm`)}> 
      <MDBCardTitle> <MDBIcon fas icon="plus" /> Add a School</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>

    </div>
    </>
  )
}
{/* <MDBIcon fas icon="plus" /> */}