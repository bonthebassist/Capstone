import React from 'react'
import { NavLink } from 'react-router-dom';
import { useRef, useState, useEffect, useContext } from 'react'
import {AuthContext} from "../context/AuthProvider"
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';

function Login() {
  const { auth, setAuth } = useContext(AuthContext)
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4001/login',
        {email: email, password: password},
        {
          headers: { 'Context-Type': 'application/json'},
          withCredentials: true
        }
        );

        let userStuff = {"email":response.data.email, "token":response.data.token}
        localStorage.setItem('user', JSON.stringify(userStuff))

      const token = response?.data?.token
      setAuth({ email: email, token: token})
      setEmail('');
      setPassword('');
      setSuccess(true);

      
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400){
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
        <Navigate to="/Schools" />
      ) : (
        <Container>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Sign In</h1>
          <Form onSubmit={handleSubmit}>
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
              autoFocus/>
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
          </Form>
          <p>
            Need An Account? <br />
            <NavLink to='/Register'>Sign Up</NavLink>
          </p>
        </Container>
      )}
    </>
  )
}

export default Login

// const accessToken = response?.data?.accessToken;
//       const roles = response?.data?.roles;
//       setAuth({ user, pwd, roles, accessToken })