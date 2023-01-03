import React, { useContext, useEffect, useState } from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import DashboardElements from './DashboardPage';
import {AuthContext} from '../context/AuthProvider';
import axios from 'axios';


export default function SchoolsPage() {
  //Auth Context and School Data State
  const {auth, setAuth} = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState([])
  
  //hooks
  const navigate = useNavigate();

  //handle click from school card
  function handleClick(path) {
    navigate(path);
  }


  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/schools?email=${auth.email}`, config)
    .then((resp) => {
      setSchoolsData(resp.data)
    })
  }, [])

  //dynamically create cards based on user data
  let cardsMap = schoolsData.map((school)=>{
    let card = (
      <MDBCard className='school-card'>
      <MDBCardBody onClick={() => handleClick(`/DisplaySchool/${school.schoolName}`)}>
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
    <p> You are signed in as: {auth.email}</p>
      <link
        href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
        rel="stylesheet"
    	/>
    { schoolsData ? cardsMap : null}
    <MDBCard className='add-card' >
      <MDBCardBody onClick={() => handleClick(`NewSchoolForm`)}> 
      <MDBCardTitle> <MDBIcon fas icon="plus" /> Add a School</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>
    </div>
    </>
  )
}