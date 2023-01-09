import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Container, Form } from 'react-bootstrap';

export default function AttendancePage() {
  //Context and states
  const { auth } = useContext(AuthContext)
  const [schools, setSchools] = useState()
  const [schoolNames, setSchoolNames] = useState()
  const [attendanceData, setAttendanceData] = useState('')
  const [selectedTerm, setSelectedTerm] = useState()
  const [selectedYear, setSelectedYear] = useState()
  const [errMsg, setErrMsg] = useState('')

  //Navigation
  const navigate = useNavigate();

  function handleClick(path) { navigate(path); }

  //get schools inorder for populate table call and following useEffect call to DB
  useEffect(() => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/schoolsBytutorID?tutor=${auth.user_id}`, config)
      .then((resp) => {
        let schoolsArray = resp.data
        let schoolIDsArray = schoolsArray.map((school) => { return school._id })
        let schoolNamesArray = schoolsArray.map((school) => { return school.schoolName })
        console.log(schoolIDsArray)
        setSchools(schoolIDsArray)
        setSchoolNames(schoolNamesArray)
      });
  }, [auth.token, auth.user_id])

  // similar call to populate tables but based off of current term date
  useEffect(() => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    //Loop to gather data from each school
    for (let i in schools) {
      console.log(schools)
      let fancyURL = `http://localhost:4000/get/attendanceBySchool?tutor=${auth.user_id}&school=${schools[i]}&schoolDate=${auth.currentTermDate}`
      console.log(fancyURL)
      axios.get(fancyURL, config)
        .then((resp) => {
          console.log(resp.data.length)
          if (resp.data.length !== 0) {
            setErrMsg('')
            setAttendanceData(oldArray => [...oldArray, resp.data])
          }
          else {
            setErrMsg("No attendance records found for that term, try adding a term to your students!")
          }
        })
        .catch(error => {
          console.log(error)
          setErrMsg(`${error}`)
        })
    }
  }, [auth.token, auth.user_id, auth.currentTermDate, schools])

  // populate attendanceData once FIND button is clicked
  const populateTables = () => {
    setAttendanceData([])
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    //Format schooldate
    const schoolDate = "T" + selectedTerm + selectedYear

    //Loop for getting all schools data
    for (let i in schools) {
      console.log(schools)
      let fancyURL = `http://localhost:4000/get/attendanceBySchool?tutor=${auth.user_id}&school=${schools[i]}&schoolDate=${schoolDate}`
      console.log(fancyURL)
      axios.get(fancyURL, config)
        .then((resp) => {
          console.log(resp.data.length)
          if (resp.data.length !== 0) {
            setErrMsg('')
            setAttendanceData(oldArray => [...oldArray, resp.data])
          }
          else {
            setErrMsg("No attendance records found for that term, try adding a term to your students!")
          }
        })
        .catch(error => {
          console.log(error)
          setErrMsg(`${error}`)
        })
    }
  }

  return (
    <>
      <Container>
        <div className='content-div'>
          <h2 className='page-title'>Attendance</h2>
          <Form.Group>
            <Form.Label><strong style={{ color: 'white', fontSize: '1.2em' }}>Term</strong></Form.Label>
            <Form.Select value={selectedTerm} onChange={e => { setErrMsg(''); setSelectedTerm(e.target.value) }}>
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
            <Button className='buttons' onClick={populateTables}>Find</Button>
            {!errMsg ? null : <p className='errmsg'>{errMsg}</p>}
          </Form.Group>
          {!attendanceData ? null :
            (
              <>
                {selectedTerm && selectedYear ?
                  <>
                    <h4>Term {selectedTerm} {selectedYear}</h4>
                    <p style={{ color: '#333', backgroundColor: 'rgba(67, 224, 230, .3)', padding: '10px' }}>
                      <strong>Key: </strong><strong>P</strong> Present | <strong>A</strong> Absent without notice | <strong>L</strong> Late | <strong>E</strong> Excused absence
                    </p>
                  </>
                  : null}
                {attendanceData.map((dataArray, i) => {
                  return (
                    <>
                      <MDBTable striped hover className="table-background">
                        <MDBTableHead>
                          <tr>
                            <th style={{ fontWeight: 'bold', fontSize: '1.5em' }} colSpan={12} >{schoolNames[i]}</th>
                          </tr>
                          <tr>
                            <th>Student Name</th>
                            {dataArray[0].attendance.map((element) => { return <th>{element.week}</th> })}
                            <th scope='col'>Count</th>
                            <th scope='col'>Goal</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {dataArray.map((attendanceObj) => {
                            return (
                              <tr>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleClick(`/DisplayStudent/${attendanceObj.studentName}`)} scope='row'>{attendanceObj.studentName}</th>
                                {attendanceObj.attendance.map((entry, i) => {
                                  if (!entry.record) {
                                    return <td key={i}>-</td>
                                  } else {
                                    return <td key={i}>{entry.record}</td>
                                  }
                                })}
                                <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{attendanceObj.lessonCount}</td>
                                <td style={{ textAlign: 'center' }}>{attendanceObj.goalLessonCount}</td>
                              </tr>
                            )
                          })}
                        </MDBTableBody>
                      </MDBTable>
                    </>
                  )
                })}</>
            )
          }

        </div>
      </Container>
    </>
  );
}



