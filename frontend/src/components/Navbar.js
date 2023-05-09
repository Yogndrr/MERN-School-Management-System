import React from 'react'
import "./Navbar.css"
import { Link, useLocation } from "react-router-dom";
import { RoleDetection } from './RoleDetection';
import { useSelector } from 'react-redux';

const Navbar = () => {

    const role = RoleDetection()
    const location = useLocation();
    const currentUser = useSelector(state => state.user.currentUser);

    return (
        (currentUser == null && role === "Admin") &&
        <div className="top">
            <div className="right-links">
                <ul className="topList">
                    <li className="topListItem">
                        <Link className={location.pathname === "/adminlogin" ? "active" : "link"} to="/adminlogin">LOGIN</Link>
                    </li>
                    <li className="topListItem">
                        <Link className={location.pathname === "/adminregister" ? "active" : "link"} to="/adminregister">REGISTER</Link>
                    </li>
                </ul>
            </div >
        </div>
    )
}

export default Navbar