import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SchoolColorPicker from './SchoolColorPicker';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';

export default function NewSchoolForm() {
  const {auth, setAuth} = useContext(AuthContext)
  console.log(auth.email)
    const [School, setSchool] = useState({
        "schoolName":"",
      })
    const [UsefulLinks, setUsefulLinks] = useState([])
    const [SchoolAdminDetails, setSchoolAdminDetails] = useState({
        "title": null,
        "email": null
    })

    const reqBody = 
      { 
        "schoolName": School.schoolName,
        "schoolAdminDetails": [
            {
                "title": SchoolAdminDetails.title, 
                "email": SchoolAdminDetails.email
                }
            ],
        "usefulLinks": [
            {
                "linkTitle": UsefulLinks.linkTitle, 
                "linkURL": UsefulLinks.linkURL
                }
            ],
        "students":[]
    }
    console.log(reqBody)
  
      const handleClick = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:3500/user/addSchool?email=${auth.email}`, reqBody)
              .then(response => {
                  console.log(response.data)
              }).catch(error => {
                  console.log(error)
                  alert(error)
              })
      }

  return (
    <div className='content-div'>
        <h2>Add a school</h2>
        <Form className='adding-form'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>School Name</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="eg. Hills School" 
                value={School.schoolName}
                onChange={e => setSchool({schoolName: e.target.value })}
                required 
                autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Contacts</Form.Label>
        <Form.Control 
        type="text" 
        placeholder="eg. Music Secretary" 
        value={SchoolAdminDetails.title}
        onChange={e => setSchool({...SchoolAdminDetails, title: e.target.value})}
        />
        <Form.Control 
        type="email" 
        placeholder="contact email for above" 
        value={SchoolAdminDetails.email}
        onChange={e => setSchoolAdminDetails({...SchoolAdminDetails, email: e.target.value})}
        />
        </Form.Group>
        {/* <Form.Text className="text-muted">
          Please use the email your invitation was sent to
        </Form.Text> */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Useful Links</Form.Label>
        <Form.Control 
        type="text" 
        placeholder="eg. Hills School Timetable" 
        value={UsefulLinks.linkTitle}
        onChange={e => setUsefulLinks({linkTitle: e.target.value, linkURL: null})}
        />
        <Form.Control 
        type="text" 
        placeholder="URL for link above" 
        value={UsefulLinks.linkURL}
        onChange={e => setSchool({...UsefulLinks, linkURL: e.target.value})}
        />
        </Form.Group>
        <Form.Group>
            <Form.Label>Pick a colour for your school</Form.Label>
            <SchoolColorPicker/>
        </Form.Group>
      <Button variant="dark" className="button" type="submit" onClick={handleClick}>
        Submit
      </Button>
    </Form>

    </div>
  );
}