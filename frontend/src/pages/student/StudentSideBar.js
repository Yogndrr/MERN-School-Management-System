import React from 'react'
import "../../components/SideBar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { Link, useLocation } from "react-router-dom";

const StudentSideBar = () => {
    const location = useLocation();
    return (
        <div className="sidebar">
            <div className="top">
                <span className="logo">YOGNDRR</span>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/">
                        <li className={location.pathname === ("/" || "/Student/dashboard") ? "activeList" : ""}>
                            <DashboardIcon className="icon" />
                            <span>Home</span>
                        </li>
                    </Link>
                    <Link to="/Student/subjects">
                        <li className={location.pathname === "/Student/subjects" ? "activeList" : ""}>
                            <ClassOutlinedIcon className="icon" />
                            <span>Subjects</span>
                        </li>
                    </Link>
                    <Link to="/Student/complain">
                        <li className={location.pathname === "/Student/complain" ? "activeList" : ""}>
                            <AnnouncementOutlinedIcon className="icon" />
                            <span>Complain</span>
                        </li>
                    </Link>
                    <p className="title">USER</p>
                    <Link to="/Student/profile">
                        <li className={location.pathname === "/Student/profile" ? "activeList" : ""}>
                            <AccountCircleOutlinedIcon className="icon" />
                            <span>Profile</span>
                        </li>
                    </Link>
                    <Link to="/logout">
                        <li className={location.pathname === "/logout" ? "activeList" : ""}>
                            <ExitToAppIcon className="icon" />
                            <span>Logout</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}

export default StudentSideBar