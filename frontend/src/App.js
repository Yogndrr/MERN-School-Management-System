import React from 'react'
import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import RegisterAdmin from './pages/admin/RegisterAdmin';
import AdminProfile from './pages/admin/AdminProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Navbar from './components/Navbar';
import Logout from './pages/Logout';
import { useSelector } from 'react-redux';
import ShowStudents from './pages/admin/studentRelated/ShowStudents';
import AddStudent from './pages/admin/studentRelated/AddStudent';
import ViewStudent from './pages/admin/studentRelated/ViewStudent';
import Topbar from './components/Topbar';
import SideBar from './pages/admin/SideBar';
import AddNotice from './pages/admin/noticeRelated/AddNotice';
import ShowNotices from './pages/admin/noticeRelated/ShowNotices';
import ClassForm from './pages/admin/classRelated/ClassForm';
import ShowClasses from './pages/admin/classRelated/ShowClasses';
import ClassDetails from './pages/admin/classRelated/ClassDetails';
import AddTeacher from './pages/admin/teacherRelated/AddTeacher';
import StudentSideBar from './pages/student/StudentSideBar';
import StudentProfile from './pages/student/StudentProfile';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentComplain from './pages/student/StudentComplain';

const App = () => {
  const userState = useSelector(state => state.user);
  const { status, darkMode, currentRole } = userState;

  console.log(status, currentRole, darkMode);

  return (
    <Router>
      <Navbar />
      {currentRole === null &&
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route path="/Adminlogin" element={<Login role="Admin" />} />
          <Route path="/Studentlogin" element={<Login role="Student" />} />
          <Route path="/Teacherlogin" element={<Login role="Teacher" />} />

          <Route path="/Adminregister" element={<RegisterAdmin />} />

          <Route path='*' element={<Navigate to="/" />} />
        </Routes>}

      {currentRole === "Admin" &&
        <div className="dashboard">
          <SideBar />
          <div className="after-sidebar">
            <Topbar />
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path='*' element={<Navigate to="/" />} />
              <Route path="/Admin/dashboard" element={<AdminDashboard />} />
              <Route path="/Admin/profile" element={<AdminProfile />} />

              <Route path="/Admin/addnotice" element={<AddNotice />} />
              <Route path="/Admin/notices" element={<ShowNotices />} />

              <Route path="/Admin/addclass" element={<ClassForm />} />
              <Route path="/Admin/classes" element={<ShowClasses />} />
              <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
              <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />

              <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
              <Route path="/Admin/students" element={<ShowStudents />} />
              <Route path="/Admin/students/student/:id" element={<ViewStudent />} />

              <Route path="/Admin/addteachers" element={<AddTeacher />} />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      }

      {currentRole === "Student" &&
        <div className="dashboard">
          <StudentSideBar />
          <div className="after-sidebar">
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path='*' element={<Navigate to="/" />} />
              <Route path="/Student/dashboard" element={<StudentDashboard />} />
              <Route path="/Student/profile" element={<StudentProfile />} />

              <Route path="/Student/subjects" element={<StudentSubjects />} />
              <Route path="/Student/complain" element={<StudentComplain />} />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      }

      {currentRole === "Teacher" &&
        <div className="after-sidebar">
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path='*' element={<Navigate to="/" />} />
            <Route path="/Teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      }
    </Router>
  )
}

export default App