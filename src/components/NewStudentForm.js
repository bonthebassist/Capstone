import React, { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import axios from 'axios'
import { AuthContext } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function NewSchoolForm() {
  const { auth } = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState([])
  const [success, setSuccess] = useState(false);
  const [Student, setStudent] = useState({
    "studentFirstName": "",
    "studentLastName": "",
    "yearLevel": "",
    "instrument": "",
    "lessonType": "",
    "school": '',
    "studentEmail": '',
    "lessonPrice": ''
  })

  const [Parent, setParent] = useState({
    parentFirstName: '',
    parentLastName: '',
    parentEmail: ''
  })

  useEffect(() => {
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
  } , [auth.token, auth.user_id])



  const handleClick = (e) => {
    e.preventDefault()

    let splitSchool = Student.school.split("%")
    let school_id = splitSchool[0]
    let schoolName = splitSchool[1]
    console.log(school_id)
    console.log(schoolName)
    const reqBody2 =
    {
      "studentFirstName": Student.studentFirstName,
      "studentLastName": Student.studentLastName,
      "studentEmail": Student.studentEmail,
      "school_id": school_id,
      "schoolName": schoolName,
      "tutor_id": auth.user_id,
      "instrument": Student.instrument,
      "yearLevel": Student.yearLevel,
      "parentFirstName": Parent.parentFirstName,
      "parentLastName": Parent.parentLastName,
      "parentEmail": Parent.parentEmail,
      "lessonType": Student.lessonType,
      "lessonPrice": Student.lessonPrice
    }
  
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
  
    const url = `http://localhost:4000/post/student`;
    
    axios.post(url, reqBody2, config)
      .then(response => {
        console.log(response)
        console.log(response.data)
        setSuccess(true);
      }).catch(error => {
        console.log(error)
        alert(error)
      })
  }


  return (
    <Container className="form-container">
        <div className='content-div'>
          {success ? (
            <Navigate to="/Students" />
          ) : (
            <>
              <h2>Add a student</h2>
              <Form onSubmit={handleClick} className='form'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Student First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ashley"
                    value={Student.studentFirstName}
                    onChange={e => setStudent({ ...Student, studentFirstName: e.target.value })}
                    required
                    autoFocus />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Student Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kendrik"
                    value={Student.studentLastName}
                    onChange={e => setStudent({ ...Student, studentLastName: e.target.value })}
                    required />
                </Form.Group>

                <Form.Group>
                  <Form.Label>School</Form.Label>
                  <Form.Select value={Student.school} onChange={e => setStudent({ ...Student, school: e.target.value })}>
                    <option>Choose a school</option>
                    {schoolsData ? schoolsData.map((school) => {
                      return (<option value={school._id + "%" + school.schoolName}>{school.schoolName}</option>)
                    }) : null}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Student School Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ashleyk@hillsschool.com"
                    value={Student.email}
                    onChange={e => setStudent({ ...Student, studentEmail: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Year Level</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="10"
                    value={Student.yearLevel}
                    onChange={e => setStudent({ ...Student, yearLevel: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Instrument</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="piano"
                    value={Student.instrument}
                    onChange={e => setStudent({ ...Student, instrument: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Parent/Caregiver First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Susan K"
                    value={Parent.parentFirstName}
                    onChange={e => setParent({ ...Parent, parentFirstName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Parent/Caregiver Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Susan K"
                    value={Parent.parentLastName}
                    onChange={e => setParent({ ...Parent, parentLastName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Parent/Caregiver Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="susan.k@email.com"
                    value={Parent.parentEmail}
                    onChange={e => setParent({ ...Parent, parentEmail: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Lesson Duration/type</Form.Label>
                  <Form.Check type="radio" value="Individual 30 minutes" label="Individual 30 minutes" name="lessontype" onClick={e => setStudent({ ...Student, lessonType: e.target.value })} />
                  <Form.Check type="radio" value="Individual 45 minutes" label="Individual 45 minutes" name="lessontype" onClick={e => setStudent({ ...Student, lessonType: e.target.value })} />
                  <Form.Check type="radio" value="Individual 60 minutes" label="Individual 60 minutes" name="lessontype" onClick={e => setStudent({ ...Student, lessonType: e.target.value })} />
                  <Form.Check type="radio" value="Group Lesson" label="Group Lesson" name="lessontype" onClick={e => setStudent({ ...Student, lessonType: e.target.value })} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Price per lesson $</Form.Label>
                  <Form.Control type="number" value={Student.lessonPrice} onChange={e => setStudent({ ...Student, lessonPrice: e.target.value })}></Form.Control>
                </Form.Group>
                <Button variant="dark" className="button" type="submit" onClick={handleClick}>
                  Submit
                </Button>
              </Form>
            </>
          )
          }
        </div>
      
    </Container>
  );
}