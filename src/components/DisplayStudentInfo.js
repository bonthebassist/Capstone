import { useEffect, useState, useContext } from 'react'
import { Button, Form, Accordion, ButtonGroup } from 'react-bootstrap';
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
    const [attendanceDoc, setAttendanceDoc] = useState({
        "studentFirstName": "",
        "studentLastName": "",
        "schoolDate": "",
        "termLength": "",
        "attendanceArray": "",
        "school": "",
        "lessonCount": "",
        "catchUpCount": "",
        "goalLessonCount": "",
        "invoiced": ""
    });
    const [entry, setEntry] = useState({
        attendance: '',
        diaryEntry: ''
    })
    const [selectedTerm, setSelectedTerm] = useState()
    const [selectedYear, setSelectedYear] = useState()


    const showForm = () => {
        if (!showShow) {
            setShowShow(true)
        }
    }

    //for getting studentDoc
    useEffect(() => {
        const config = {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.token
            }
        };
        axios.get(`http://localhost:4001/student?email=${auth.email}&FirstName=${nameArray[0]}&LastName=${nameArray[1]}`, config)
            .then((resp) => {
                console.log(resp.data)
                setStudentDoc(resp.data[0])
            })
    }, [auth.token, auth.email])
    //for getting attendanceDoc
    // useEffect(() => {
    //     let schoolDateSearch = "T"+selectedTerm+selectedYear
    //         const config = {
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 'x-access-token': auth.token
    //             }
    //         };
    //         axios.get(`http://localhost:4001/attendance?email=${auth.email}&FirstName=${nameArray[0]}&LastName=${nameArray[1]}&schoolDate${schoolDateSearch}`, config)
    //             .then((resp) => {
    //                 console.log(resp.data)
    //                 setAttendanceDoc(resp.data[0])
    //             })
    // }, [auth.token, auth.email])

    useEffect(() => {
        console.log(entry.attendance.slice(0, 2))
    }, [entry])
    const config = {
        headers: {
            'Content-type': 'application/json',
            'x-access-token': auth.token
        }
    };

    const handleTermSubmit = (e) => {
        console.log("in the handleTermSubmit function")
        console.log(Term)
        const makeAttendanceArray = () => {
            let attendanceArray = []
            for (let i = 1; i <= Term.termLength; i++) {
                let element
                if (i < 10) {
                    element = "0" + i
                } else {
                    element = `${i}`
                }
                attendanceArray.push(element)
            }
            console.log(attendanceArray)
            return attendanceArray
        }
        e.preventDefault()
        setShowShow(false)
        //reqBody for making a term
        const schoolDate = "T" + Term.termNo + Term.yearNo
        console.log(schoolDate)
        let reqBody = {
            studentFirstName: nameArray[0],
            studentLastName: nameArray[1],
            schoolDate: schoolDate, //transform into this state
            termLength: Term.termLength, //number input filed
            attendanceArray: makeAttendanceArray(),
            diaryArray: [],
            school: studentDoc.school, //input autimatically from this page
            lessonCount: "0",
            catchUpCount: "0",
            goalLessonCount: Term.goalLessonCount, //number input field
            invoiced: "unpaid"
        }
        console.log(reqBody)
        axios.post(`http://localhost:4001/attendance/term?email=${auth.email}`, reqBody, config)
            .then(response => {
                console.log(response.data)
                // setSuccess(true);
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

    const handleEntry = (e) => {
        e.preventDefault()
        let reqBodyAtt = {
            studentFirstName: nameArray[0],
            studentLastName: nameArray[1],
            schoolDate: attendanceDoc.schoolDate,
            attendance: entry.attendance,
            diaryEntry: entry.diaryEntry,
            week: entry.attendance.slice(0, 2)
        }
        console.log(reqBodyAtt)
        axios.post(`http://localhost:4001/attendance?email=${auth.email}`, reqBodyAtt, config)
            .then(response => {
                console.log(response.data)

            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

    const populateDiary = () => {
        const schoolDateSearch = "T" + selectedTerm + selectedYear
        console.log(attendanceDoc)
        console.log("populateDiary function")
        console.log(schoolDateSearch)
        const config = {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': auth.token
            }
        };
        axios.get(`http://localhost:4001/attendance?email=${auth.email}&FirstName=${nameArray[0]}&LastName=${nameArray[1]}&schoolDate=${schoolDateSearch}`, config)
            .then((resp) => {
                console.log(resp.data)
                let splitDiary = []
                if (resp.data[0].length >0){
                let diaryArray = resp.data[0].diaryArray.sort()
                splitDiary = diaryArray.map((el)=>{
                    let split = el.split("%&")
                    return split
                })
                }
                setAttendanceDoc({
                    "studentFirstName": resp.data[0].studentFirstName,
                    "studentLastName": resp.data[0].studentLastName,
                    "schoolDate": resp.data[0].schoolDate,
                    "termLength": resp.data[0].termLength,
                    "attendanceArray": resp.data[0].attendanceArray.sort(),
                    "diaryArray":splitDiary,
                    "school": resp.data[0].school,
                })
            })
    }

    return (
        <div className='content-div'>
            <h4>{nameArray[0]}'s Music Diary</h4>
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
                <Button onClick={populateDiary}>Find</Button>
            </Form.Group>
            {showShow ? null : <Button onClick={showForm}>Add a Term</Button>}
            {!showShow ? null : (
                <Form>
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
            {!attendanceDoc.attendanceArray ? null : (
                <>
                    <h2>{attendanceDoc.schoolDate}</h2>
                    <Accordion>
                        {
                            attendanceDoc.attendanceArray.map((week, i) => {
                                if (i < 9) {
                                    i = "0" + (i + 1)
                                } else {
                                    i = i + 1
                                }
                                return (
                                    <Accordion.Item eventKey={i}>
                                        
                                        <Accordion.Header>Week {week.slice(0, 2)}</Accordion.Header>
                                        {week.length > 2
                                            ?
                                            <Accordion.Body>
                                                <p>Attendance: {week.slice(2)}</p>
                                                <p>Lesson Notes: {
                                                    attendanceDoc.diaryArray.length > 0 ?
                                                    attendanceDoc.diaryArray[0][1] : null
                                                    // attendanceDoc.diaryArray.length > 0 ?
                                                    // attendanceDoc.diaryArray[0][0] === i ?
                                                    // attendanceDoc.diaryArray[0][1] : null
                                                    // : null
                                                }</p>
                                                <ButtonGroup>
                                                    <Button>Edit</Button>
                                                </ButtonGroup>
                                            </Accordion.Body>
                                            :
                                            <Accordion.Body>
                                                <Form.Group>
                                                    <Form.Label>Attendance</Form.Label>
                                                    <Form.Check value={`${i}P`} type="radio" label="Present" name={"week" + (i)} onClick={e => setEntry({ ...entry, attendance: e.target.value })} />
                                                    <Form.Check value={`${i}A`} type="radio" label="Absent" name={"week" + (i)} onClick={e => setEntry({ ...entry, attendance: e.target.value })} />
                                                    <Form.Check value={`${i}E`} type="radio" label="Excused Absence" name={"week" + (i)} onClick={e => setEntry({ ...entry, attendance: e.target.value })} />
                                                    <Form.Check value={`${i}L`} type="radio" label="Late" name={"week" + (i)} onClick={e => setEntry({ ...entry, attendance: e.target.value })} />
                                                </Form.Group>
                                                <Form.Group key="1">
                                                    <Form.Label>Lesson notes</Form.Label>
                                                    <Form.Control as="textarea" rows={1} onChange={e => { setEntry({ ...entry, diaryEntry: `${i}%&${e.target.value}` }) }}></Form.Control>
                                                </Form.Group>
                                                <ButtonGroup>
                                                    <Button onClick={handleEntry}>Save</Button>
                                                </ButtonGroup>
                                            </Accordion.Body>
                                        }
                                    </Accordion.Item>
                                )
                            }
                            )}
                    </Accordion>

                </>
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