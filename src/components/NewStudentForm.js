import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SchoolColorPicker from './SchoolColorPicker';


export default function NewSchoolForm() {
    const [Student, setStudent] = useState({
        "studentName":"",
        "school": '',
        "email": ''
      })

    const [Parent, setParent] = useState({
        parentName:'',
        parentEmail: ''
    })

      const handleClick = (e) => {
        e.preventDefault()
        console.log(Student)
    //     axios.post('http://localhost:4000/rsvp/addResponse', RSVP)
    //           .then(response => {
    //               // console.log("RSVP submitted successfully")
    //               // alert("RSVP submitted successfully")
    //           }).catch(error => {
    //               console.log(error)
    //               alert(error)
    //           })
      }

  return (
    <div className='content-div'>
        <h2>Add a student</h2>
        <Form className='adding-form'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Student Name</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Ashley K" 
                value={Student.studentName}
                onChange={e => setStudent({...Student, studentName: e.target.value })}
                required 
                autoFocus/>
                <Form.Text className="text-muted">We reccomend inputting first name and last name inital for student privacy</Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Label>School</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Hills School" 
                value={Student.studentName}
                onChange={e => setStudent({...Student, school: e.target.value })}
                required 
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Student School Email</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="ashleyk@hillsschool.com" 
                value={Student.email}
                onChange={e => setStudent({...Student, email: e.target.value })}
                required 
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Parent/Caregiver Name</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Susan K" 
                value={Parent.parentName}
                onChange={e => setParent({...Parent, parentName: e.target.value})}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Parent/Caregiver Email</Form.Label>
                <Form.Control 
                type="email" 
                placeholder="susan.k@email.com" 
                value={Parent.parentEmail}
                onChange={e => setParent({...Parent, parentEmail: e.target.value})}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Lesson Duration/type</Form.Label>
                <Form.Check type="radio" label="Individual 30 minutes" name="lessontype" defaultChecked />
                <Form.Check type="radio" label="Individual 45 minutes" name="lessontype"/>
                <Form.Check type="radio" label="Individual 60 minutes" name="lessontype"/>
                <Form.Check type="radio" label="Group Lesson" name="lessontype"/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Price per lesson</Form.Label>
                <Form.Control type="number"></Form.Control>
            </Form.Group>
        
      <Button variant="dark" className="button" type="submit" onClick={handleClick}>
        Submit
      </Button>
    </Form>

    </div>
  );
}