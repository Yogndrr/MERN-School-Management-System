import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom'
import { authLogout } from '../../redux/userRelated/userSlice';

const AdminProfile = () => {
    const [showTab, setShowTab] = useState(false);
    const buttonText = showTab ? 'Cancel' : 'Edit profile';

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { userDetails, currentUser, response, loading, error } = useSelector((state) => state.user);
    console.log(userDetails, loading, error, response)
    const address = "Admin"

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, address));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [schoolName, setSchoolName] = useState('');

    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName }

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, address));
    }, []);

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setEmail(userDetails.email || '');
            setSchoolName(userDetails.schoolName || '');
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, currentUser._id, address))
            .then(() => {
                dispatch(getUserDetails(currentUser._id, address));
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteHandler = () => {
        try {
            dispatch(deleteUser(currentUser._id, "Students"));
            dispatch(deleteUser(currentUser._id, address));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <div>
                    Name: {userDetails.name}
                    <br />
                    Email: {userDetails.email}
                    <br />
                    School: {userDetails.schoolName}
                    <br />
                    <button onClick={deleteHandler}>Delete</button>
                    <button className="show-tab" onClick={() => { setShowTab(!showTab) }}>{buttonText}</button>
                    {
                        showTab &&
                        <>
                            <div className="register">
                                <form className="registerForm" onSubmit={submitHandler}>
                                    <span className="registerTitle">Edit Details</span>
                                    <label>Name</label>
                                    <input className="registerInput" type="text" placeholder="Enter your name..."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        autoComplete="name" required />

                                    <label>School</label>
                                    <input className="registerInput" type="text" placeholder="Enter your school name..."
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
                                        autoComplete="new-password" />

                                    <button className="registerButton" type="submit" >Update</button>
                                </form>
                            </div>
                        </>
                    }
                </div>}
        </>
    )
}

export default AdminProfile

