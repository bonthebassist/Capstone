import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import axios from 'axios'
import { Button, Container, Form } from "react-bootstrap";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');

    const [firstName, setFirstName] = useState('')

    const [lastName, setLastName] = useState('')

    const [instrument, setInstrument] = useState('')

    const [password, setPassword] = useState('');
    const [pwdFocus, setPwdFocus] = useState(false)
    const [validPwd, setValidPwd] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [matchFocus, setMatchFocus] = useState(false)
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPwd])

    const handleSubmit = async (e) => {
        console.log("in the handleSubmit")
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/post/register',
                { firstName: firstName, lastName: lastName, email: email, instrument: instrument, password: password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setFirstName('');
            setLastName('');
            setEmail('');
            setInstrument('')
            setPassword('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            
        <Container className="form-container">
            <Form onSubmit={handleSubmit} className="form">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Register</h1>
                {success ? (
                <p className='success-msg'>
                    <span> Successfully registered <NavLink to='/login'>Login</NavLink></span>
                </p>
                ) : (
                <p>
                    Already registered?<br />
                    <span className="login-link">
                        <Link to="/login">Login</Link>
                    </span>
                </p>
                )}
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                    type="text"
                    name="firstName"
                    ref={userRef}
                    onChange={(e)=> setFirstName(e.target.value)}
                    value={firstName}
                    autoFocus
                    required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                    type="text"
                    name="lastName"
                    ref={userRef}
                    onChange={(e)=> setLastName(e.target.value)}
                    value={lastName}
                    required 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type="email"
                    name="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Instrument</Form.Label>
                    <Form.Control
                    type="text"
                    name="instrument"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setInstrument(e.target.value)}
                    value={instrument}
                    required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                    </Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </Form.Label>
                    <Form.Control
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                        </p>
                </Form.Group>
                <Form.Group>
                    <Button type="submit" disabled={!firstName || !lastName || !email || !validPwd || !validMatch ? true : false}>Sign up</Button>
                </Form.Group>
                
            </Form>

        </Container>
                
        </>
    )
}

export default Register