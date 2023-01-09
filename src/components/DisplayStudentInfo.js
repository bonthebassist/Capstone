import { useEffect, useState, useContext } from 'react'
import { Button, Form, Accordion, ButtonGroup, Card, CardGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

export default function DisplayStudentInfo() {
    //path Params
    const params = useParams();
    const studentName = params.studentName;
    const nameArray = studentName.split(" ")

    //Context and states
    const { auth } = useContext(AuthContext);
    const [showShow, setShowShow] = useState(false);
    const [Term, setTerm] = useState({
        termNo: "",
        yearNo: "",
        termLength: "",
        goalLessonCount: ""
    });
    const [studentDoc, setStudentDoc] = useState({})
    const [attendanceDoc, setAttendanceDoc] = useState();
    const [entry, setEntry] = useState({
        week: "",
        record: "",
        notes: ""
    })
    const [selectedTerm, setSelectedTerm] = useState()
    const [selectedYear, setSelectedYear] = useState()
    const [attSuccess, setAttSuccess] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [editedStudent, setEditedStudent] = useState('')
    const [clicked, setClicked] = useState(false)
    const [clickedEditAtt, setClickedEditAtt] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)

    //to show adding attendance record(term)
    const showForm = () => {
        if (!showShow) {
            setShowShow(true)
            setErrMsg('')
            setSuccessMsg('')
        }
    }

    //to show editing details form
    const clickedEdit = () => {
        if (!clicked) {
            setClicked(true)
        } else {
            setClicked(false)
        }
        clearMsgs()
    }

    //to clear messages
    const clearMsgs = () => {
        setSuccessMsg('')
        setErrMsg('')
    }

    //for getting studentDoc
    useEffect(() => {
        console.log(auth.token)
        const config = {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.token
            }
        };
        axios.get(`http://localhost:4000/get/studentByName?tutor=${auth.user_id}&firstName=${nameArray[0]}&lastName=${nameArray[1]}`, config)
            .then((resp) => {
                console.log(resp.data)
                setStudentDoc(resp.data)
                setEditedStudent(resp.data)
            })
    }, [auth.token, auth.user_id])

    //for getting attendanceDoc
    useEffect(() => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.token
            }
        };


        let fancyURL = `http://localhost:4000/get/attendanceByStudent?tutor=${auth.user_id}&student=${studentDoc._id}&schoolDate=${auth.currentTermDate}`

        axios.get(fancyURL, config)
            .then((resp) => {
                console.log(resp.data)
                if (resp.data) {
                    setAttendanceDoc(resp.data)
                    setAttSuccess(true)
                    setErrMsg('')

                    //set selected term state for future updates
                    let splitTermDate = resp.data.schoolDate.split('')
                    setSelectedTerm(splitTermDate[1])

                    //set selected year state for future updates
                    splitTermDate.shift()
                    splitTermDate.shift()
                    let joinedYear = splitTermDate.join('')
                    setSelectedYear(joinedYear)

                } else {
                    setErrMsg("No attendance found for that term, try adding a term!")
                    setAttSuccess(false)
                }
            })
    }, [auth.token, auth.user_id, auth.currentTermDate, studentDoc])

    //Axios headers configuration
    const config = {
        headers: {
            'Content-type': 'application/json',
            'x-access-token': auth.token
        }
    };

    // send new term (attendance record object) to database
    const handleTermSubmit = (e) => {
        console.log("in the handleTermSubmit function")
        e.preventDefault()
        setShowShow(false)
        //reqBody for making a term
        const schoolDate = "T" + Term.termNo + Term.yearNo
        const studentName = studentDoc.studentFirstName + " " + studentDoc.studentLastName
        console.log(schoolDate)
        let reqBody2 = {
            "student_id": studentDoc._id,
            "studentName": studentName,
            "tutor_id": auth.user_id,
            "school_id": studentDoc.school_id,
            "schoolDate": schoolDate,
            "termLength": Term.termLength,
            "goalLessonCount": Term.goalLessonCount,
            "invoiced": "false"
        }
        console.log(reqBody2)
        axios.post(`http://localhost:4000/post/attendance`, reqBody2, config)
            .then(response => {
                console.log(response.data)
                setSuccessMsg('Term succesfully created')
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

    // send updates to specific attendance record and populate Accordian
    const handleEntry = (e) => {
        e.preventDefault()
        let reqBodyAtt2 = {
            "attendance_id": attendanceDoc._id,
            "week": entry.week,
            "record": entry.record,
            "notes": entry.notes
        }
        console.log(reqBodyAtt2)
        axios.put(`http://localhost:4000/put/attendanceInput`, reqBodyAtt2, config)
            .then(response => {
                console.log(response.data)
                if (response.data.length !== 0) {
                    populateDiary()
                    setSuccessMsg('updated successfully')
                }
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }
    //Edit student details and upload to DB
    const submitEdit = (e) => {
        e.preventDefault()
        console.log(editedStudent)
        clickedEdit()
        setSuccessMsg('Updated student details')
        setErrMsg('Could not update details')
    }


    // delete student and associated attendance records from DB
    const deleteStudent = (e) => {
        e.preventDefault()
        console.log(studentDoc.studentFirstName + " to be deleted")
        axios.delete(`http://localhost:4000/delete/student?student=${studentDoc._id}`, config)
            .then(response => {
                console.log(response.data)
                setDeleteSuccess(true)
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

    //Show diary from different term as selected
    const populateDiary = () => {
        setShowShow(false)
        setSuccessMsg('')
        const config = {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.token
            }
        };

        const schoolDateSearch = "T" + selectedTerm + selectedYear

        let fancyURL = `http://localhost:4000/get/attendanceByStudent?tutor=${auth.user_id}&student=${studentDoc._id}&schoolDate=${schoolDateSearch}`

        axios.get(fancyURL, config)
            .then((resp) => {
                console.log(resp.data)
                if (resp.data) {
                    setClickedEditAtt(false)
                    setAttendanceDoc(resp.data)
                    console.log("yeah it was all successful????")
                    setAttSuccess(true)
                    setErrMsg('')
                } else {
                    setErrMsg("No attendance found for that term, try adding a term!")
                    setAttSuccess(false)
                }
            })
    }

    return (
        <div className='content-div'>
            <h2 className='page-title'>{nameArray[0]} {nameArray[1]}</h2>
            <CardGroup style={{ marginBottom: '20px' }}>
                <Card className='add-card' >
                    <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `mailto:${studentDoc.parentEmail}`;
                    }}>
                        <Card.Title>Contact {studentDoc.parentFirstName}</Card.Title>
                    </Card.Body>
                </Card>
                <Card className='add-card' >
                    <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `mailto:${studentDoc.studentEmail}`;
                    }}>
                        <Card.Title>Contact {studentDoc.studentFirstName}</Card.Title>
                    </Card.Body>
                </Card>
            </CardGroup>
            <h4 style={{ color: 'white' }}>Details</h4>
            <p style={{ color: '#333', backgroundColor: 'rgba(67, 224, 230, .3)', padding: '10px' }}>
                <strong>School</strong> {studentDoc.schoolName}<br />
                <strong>Instrument</strong> {studentDoc.instrument}<br />
                <strong>Lesson Type</strong> {studentDoc.lessonType}<br />
                <strong>Year Level</strong> {studentDoc.yearLevel}<br />
            </p>
            {!clicked ? null :
                <>
                    <h2>Edit student</h2>
                    <Form onSubmit={submitEdit} className='form'>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Student First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedStudent.studentFirstName}
                                onChange={e => setEditedStudent({ ...editedStudent, studentFirstName: e.target.value })}
                                required
                                autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Student Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedStudent.studentLastName}
                                onChange={e => setEditedStudent({ ...editedStudent, studentLastName: e.target.value })}
                                required />
                        </Form.Group>

                        {/* <Form.Group>
                            <Form.Label>School</Form.Label>
                            <Form.Select value={editedStudent.school} onChange={e => setEditedStudent({ ...editedStudent, school: e.target.value })}>
                              <option>Choose a school</option>
                              {schoolsData ? schoolsData.map((school) => {
                                return (<option value={school._id + "%" + school.schoolName}>{school.schoolName}</option>)
                              }) : null}
                            </Form.Select>
                          </Form.Group> */}

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Student School Email</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedStudent.studentEmail}
                                onChange={e => setEditedStudent({ ...editedStudent, studentEmail: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Year Level</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedStudent.yearLevel}
                                onChange={e => setEditedStudent({ ...editedStudent, yearLevel: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Instrument</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedStudent.instrument}
                                onChange={e => setEditedStudent({ ...editedStudent, instrument: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Parent/Caregiver First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedStudent.parentFirstName}
                                onChange={e => setEditedStudent({ ...editedStudent, parentFirstName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Parent/Caregiver Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedStudent.parentLastName}
                                onChange={e => setEditedStudent({ ...editedStudent, parentLastName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Parent/Caregiver Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editedStudent.parentEmail}
                                onChange={e => setEditedStudent({ ...editedStudent, parentEmail: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Lesson Duration/type</Form.Label>
                            <Form.Check type="radio" value="Individual 30 minutes" label="Individual 30 minutes" name="lessontype" onClick={e => setEditedStudent({ ...editedStudent, lessonType: e.target.value })} />
                            <Form.Check type="radio" value="Individual 45 minutes" label="Individual 45 minutes" name="lessontype" onClick={e => setEditedStudent({ ...editedStudent, lessonType: e.target.value })} />
                            <Form.Check type="radio" value="Individual 60 minutes" label="Individual 60 minutes" name="lessontype" onClick={e => setEditedStudent({ ...editedStudent, lessonType: e.target.value })} />
                            <Form.Check type="radio" value="Group Lesson" label="Group Lesson" name="lessontype" onClick={e => setEditedStudent({ ...editedStudent, lessonType: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price per lesson $</Form.Label>
                            <Form.Control type="number" value={editedStudent.lessonPrice} onChange={e => setEditedStudent({ ...editedStudent, lessonPrice: e.target.value })}></Form.Control>
                        </Form.Group>
                        <Button variant="dark" className="button" type="submit" onClick={submitEdit}>
                            Save
                        </Button>
                        <Button variant="light" className="button" type="button" onClick={clickedEdit}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="button" type="button" onClick={deleteStudent}>
                            Delete
                        </Button>
                        {!deleteSuccess ? null : <p className='success-msg'>Deleted succesfully. Go back to <Link to='/Students'>Students</Link></p>}
                    </Form>
                </>
            }
            <Form>
                <h4 style={{ color: 'white' }}>Music Diary</h4>
                <Form.Group>
                    <Form.Label><strong style={{ color: 'white', fontSize: '1.2em' }}>Term</strong></Form.Label>
                    <Form.Select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} onFocus={() => clearMsgs()}>
                        <option>Choose a Term</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </Form.Select>
                    <Form.Label><strong style={{ color: 'white', fontSize: '1.2em' }}>Year</strong></Form.Label>
                    <Form.Select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        <option>Choose a Year</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </Form.Select>
                    <Button className='buttons' onClick={populateDiary}>Find</Button>
                    <Button className='buttons' onClick={showForm}>Add a Term</Button>
                    <Button className='buttons' onClick={clickedEdit}>Edit Student Details</Button>
                </Form.Group>
            </Form>
            {!errMsg ? null : <p className='errmsg'>{errMsg}</p>}
            {!successMsg ? null : <p className='success-msg'>{successMsg}</p>}

            {!showShow ? null : (
                <Form className='form'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Term Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="1"
                            value={Term.termNo}
                            onChange={e => setTerm({ ...Term, termNo: e.target.value })}
                            required
                            autoFocus />
                        <Form.Label>Year (YYYY)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="2023"
                            value={Term.yearNo}
                            onChange={e => setTerm({ ...Term, yearNo: e.target.value })}
                            required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Term Length (weeks)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="10"
                            value={Term.termLength}
                            onChange={e => setTerm({ ...Term, termLength: e.target.value })}
                            required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Goal Lesson Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="8"
                            value={Term.goalLessonCount}
                            onChange={e => setTerm({ ...Term, goalLessonCount: e.target.value })}
                            required />
                    </Form.Group>
                    <Button variant='dark' onClick={handleTermSubmit}>Save</Button>
                    <Button variant="danger" className="button" type="submit" onClick={() => setShowShow(false)}>Cancel</Button>
                </Form>
            )}
            {!attSuccess ? null : (
                <>
                    {!selectedTerm ? <h2 style={{ color: '#333', backgroundColor: 'rgba(67, 224, 230, .1)', padding: '10px' }}>Current Term</h2> : <h2>Term {selectedTerm} {selectedYear} </h2>}
                    <p style={{ color: '#333', backgroundColor: 'rgba(67, 224, 230, .6)', padding: '10px' }}>
                        <strong>P</strong> Present | <strong>A</strong> Absent without notice | <strong>L</strong> Late | <strong>E</strong> Excused absence
                    </p>
                    <MDBTable striped className='table-background'>
                        <MDBTableHead>
                            <tr>
                                <th>Student Name</th>
                                {attendanceDoc.attendance.map((element) => { return <th>{element.week}</th> })}
                                <th scope='col'>Count</th>
                                <th scope='col'>Goal</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            <tr>
                                <th scope='row'>{attendanceDoc.studentName}</th>
                                {attendanceDoc.attendance.map((entry, i) => {
                                    if (!entry.record) {
                                        return <td key={i}>-</td>
                                    } else {
                                        return <td key={i}>{entry.record}</td>
                                    }
                                })}
                                <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{attendanceDoc.lessonCount}</td>
                                <td style={{ textAlign: 'center' }}>{attendanceDoc.goalLessonCount}</td>
                            </tr>
                        </MDBTableBody>
                    </MDBTable>
                    <Accordion>
                        {attendanceDoc.attendance.map((week, i) => {
                            return (
                                <Accordion.Item eventKey={i}>
                                    <Accordion.Header>Week {week.week}</Accordion.Header>
                                    {!week.record || clickedEditAtt ?
                                        <Accordion.Body>
                                            <Form.Group>
                                                <Form.Label>Attendance</Form.Label>
                                                <Form.Check
                                                    value="P"
                                                    type="radio"
                                                    label="Present"
                                                    name={"week" + (i)}
                                                    onClick={e => setEntry({ ...entry, week: `${week.week}`, record: e.target.value })}
                                                />
                                                <Form.Check
                                                    value="A"
                                                    type="radio"
                                                    label="Absent"
                                                    name={"week" + (i)}
                                                    onClick={e => setEntry({ ...entry, week: `${week.week}`, record: e.target.value })}
                                                />
                                                <Form.Check
                                                    value="E"
                                                    type="radio"
                                                    label="Excused Absence"
                                                    onClick={e => setEntry({ ...entry, week: `${week.week}`, record: e.target.value })}
                                                />
                                                <Form.Check
                                                    value="L"
                                                    type="radio"
                                                    label="Late"
                                                    onClick={e => setEntry({ ...entry, week: `${week.week}`, record: e.target.value })}
                                                />
                                            </Form.Group>
                                            <Form.Group key={i}>
                                                <Form.Label>Lesson notes</Form.Label>
                                                <Form.Control as="textarea" rows={1} onChange={e => { setEntry({ ...entry, notes: e.target.value }) }}></Form.Control>
                                            </Form.Group>
                                            <ButtonGroup>
                                                <Button onClick={handleEntry}>Save</Button>
                                                <Button variant="danger" onClick={() => setClickedEditAtt(false)}>Cancel</Button>

                                            </ButtonGroup>
                                        </Accordion.Body>
                                        :
                                        <Accordion.Body>
                                            <p>Attendance: {week.record} </p>
                                            <p>Lesson Notes: {week.notes}</p>
                                            <Button className='buttons' onClick={() => setClickedEditAtt(true)}>Edit</Button>
                                        </Accordion.Body>}
                                </Accordion.Item>
                            )
                        }
                        )}
                    </Accordion></>
            )}

        </div>
    )
}