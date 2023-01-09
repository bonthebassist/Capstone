import React, { useContext, useEffect, useState } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import {AuthContext} from '../context/AuthProvider';
import axios from 'axios';

export default function SchoolsPage() {
  //Auth Context and School Data State
  const {auth} = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState([])
  
  //hooks
  const navigate = useNavigate();

  //handle click from school card
  function handleClick(path) {
    navigate(path);
  }


  useEffect(() => {
    console.log(auth.user_id)
    console.log(auth.token)
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
      setSchoolsData(resp.data)
    })
  }, [auth.user_id, auth.token])

  //dynamically create cards based on user data
  let cardsMap = schoolsData.map((school)=>{
    let card = (
      <MDBCard className='school-card'>
      <MDBCardBody style={{cursor:'pointer'}} onClick={() => handleClick(`/DisplaySchool/${school.schoolName}`)}>
      <MDBCardTitle className='school-card-title'>{school.schoolName}</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>
      )
      return card
    })

  return (
    <>
    <div className='content-div'>
      <h2 className='page-title'>Schools</h2>
      <link
        href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
        rel="stylesheet"
    	/>
    { schoolsData ? cardsMap : null}
    <MDBCard className='add-card' >
      <MDBCardBody style={{cursor:'pointer'}} onClick={() => handleClick(`NewSchoolForm`)}> 
      <MDBCardTitle> <MDBIcon fas icon="plus" /> Add a School</MDBCardTitle>
      </MDBCardBody>
    </MDBCard>
    </div>
    </>
  )
}