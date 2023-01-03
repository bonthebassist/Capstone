import React, {useContext, useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import DashboardElements from './DashboardPage';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';

export default function MyDetailsPage() {
  const {auth} = useContext(AuthContext)
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    instrument: "none specified",
    schools: ""
  })

  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/user?email=${auth.email}`, config)
    .then((resp) => {
      console.log(resp.data)
      let schoolsArray = resp.data.schools
      let schoolNamesArray = schoolsArray.map((school)=>{return school.schoolName + ", "})
      setUserDetails({...userDetails, schools:schoolNamesArray})
      setUserDetails({...userDetails, 
        firstName: resp.data.firstName,
        lastName: resp.data.lastName,
        email: resp.data.email
      })

    })
    
  }, [])

  return (
    <>
    <DashboardElements/>
    <div className='content-div'>
      <h2>My Details</h2>
      <p>Name: {userDetails.firstName} {userDetails.lastName}</p>
      <p>Email: {userDetails.email}</p>
      <p>Instrument/s: {userDetails.instrument}</p>
      <p>Schools: {userDetails.schools}</p>
      <Button>Edit</Button>
    </div>
    </>
  );
}