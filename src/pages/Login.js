import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthProvider"
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function Login() {
  //Conetxt and states
  const { setAuth } = useContext(AuthContext)
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  //set user focus
  useEffect(() => {
    userRef.current.focus();
  }, [])

  //reset error message on change of input
  useEffect(() => {
    setErrMsg('');
  }, [email, password])

  //submission of login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/post/login',
        { email: email, password: password },
        {
          headers: { 'Context-Type': 'application/json' },
          withCredentials: true
        }
      );

      // get valuable data for site
      const firstName = response?.data?.firstName
      const user_id = response?.data?._id
      const token = response?.data?.token
      const currentTermDate = response?.data?.currentTermDate

      let userStuff = { "user_id": user_id, "token": token, "firstName": firstName, "currentTermDate": currentTermDate }

      //set local storage
      localStorage.setItem('user', JSON.stringify(userStuff))

      //set Auth
      setAuth({ email: email, token: token, firstName: firstName, user_id: user_id, currentTermDate: currentTermDate })

      //Clear inputs
      setEmail('');
      setPassword('');

      //set Success for navigating to /Home
      setSuccess(true)

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400) {
        setErrMsg('Cannot find user')
      } else if (err.response?.status === 500) {
        setErrMsg('Internal server error')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus();
    }

  }

  return (
    <>
      {success ? (
        <Navigate to="/Home" />
      ) : (
        <Container className='form-container'>

          <Form onSubmit={handleSubmit} className='form'>

            <h1>Sign In</h1>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                ref={userRef}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                ref={userRef}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
            </Form.Group>
            <Button type="submit">Sign In</Button>
            <p>
              Need An Account? <br />
              <span className="login-link">
                <Link to="/Register">Sign Up</Link>
              </span>
            </p>
          </Form>

        </Container>
      )}
    </>
  )
}

export default Login