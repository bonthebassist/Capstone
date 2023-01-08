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
  const [schoolNames, setSchoolNames] = useState()
  const [attendanceData, setAttendanceData] = useState([])
  const [selectedTerm, setSelectedTerm] = useState()
  const [selectedYear, setSelectedYear] = useState()

  
  const navigate = useNavigate();

  function handleClick(path) { navigate(path); }
  
  //config for API calls

  //get schools inorder for populate table call
  useEffect(() => {
    const config = {
      headers:{
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
  }, [auth.token, auth.email])

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
      console.log(schools)
      let fancyURL = `http://localhost:4000/get/attendanceBySchool?tutor=${auth.user_id}&school=${schools[i]}&schoolDate=${schoolDate}`
      console.log(fancyURL)
      axios.get(fancyURL, config)
        .then((resp) => {
          console.log(resp.data)
          setAttendanceData(oldArray => [...oldArray, resp.data])
        });
    }
  }

  return (
    <>
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
                <Button className='buttons' onClick={populateTables}>Find</Button>
        </Form.Group>
        {selectedTerm && selectedYear ? <h4>Term {selectedTerm} {selectedYear}</h4> : null}
        {!attendanceData ? null :
          attendanceData.map((dataArray, i) => {
            return (
              <MDBTable striped hover>
                <MDBTableHead>
                  <tr>
                    <th style={{ fontWeight: 'bold', fontSize: '1.5em' }} colSpan={12} >{schoolNames[i]}</th>
                  </tr>
                  <tr>
                    <th>Student Name</th>
                    {dataArray[0].attendance.map((element)=>{return <th>{element.week}</th>})}
                    <th scope='col'>Count</th>
                    <th scope='col'>Goal</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {dataArray.map((attendanceObj) => {
                    return (
                      <tr>
                        <th scope='row'>{attendanceObj.studentName}</th>
                        {attendanceObj.attendance.map((entry, i) => {
                          if (!entry.record){
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
            )
          })
        }
        </div>
    </>
  );
}



