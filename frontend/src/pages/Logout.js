import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Logout.css';
import { authLogout } from '../redux/userRelated/userSlice';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="logout-container">
            <h1>{currentUser.name}</h1>
            <p className="logout-message">Are you sure you want to log out?</p>
            <button className="logout-btn logout" onClick={handleLogout}>Log Out</button>
            <button className="logout-btn cancel" onClick={handleCancel}>Cancel</button>
        </div>
    );
};

export default Logout;
