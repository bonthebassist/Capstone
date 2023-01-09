import React, {useContext, useEffect, useState} from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';
import { Icon } from '@iconify/react';


export default function MyDetailsPage() {
  const {auth, setAuth} = useContext(AuthContext)
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
    
  }, [auth.user_id, auth.token])

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
                if (response.data.matchedCount){
                  setSuccesMsg('Nothing changed! Looks like your details are up to date.')
                  setClicked(false)
                }
            }).catch(error => {
                console.log(error)
                setErrMsg(`${error}`)
            })
  }

  const deleteUser = () => {
    console.log(userDetails.firstName + " to be deleted")
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.delete(`http://localhost:4000/delete/user?user=${userDetails._id}`, config)
            .then(response => {
                console.log(response.data)
                setAuth({ user_id: "", token:"" })
                localStorage.clear();
                //navigate to '/'
                window.location.href = "http://localhost:3000/"
            }).catch(error => {
                console.log(error)
                setErrMsg(error)
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
          <strong>Messages </strong>
          <Icon icon="noto-v1:party-popper" width="20" height="20" rotate={3} />
          <em> feature coming soon! </em>
          <Icon icon="noto-v1:party-popper" width="20" height="20" />
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
                      <Button variant='dark' type="button" onClick={()=> setClicked(false)}>Cancel</Button>
                      
                  </Form.Group>
                  <Button variant='danger' type="button" onClick={deleteUser}>Delete Account</Button>
                      <p><strong style={{color: 'red'}}>WARNING </strong> This will delete all associated schools, students & attendance records.</p>
                  
              </Form>
  
          </Container>
          : null}
      {!clicked ? <Button onClick={()=>setClicked(true)}>Edit</Button>: null}
    </div>
    </>
  );
}