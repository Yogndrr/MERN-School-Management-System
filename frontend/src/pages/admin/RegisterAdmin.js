import React, { useEffect, useState } from 'react';
import "./RegisterAdmin.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';

const RegisterAdmin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, currentRole } = userState;

    console.log(status, currentUser);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [schoolName, setSchoolName] = useState('')
    const role = "Admin"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const fields = { name, email, password, role, schoolName }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(registerUser(fields, role))
    }

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
        }
    }, [status,currentUser,currentRole, navigate, error, response]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Register</span>
                    <label>Name</label>
                    <input className="registerInput" type="text" placeholder="Enter your name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name" required />

                    <label>School Name</label>
                    <input className="registerInput" type="text" placeholder="Create your school name..."
                        value={schoolName}
                        onChange={(event) => setSchoolName(event.target.value)}
                        autoComplete="name" required />

                    <label>Email</label>
                    <input className="registerInput" type="email" placeholder="Enter your email..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email" required />

                    <label>Password</label>
                    <input className="registerInput" type="password" placeholder="Enter your password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password" required />

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <div className="load"></div>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>
            </div>
            {showPopup && <Popup message={message} setShowPopup={setShowPopup} />}
        </>
    )
}

export default RegisterAdmin