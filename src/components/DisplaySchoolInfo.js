import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom'
import { Button, Card, CardGroup } from 'react-bootstrap'
import axios from 'axios'
import { AuthContext } from '../context/AuthProvider';
import { MDBIcon } from 'mdb-react-ui-kit';

function DisplaySchoolInfo() {
  //Params
  const params = useParams();
  const schoolName = params.schoolName

  //Context and states
  const { auth } = useContext(AuthContext)
  const [schoolsData, setSchoolsData] = useState()
  const [studentData, setStudentData] = useState()
  const [studentEmails, setStudentEmails] = useState([])
  const [parentEmails, setParentEmails] = useState([])
  const [addAdminClick, setAddAdminClick] = useState(false)
  const [addLinkClick, setAddLinkClick] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    contactName: '',
    contactEmail: ''
  })
  const [newLink, setNewLink] = useState({
    linkTitle: '',
    linkURL: ''
  })
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  //Navigation
  const navigate = useNavigate();

  function handleClick(path) { navigate(path); }

  //Get all schools matching user_id
  useEffect(() => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/schoolsBytutorID?tutor=${auth.user_id}`, config)
      .then((resp) => {
        console.log("in the .then")
        console.log(resp)
        
        //filter to find school data that matches params
        let allSchools = resp.data
        let actualSchool = allSchools.filter(function (el) {
          return el.schoolName === schoolName
        })

        //Set state with data
        setSchoolsData(actualSchool[0])
      })
  }, [auth])

  //Get all students then filter by schoolName - setting studentData state
  useEffect(() => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        'x-access-token': auth.token
      }
    };
    axios.get(`http://localhost:4000/get/studentsBytutorID?tutor=${auth.user_id}`, config)
      .then((resp) => {
        console.log("in the .then of students effect")
        console.log(resp.data)
        let allStudents = resp.data
        let actualStudents = allStudents.filter(function (el) {
          return el.schoolName === schoolName
        })
        setStudentData(actualStudents)

        //setting email arrays for mass emailing!
        let studentEmailArray = actualStudents.map((student) => {
          return student.studentEmail
        })
        let joinedStudentEmails = studentEmailArray.join()
        
        setStudentEmails(joinedStudentEmails)

        let parentEmailArray = actualStudents.map((student) => {
          return student.parentEmail
        })
        let joinedParentEmails = parentEmailArray.join()

        setParentEmails(joinedParentEmails)
      })
  }, [auth])

  //Axios headers configuration
  const config = {
    headers: {
      'Content-type': 'application/json',
      'x-access-token': auth.token
    }
  };

  //To add new administrator
  const saveNewAdmin = () => {
    const reqBody = {
      school_id: schoolsData._id,
      contactName: newAdmin.contactName,
      contactEmail: newAdmin.contactEmail
    }

    axios.put(`http://localhost:4000/put/schoolAdminAdd`, reqBody, config)
      .then(response => {
        console.log(response.data)
        if (response.data.modifiedCount) {
          setAddAdminClick(false)
        }
      }).catch(error => {
        console.log(error)
        alert(error)
      })

    console.log(reqBody)
  }

  //To add new link
  const saveNewLink = () => {
    const reqBody = {
      school_id: schoolsData._id,
      linkTitle: newLink.linkTitle,
      linkURL: newLink.linkURL
    }

    axios.put(`http://localhost:4000/put/schoolLinksAdd`, reqBody, config)
      .then(response => {
        console.log(response.data)
        if (response.data.modifiedCount) {
          setAddLinkClick(false)
        }
      }).catch(error => {
        console.log(error)
        alert(error)
      })

    console.log(reqBody)
  }

  //To delete school and association students/atttendance records
  const deleteSchool = (e) => {
    e.preventDefault()
    console.log(schoolName + " to be deleted")
    axios.delete(`http://localhost:4000/delete/school?school=${schoolsData._id}`, config)
      .then(response => {
        console.log(response.data)
        setDeleteSuccess(true)
      }).catch(error => {
        console.log(error)
        setErrMsg(error)
      })
  }


  return (
    <>
      {!schoolsData ? null : (
        <div className='content-div'>
          <h2 className='page-title'>{schoolName}</h2>
          <h5>Contacts</h5>
          <CardGroup>
            {
              schoolsData.schoolAdmin.map((administrator) => {
                return (
                  <Card className='add-card'>
                    <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `mailto:${administrator.contactEmail}`;
                    }}>
                      <Card.Title>{administrator.contactName}</Card.Title>
                    </Card.Body>
                  </Card>
                )
              })
            }

            <Card className='add-card' >
              <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                e.preventDefault();
                console.log(studentEmails)
                window.location.href = `mailto:${studentEmails}?cc=${parentEmails}`;
              }}>
                <Card.Title>All students</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                e.preventDefault();
                console.log(parentEmails)
                window.location.href = `mailto:${parentEmails}`;
              }}>
                <Card.Title>All parents</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body style={{ cursor: 'pointer' }} onClick={() => setAddAdminClick(true)}>
                <Card.Title> <MDBIcon fas icon="plus" /> Add </Card.Title>
              </Card.Body>
            </Card>
          </CardGroup>
          {!addAdminClick ? null : (
            <>

              <h5>Add a School contact</h5>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Administrator Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={newAdmin.contactName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, contactName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Administrator Email</Form.Label>
                  <Form.Control
                    type='email'
                    value={newAdmin.contactEmail}
                    onChange={(e) => setNewAdmin({ ...newAdmin, contactEmail: e.target.value })}
                  />
                </Form.Group>
                <Button onClick={saveNewAdmin}>Save</Button>
                <Button variant='danger' onClick={() => setAddAdminClick(false)}>Cancel</Button>
              </Form>
            </>
          )}

          <h5>Quick Links</h5>
          <CardGroup>
            {
              schoolsData.usefulLinks.map((link) => {
                return (
                  <Card className='add-card'>
                    <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${link.linkURL}`;
                    }}>
                      <Card.Title>{link.linkTitle}</Card.Title>
                    </Card.Body>
                  </Card>
                )
              })
            }
            <Card className='add-card' >
              <Card.Body style={{ cursor: 'pointer' }} onClick={(e) => {
                e.preventDefault();
                window.location.href = `${schoolsData.usefulLinks[0].linkURL}`;
              }}>
                <Card.Title>{schoolsData.usefulLinks[0].linkTitle}</Card.Title>
              </Card.Body>
            </Card>
            <Card className='add-card' >
              <Card.Body style={{ cursor: 'pointer' }} onClick={() => setAddLinkClick(true)}>
                <Card.Title> <MDBIcon fas icon="plus" /> Add </Card.Title>
              </Card.Body>
            </Card>
          </CardGroup>

          {!addLinkClick ? null : (
            <>
              <h5>Add a Link</h5>
              <Form>
                <Form.Group>
                  <Form.Label>Link Title</Form.Label>
                  <Form.Control
                    type='text'
                    value={newLink.linkTitle}
                    onChange={(e) => setNewLink({ ...newLink, linkTitle: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Link URL</Form.Label>
                  <Form.Control
                    type='text'
                    value={newLink.linkURL}
                    onChange={(e) => setNewLink({ ...newLink, linkURL: e.target.value })}
                  />
                </Form.Group>
                <Button onClick={saveNewLink}>Save</Button>
                <Button variant='danger' onClick={() => setAddLinkClick(false)}>Cancel</Button>
              </Form>
            </>
          )}

          <h5>Students</h5>
          {studentData ? studentData.map((student) => {
            return (
              <CardGroup>
                <Card className='student-card'>
                  <Card.Body style={{ cursor: 'pointer' }} onClick={() => handleClick(`/DisplayStudent/${student.studentFirstName + " " + student.studentLastName}`)}>
                    <Card.Title className='student.card.title'>{student.studentFirstName} {student.studentLastName}</Card.Title>
                    <Card.Text>{student.instrument} . Year {student.yearLevel}</Card.Text>
                  </Card.Body>
                </Card>
              </CardGroup>
            )
          }) : null}
          <Card className='add-card' >
            <Card.Body style={{ cursor: 'pointer' }} onClick={() => handleClick(`/Students/NewStudent`)}>
              <Card.Title> <MDBIcon fas icon="plus" /> Add a Student</Card.Title>
            </Card.Body>
          </Card>
          {!deleteSuccess ? null : <p className='success-msg'>Deleted succesfully. Go back to <Link to='/Schools'>Schools</Link></p>}
          {!errMsg ? null : <p className='errmsg'>{errMsg}</p>}
          <Button variant='danger' className='buttons' onClick={deleteSchool}>Delete School</Button>
          <p><strong style={{ color: 'red' }}>WARNING </strong>This will delete all associated students and attendance records</p>
        </div>
      )}

    </>
  )
}

export default DisplaySchoolInfo