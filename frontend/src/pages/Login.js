import React, { useEffect, useState } from 'react'
import "./Login.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const Login = ({ role }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, currentRole } = userState;

    console.log(status, currentUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNum, setRollNum] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [loader, setLoader] = useState(false)

    const adminFields = { email, password }
    const studentFields = { rollNum, password }

    const fields = (role === "Admin")
        ? adminFields
        : studentFields

    const loginHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(loginUser(fields, role))
    }

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }
            else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <>
            <div className="login">
                <span className="loginTitle">{role} Login</span>

                <form className="loginForm" onSubmit={loginHandler}>
                    {(role === "Admin")
                        ?
                        <>
                            <label>Email</label>
                            <input className="loginInput" type="text" placeholder="Enter your email..."
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email" required />
                        </>
                        :
                        <>
                            <label>Roll Number</label>
                            <input className="registerInput" type="number" placeholder="Enter your roll number..."
                                value={rollNum}
                                onChange={(event) => setRollNum(event.target.value)}
                                required />
                        </>
                    }
                    <label>Password</label>
                    <input className="loginInput" type="password" placeholder="Enter your password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password" required />

                    <button className="loginButton" type="submit" disabled={loader}>
                        {loader ? (
                            <div className="load"></div>
                        ) : (
                            'Login'
                        )}
                    </button>

                </form>
            </div >
            {showPopup && <Popup message={message} setShowPopup={setShowPopup} />
            }
        </>
    )
}

export default Login
