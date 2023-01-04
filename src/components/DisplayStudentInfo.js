import { useEffect, useState, useContext } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';

export default function DisplayStudentInfo() {
    const params = useParams();
    const studentName = params.studentName;
    const nameArray = studentName.split(" ")
    const { auth, setAuth } = useContext(AuthContext);
    const [showShow, setShowShow] = useState(false);
    const [Term, setTerm] = useState({
        termNo: "",
        yearNo: "",
        termLength: "",
        goalLessonCount: ""
    });
    const [studentDoc, setStudentDoc] = useState({})
    const [attendanceDoc, setAttendanceDoc] = useState({});
    const [entry, setEntry]=useState({
        attendance:'',
        diaryEntry:''
    })

    const schoolDate = attendanceDoc.schoolDate
    const showForm = () => {
        if (!showShow) {
            setShowShow(true)
        }
    }

    //for getting studentDoc
    useEffect(() => {
        if (auth.token) {
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
        }
    }, [])
    //for getting attendanceDoc
    useEffect(() => {
        if (auth.token) {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    'x-access-token': auth.token
                }
            };
            axios.get(`http://localhost:4001/attendance?email=${auth.email}&FirstName=${nameArray[0]}&LastName=${nameArray[1]}`, config)
                .then((resp) => {
                    console.log(resp.data)
                    setAttendanceDoc(resp.data[0])
                })
        }
    }, [])

    //reqBody for making a term
    let reqBody = {
        studentFirstName: nameArray[0],
        studentLastName: nameArray[1],
        schoolDate: schoolDate, //transform into this state
        termLength: Term.termLength, //number input filed
        attendanceArray: [],
        diaryEntryArray: [],
        school: studentDoc.school, //input autimatically from this page
        lessonCount: "0",
        catchUpCount: "0",
        goalLessonCount: Term.goalLessonCount, //number input field
        invoiced: "unpaid"
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            'x-access-token': auth.token
        }
    };

    const handleTermSubmit = (e) => {
        e.preventDefault()
        setShowShow(false)
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
            studentFirstName:nameArray[0],
            studentLastName:nameArray[1],
            schoolDate:attendanceDoc.schoolDate,
            attendance: entry.attendance,
            diaryEntry: entry.diaryEntry
        }
        axios.post(`http://localhost:4001/attendance?email=${auth.email}`, reqBodyAtt, config)
            .then(response => {
                console.log(response.data)
                // setSuccess(true);
            }).catch(error => {
                console.log(error)
                alert(error)
            })
    }

    return (
        <div className='content-div'>
            <h4>{nameArray[0]}'s Music Diary</h4>
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
            {!attendanceDoc ? null : (
                <>
                    <h2>{attendanceDoc.schoolDate}</h2>
                    <Form>{[...Array(0,1,2,3,4,5,6,7,8,9)].map((i) =>
                        <>
                            <h4>Week {i+1}</h4>
                            <Form.Group>
                                <Form.Label>Attendance</Form.Label>
                                <Form.Check value={schoolDate+"W"+(i+1)+"P"} type="radio" label="Present" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})} />
                                <Form.Check value={schoolDate+"W"+(i+1)+"A"} type="radio" label="Absent" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
                                <Form.Check value={schoolDate+"W"+(i+1)+"E"} type="radio" label="Excused Absence" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
                                <Form.Check value={schoolDate+"W"+(i+1)+"L"} type="radio" label="Late" inline name={"week" + (i+1)} onClick={e => setEntry({...entry, attendance: e.target.value})}/>
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
                    )}</Form>
                </>
            )}
        </div>
    )
}



// const addWeek = () => {
//     students.push(
//     <div>
//     <h4>Week {week}</h4>
//     <Form.Group>
//         <Form.Label>Attendance</Form.Label>
//         <Form.Check type="radio" label="Present" inline name={"group" + week}/>
//         <Form.Check type="radio" label="Absent" inline name={"group" + week}/>
//         <Form.Check type="radio" label="Excused Absence" inline name={"group" + week}/>
//         <Form.Check type="radio" label="Late" inline name={"group" + week}/>
//     </Form.Group>
//     <Form.Group key={students.length}>
//         <Form.Label>Lesson notes:</Form.Label>
//         <Form.Control as="textarea" rows={4}></Form.Control>
//     </Form.Group>
//     <Button onClick={handleEntry}>Save</Button>
//     </div>
//     );
//     setStudents({students : [...students]})
//     setWeek(prevWeek => prevWeek + 1)
// };