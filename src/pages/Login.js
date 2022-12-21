import React from 'react'
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useContext } from 'react'
import {AuthContext} from "../context/AuthProvider"
import axios from '../api/axios';
import { NavLink } from 'react-bootstrap';
import DashboardElements from './DashboardPage';
import { Navigate } from 'react-router-dom';
const LOGIN_URL = './users/login';

function Login() {
  const { setAuth } = useContext(AuthContext)
  const userRef = useRef();
  const errRef = useRef();

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
      const response = await axios.post(LOGIN_URL,
        {email: email, password: password},
        {
          headers: { 'Context-Type': 'application/json'},
          withCredentials: true
        }
        );
      console.log(JSON.stringify(response?.data));
      setAuth({ email: email, password: password})
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
        <section>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button>Sign In</button>
          </form>
          <p>
            Need An Account? <br />
            <span className='line'>
              <Link to='/Register'>Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </>
  )
}

export default Login

// const accessToken = response?.data?.accessToken;
//       const roles = response?.data?.roles;
//       setAuth({ user, pwd, roles, accessToken })