import React, { useContext, useEffect, useState } from 'react'
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
  const [schoolsData, setSchoolsData] = useState({})
  
  const navigate = useNavigate();
  
  function handleClick(path) {
    navigate(path);
  }
  const {auth, setAuth} = useContext(AuthContext)
  console.log(auth.email)

  useEffect(() => {
    axios.get(`http://localhost:3500/user/getSchools?email=${auth.email}`)
    .then((resp) => {
      console.log(resp.data)
      setSchoolsData(resp.data)
    })
  }, [])

  let cardsMap = schoolsData.map((school)=>{
    let card = (
      <MDBCard className='school-card'>
      <MDBCardBody onClick={() => handleClick(`DisplaySchool`)}>
      <MDBCardTitle className='school-card-title'>{school.schoolName}</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>
      )
      return card
    })

  return (
    <>
    <DashboardElements/>
    <div className='content-div'>
    <h4>Welcome back!</h4>
    <p> you are signed in as: {auth.email}</p>
      <link
        href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
        rel="stylesheet"
    	/>
    {/* {cardsMap} */}

    <MDBCard className='add-card' >
      <MDBCardBody onClick={() => handleClick(`NewSchoolForm`)}> 
      <MDBCardTitle> <MDBIcon fas icon="plus" />Add a School</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>

    </div>
    </>
  )
}
{/* <MDBIcon fas icon="plus" /> */}