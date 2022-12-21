import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

export default function TermDiary() {
    const [{students}, setStudents] = useState({ students: [""] });
    const [week, setWeek] = useState(1)
    const addWeek = () => {
        students.push(
        <div>
        <h4>Week {week}</h4>
        <Form.Group>
            <Form.Label>Attendance</Form.Label>
            <Form.Check type="radio" label="Present" inline name={"group" + week}/>
            <Form.Check type="radio" label="Absent" inline name={"group" + week}/>
            <Form.Check type="radio" label="Excused Absence" inline name={"group" + week}/>
            <Form.Check type="radio" label="Late" inline name={"group" + week}/>
        </Form.Group>
        <Form.Group key={students.length}>
            <Form.Label>Lesson notes:</Form.Label>
            <Form.Control as="textarea" rows={5}></Form.Control>
        </Form.Group>
        <Button >Save</Button>
        <Button>Send</Button>
        </div>
        );
        setStudents({students : [...students]})
        setWeek(prevWeek => prevWeek + 1)
    };

  return (
    <div className='content-div'>
        <h4>Ashley K Music Diary</h4>
        <h2 style={{textDecoration: "underline"}}>Term 1</h2>
        <Form id="diary-form">
            {students}
        </Form>
        <Button onClick={addWeek}>Add another week</Button>
    </div>
  )
}
