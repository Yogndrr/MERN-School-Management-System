import React, { useState } from 'react';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Snackbar } from '@mui/material';
// import "./Navbar.css"
import "./Topbar.css"

const Topbar = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <SearchOutlinedIcon />
                </div>
                <div className="items">
                    <div className="item" onClick={() => { setOpen(!open) }}>
                        <NotificationsNoneOutlinedIcon className="icon" />
                        <div className="counter">1</div>
                    </div>
                    <div className="item">
                        <img
                            src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className="avatar"
                        />
                    </div>
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <div className="notification-panel">
                    {/* Add your notification content here */}
                    Example Notification Content
                </div>
            </Snackbar>
        </div >
    );
}

export default Topbar;
