import React, {useContext, useEffect, useState} from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import DashboardElements from './DashboardPage';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';

export default function MyDetailsPage() {
  const {auth} = useContext(AuthContext)
  const [userDetails, setUserDetails] = useState('')
  const [clicked, setClicked] = useState('')
  const [successMsg, setSuccesMsg] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [editedDetails, setEditedDetails] = useState('')

  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/userById?id=${auth.user_id}`, config)
    .then((resp) => {
      console.log(resp.data)
      setUserDetails(resp.data)
      setEditedDetails(resp.data)
    })
    
  }, [auth.user_id])

  useEffect(() => {
    setErrMsg('')
  }, [editedDetails])

  const handleSubmit = (e) => {
    e.preventDefault()
    const reqBody = {
      "user_id": auth.user_id,
      "firstName": editedDetails.firstName,
      "lastName": editedDetails.lastName,
      "email": editedDetails.email,
      "instrument": editedDetails.instrument
    }
    const URL = 'http://localhost:4000/put/userDetails'
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    console.log(reqBody)
    axios.put(URL, reqBody, config)
            .then(response => {
                console.log(response.data)
                if (response.data.mofifiedCount && response.data.matchedCount){
                  setSuccesMsg('Updated details successfully')
                  setClicked(false)
                  setEditedDetails('')
              }
            }).catch(error => {
                console.log(error)
                setErrMsg(`${error}`)
            })
  }

  return (
    <>
    <div className='content-div'>
      <h2 className='page-title'>My Details</h2>
      <p>
          <strong>Name</strong> {userDetails.firstName} {userDetails.lastName}<br />
          <strong>Email</strong> {userDetails.email}<br />
          <strong>Instrument</strong> {userDetails.instrument}<br />
      </p>
      {successMsg ? <p className='success-msg'>{successMsg}</p> : null}
      {clicked ? 
              <Container className="form-container">
              <Form onSubmit={handleSubmit} className="form">
                  {errMsg ? <p className="errmsg">{errMsg}</p> : null}
                  <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                      type="text"
                      name="firstName"
                      onChange={(e)=> setEditedDetails({...editedDetails, firstName: e.target.value})}
                      value={editedDetails.firstName}
                      autoFocus
                      required />
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                      type="text"
                      name="lastName"
                      onChange={(e)=> setEditedDetails({...editedDetails, lastName: e.target.value})}
                      value={editedDetails.lastName}
                      required 
                      />
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                      type="email"
                      name="email"
                      autoComplete="off"
                      onChange={(e)=> setEditedDetails({...editedDetails, email: e.target.value})}
                      value={editedDetails.email}
                      required
                      />
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Instrument</Form.Label>
                      <Form.Control
                      type="text"
                      name="instrument"
                      autoComplete="off"
                      onChange={(e)=> setEditedDetails({...editedDetails, instrument: e.target.value})}
                      value={editedDetails.instrument}
                      required
                      />
                  </Form.Group>
                  <Form.Group>
                      <Button type="submit" disabled={!editedDetails.firstName || !editedDetails.lastName || !editedDetails.email }>Save</Button>
                  </Form.Group>
                  
              </Form>
  
          </Container>
          : null}
      {!clicked ? <Button onClick={()=>setClicked(true)}>Edit</Button>: null}
    </div>
    </>
  );
}