import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import DashboardElements from './DashboardPage';

export default function AttendancePage() {
  const schoolsArray=[
    {schoolName: "Hills School", 
    students:[
      {studentName: "Ashley K", 
      attendance: [{"term1": ["P","P","A","L","P","EA","EA","P","EA", null ]}]}]}]
    const studentName=schoolsArray[0].students[0].studentName
    const studentAttendance = schoolsArray[0].students[0].attendance[0].term1
    const attendanceCols = studentAttendance.map((entry) =>
    <td key={entry}>{entry}</td>);
    const count = (attendanceArr) => {
      let lessonCount = 0
      for (let i in attendanceArr){
        if (attendanceArr[i] === "P" || attendanceArr[i] === "L" || attendanceArr[i] === "C" || attendanceArr[i] === "A"){
          lessonCount ++
        }
      }
      return lessonCount
    }
    const lessonCount = count(studentAttendance)
    const goal = 8
    let catchups = goal-lessonCount

  return (
    <>
        <DashboardElements/>
    <div className='content-div'>
    <MDBTable striped hover>
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
          <td style={{fontWeight: 'bold', textAlign: 'center'}}>{lessonCount}</td>
          <td style={{textAlign: 'center'}}>{goal}</td>
          <td style={{textAlign: 'center'}}>{catchups ? catchups : "none" }</td>
        </tr>
      </MDBTableBody>
    </MDBTable>
    </div>
    </>
  );
}