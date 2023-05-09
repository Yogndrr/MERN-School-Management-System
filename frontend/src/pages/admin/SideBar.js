import "../../components/SideBar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
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
                        <li className={location.pathname === ("/" || "/Admin/dashboard") ? "activeList" : ""}>
                            <DashboardIcon className="icon" />
                            <span>Home</span>
                        </li>
                    </Link>
                    <Link to="/Admin/classes">
                        <li className={location.pathname === "/Admin/classes" ? "activeList" : ""}>
                            <ClassOutlinedIcon className="icon" />
                            <span>Classes</span>
                        </li>
                    </Link>
                    <Link to="/Admin/addteachers">
                        <li className={location.pathname === "/Admin/addteachers" ? "activeList" : ""}>
                            <SupervisorAccountOutlinedIcon className="icon" />
                            <span>Teachers</span>
                        </li>
                    </Link>
                    <Link to="/Admin/students">
                        <li className={location.pathname === "/Admin/students" ? "activeList" : ""}>
                            <PersonOutlineIcon className="icon" />
                            <span>Students</span>
                        </li>
                    </Link>
                    <Link to="/Admin/notices">
                        <li className={location.pathname === "/Admin/notices" ? "activeList" : ""}>
                            <AnnouncementOutlinedIcon className="icon" />
                            <span>Notices</span>
                        </li>
                    </Link>
                    <p className="title">USER</p>
                    <Link to="/Admin/profile">
                        <li className={location.pathname === "/Admin/profile" ? "activeList" : ""}>
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
};

export default SideBar;