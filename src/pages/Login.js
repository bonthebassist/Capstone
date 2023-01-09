import React from 'react'
import { NavLink, Link } from 'react-router-dom';
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
      const response = await axios.post('http://localhost:4000/post/login',
        {email: email, password: password},
        {
          headers: { 'Context-Type': 'application/json'},
          withCredentials: true
        }
        );

      const firstName = response?.data?.firstName
      const user_id = response?.data?._id
      const token = response?.data?.token

      let userStuff = {"user_id":user_id, "token":token, "firstName":firstName, "user_id": user_id}
      
      localStorage.setItem('user', JSON.stringify(userStuff))
      
      setAuth({ email: email, token: token, firstName: firstName, user_id: user_id })
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

// const accessToken = response?.data?.accessToken;
//       const roles = response?.data?.roles;
//       setAuth({ user, pwd, roles, accessToken })