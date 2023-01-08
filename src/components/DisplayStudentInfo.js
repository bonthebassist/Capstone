import { useEffect, useState, useContext } from 'react'
import { Button, Form, Accordion, ButtonGroup, Card, CardGroup, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';

export default function DisplayStudentInfo() {
    const params = useParams();
    const studentName = params.studentName;
    const nameArray = studentName.split(" ")
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
    const [success, setSuccess] = useState(false)
    const [attSuccess, setAttSuccess] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const showForm = () => {
        if (!showShow) {
            setShowShow(true)
            setErrMsg('')
            setSuccessMsg('')
        }
    }
    function consoleEntry (){
        console.log(entry.week)
        console.log(entry.record)
        console.log(entry.notes)
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
            })
    }, [auth.token, auth.user_id])



    const config = {
        headers: {
            'Content-type': 'application/json',
            'x-access-token': auth.token
        }
    };

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
                setSuccess(true);
                setSuccessMsg('Term succesfully created')
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

    const handleEntry = (e) => {
        e.preventDefault()
        let reqBodyAtt2 = {
            "attendance_id": attendanceDoc._id,
            "week": entry.week,
            "record":entry.record,
            "notes": entry.notes
        }
        console.log(reqBodyAtt2)
        axios.put(`http://localhost:4000/put/attendanceInput`, reqBodyAtt2, config)
            .then(response => {
                console.log(response.data)
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

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
                if (resp.data){
                setAttendanceDoc(resp.data)
                setAttSuccess(true)
                } else {
                setErrMsg("No attendance found for that term, try adding a term!")
                setAttSuccess(false)
                }
            })
    }

    return (
        <div className='content-div'>
            <h4>{nameArray[0]} {nameArray[1]}</h4>
            <CardGroup>
                <Card className='add-card' >
                    <Card.Body> 
                        <Card.Title>Contact {studentDoc.parentFirstName}</Card.Title>
                    </Card.Body>
                </Card>
                <Card className='add-card' >
                    <Card.Body> 
                        <Card.Title>Contact {studentDoc.studentFirstName}</Card.Title>
                    </Card.Body>
                </Card>
            </CardGroup>
            <h4>Details</h4>
            <p>
                <strong>School</strong> {studentDoc.schoolName}<br />
                <strong>Instrument</strong> {studentDoc.instrument}<br />
                <strong>Lesson Type</strong> {studentDoc.lessonType}<br />
                <strong>Year Level</strong> {studentDoc.yearLevel}
            </p>


            <Form>
                <h4>Music Diary</h4>
                <Form.Group>
                    <Form.Label>Term</Form.Label>
                    <Form.Select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}>
                        <option>Choose a Term</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </Form.Select>
                    <Form.Label>Year</Form.Label>
                    <Form.Select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        <option>Choose a Year</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </Form.Select>
                    <Button className='buttons' onClick={populateDiary}>Find</Button>
                    <Button className='buttons' onClick={showForm}>Add a Term</Button>
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
                    <Button variant='dark' onClick={handleTermSubmit}>Submit</Button>
                </Form>
            )}
            {!attSuccess ? null : (
            <>
            <h2>Term {selectedTerm} {selectedYear}</h2>
                <Accordion>
                    {attendanceDoc.attendance.map((week, i) => {
                            return (
                                <Accordion.Item eventKey={i}>
                                    <Accordion.Header>Week {week.week}</Accordion.Header>
                                        {!week.record ? 
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
                                            </ButtonGroup>
                                        </Accordion.Body>
                                        :
                                        <Accordion.Body>
                                            <p>Attendance: {week.record} </p>
                                            <p>Lesson Notes: {week.notes}</p>
                                            <ButtonGroup>
                                                <Button disabled>Edit</Button>
                                            </ButtonGroup>
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


{/* <Form>{[0,1,2,3,4,5,6,7,8,9].map((i) =>
<>
    <h4>Week {i+1}</h4>
    <Form.Group>
        <Form.Label>Attendance</Form.Label>
        <Form.Check value={"P"} type="radio" label="Present" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})} />
        <Form.Check value={"A"} type="radio" label="Absent" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
        <Form.Check value={"E"} type="radio" label="Excused Absence" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
        <Form.Check value={"L"} type="radio" label="Late" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
        <Form.Check value="" type="radio" label="None" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
    </Form.Group>
    <Form.Group key={i}>
        <Form.Label>Lesson notes:</Form.Label>
        <Form.Control as="textarea" rows={1} onChange={e => {setEntry({...entry, diaryEntry: e.target.value + "%"+ (schoolDate+"W"+(i+1)+"P")})}}></Form.Control>
    </Form.Group>
    {entry.attendance 
    ? 
    (<Form.Group>
        <Button variant="secondary" size="sm" onClick={handleEntry}>Save</Button>
        <Button variant="danger" size="sm" onClick={e => setEntry({attendance:'', diaryEntry:''})}>Cancel</Button>
    </Form.Group>)
    : null}
    
</>
)}</Form> */}


{/* <>
                

            </> */}


            // {week.length > 2
            //     ?
                
            //     :
            // }