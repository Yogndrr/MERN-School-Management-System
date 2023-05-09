import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {

    return (
        <div className="card-grid-container">
            <Link className="card" to="/adminlogin">
                <h2 className="card-title">Admin</h2>
                <p className="card-description">Login as an administrator to access the dashboard to manage app data.</p>
            </Link>
            <Link className="card" to="/studentlogin">
                <h2 className="card-title">Student</h2>
                <p className="card-description">Login as a student to explore course materials and assignments.</p>
            </Link>
            <Link className="card" to="/teacherlogin">
                <h2 className="card-title">Teacher</h2>
                <p className="card-description">Login as a teacher to create courses, assignments, and track student progress.</p>
            </Link>
        </div>
    );
};

export default Homepage;
