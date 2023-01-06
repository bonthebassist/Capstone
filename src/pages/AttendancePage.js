import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import DashboardElements from './DashboardPage';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Form } from 'react-bootstrap';

export default function AttendancePage() {
  const { auth } = useContext(AuthContext)
  const [schools, setSchools] = useState()
  const [attendanceData, setAttendanceData] = useState([])
  const [selectedTerm, setSelectedTerm] = useState()
  const [selectedYear, setSelectedYear] = useState()

  
  const navigate = useNavigate();

  function handleClick(path) { navigate(path); }
  
  //config for API calls

  //get schools inorder to make next API call
  useEffect(() => {
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4001/user?email=${auth.email}`, config)
      .then((resp) => {
        let schoolsArray = resp.data.schools
        let schoolNamesArray = schoolsArray.map((school) => { return school.schoolName })
        console.log(schoolNamesArray)
        setSchools(schoolNamesArray)
      });
  }, [auth.token, auth.email])
  //populate attendanceData state
  // useEffect(() => {
  //   console.log("seoncd useEffect: " + auth.token)
  //   for (let i in schools) {
  //     axios.get(`http://localhost:4001/attendanceSchool?email=${auth.email}&school=${schools[i]}`, config)
  //       .then((resp) => {
  //         console.log(resp.data)
  //         setAttendanceData(oldArray => [...oldArray, resp.data])
  //       });
  //   }
  // }, [schools])

  // populate attendanceData once FIND button is clicked
  const populateTables = () => {
    setAttendanceData([])
    const config = {
      headers:{
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    const schoolDate = "T" +selectedTerm+selectedYear
    console.log(schoolDate)
    for (let i in schools) {
      axios.get(`http://localhost:4001/attendanceSchool?email=${auth.email}&school=${schools[i]}&schoolDate=${schoolDate}`, config)
        .then((resp) => {
          console.log(resp.data)
          setAttendanceData(oldArray => [...oldArray, resp.data])
        });
    }
  }

  return (
    <>
      <DashboardElements />
      <div className='content-div'>
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
                <Button onClick={populateTables}>Find</Button>
        </Form.Group>
        {selectedTerm && selectedYear ? <h4>Term {selectedTerm} {selectedYear}</h4> : null}
        {!attendanceData ? null :
          attendanceData.map((dataArray, i) => {
            return (
              <MDBTable striped hover>
                <MDBTableHead>
                  <tr>
                    <th style={{ fontWeight: 'bold', fontSize: '1.5em' }} colSpan={12} >{schools[i]} {dataArray.schoolDate}</th>
                  </tr>
                  <tr>
                    <th>Student Name</th>
                    <th scope='col'>1</th>
                    <th scope='col'>2</th>
                    <th scope='col'>3</th>
                    <th scope='col'>4</th>
                    <th scope='col'>5</th>
                    <th scope='col'>6</th>
                    <th scope='col'>7</th>
                    <th scope='col'>8</th>
                    <th scope='col'>9</th>
                    <th scope='col'>10</th>
                    <th scope='col'>11</th>
                    <th scope='col'>12</th>
                    <th scope='col'>Count</th>
                    <th scope='col'>Goal</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {dataArray.map((attendanceObj) => {
                    console.log(attendanceObj.attendanceArray.sort())
                    return (
                      <tr>
                        <th scope='row'>{attendanceObj.studentFirstName} {attendanceObj.studentLastName}</th>
                        {attendanceObj.attendanceArray.map((entry, i) => {
                          return <td key={entry + i}>{entry.slice(2)}</td>
                        })}
                        <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{attendanceObj.lessonCount}</td>
                        <td style={{ textAlign: 'center' }}>{attendanceObj.goalLessonCount}</td>
                      </tr>
                    )
                  })}
                </MDBTableBody>
              </MDBTable>
            )
          })
        }
        </div>
    </>
  );
}

{/* <MDBTable striped hover>
            <MDBTableHead>
              <tr>
                <th colSpan={12} >{schoolsArray[0].schoolName}</th>
              </tr>
              <tr>
                <th>Student Name</th>
                <th scope='col'>1</th>
                <th scope='col'>2</th>
                <th scope='col'>3</th>
                <th scope='col'>4</th>
                <th scope='col'>5</th>
                <th scope='col'>6</th>
                <th scope='col'>7</th>
                <th scope='col'>8</th>
                <th scope='col'>9</th>
                <th scope='col'>10</th>
                <th scope='col'>Count</th>
                <th scope='col'>Goal</th>
                <th scope='col'>To Catch up</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              <tr>
                <th scope='row'>{studentName}</th>
                {attendanceCols}
                <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{lessonCount}</td>
                <td style={{ textAlign: 'center' }}>{goal}</td>
                <td style={{ textAlign: 'center' }}>{catchups ? catchups : "none"}</td>
              </tr>
            </MDBTableBody>
          </MDBTable> */}

  // const schoolsArray = [
  //   {
  //     schoolName: "Hills School",
  //     students: [
  //       {
  //         studentName: "Ashley K",
  //         attendance: [{ "term1": ["P", "P", "A", "L", "P", "EA", "EA", "P", "EA", null] }]
  //       }]
  //   }]
  // const studentName = schoolsArray[0].students[0].studentName
  // const studentAttendance = schoolsArray[0].students[0].attendance[0].term1
  // const attendanceCols = studentAttendance.map((entry) =>
  //   <td key={entry}>{entry}</td>);
  // const count = (attendanceArr) => {
  //   let lessonCount = 0
  //   for (let i in attendanceArr) {
  //     if (attendanceArr[i] === "P" || attendanceArr[i] === "L" || attendanceArr[i] === "C" || attendanceArr[i] === "A") {
  //       lessonCount++
  //     }
  //   }
  //   return lessonCount
  // }
  // const lessonCount = count(studentAttendance)
  // const goal = 8
  // let catchups = goal - lessonCount



