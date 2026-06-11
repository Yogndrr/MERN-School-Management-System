import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from './pages/Homepage';
import PortalSelection from './pages/PortalSelection';
import AdminLogin from './pages/AdminLogin';
import TeacherLogin from './pages/TeacherLogin';
import LoginPage from './pages/LoginPage';
import MainDashboardMinimal from './pages/MainDashboardMinimal';
import HomePage from './pages/dashboard/HomePage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminDashboardNew from './pages/dashboard/AdminDashboardNew';
import TeachersPortal from './pages/dashboard/TeachersPortal';
import StudentsPortal from './pages/dashboard/StudentsPortal';
import ClassViewEnhanced from './pages/dashboard/ClassViewEnhanced';
import Library from './pages/dashboard/Library';
import Clinic from './pages/dashboard/Clinic';
import TeacherPortalDashboard from './pages/teacher/TeacherPortalDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Homepage />} />
        
        {/* Portal Selection */}
        <Route path="/get-started" element={<PortalSelection />} />
        
        {/* Login Pages */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Dashboard - New Structure */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        
        {/* Teacher Portal */}
        <Route path="/teacher-portal/*" element={<TeacherPortalDashboard />} />
        <Route path="/teacher/dashboard/*" element={<TeacherPortalDashboard />} />
        
        {/* Student Dashboard */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        {/* Main Dashboard with Sidebar */}
        <Route path="/dashboard/*" element={
          <MainDashboardMinimal>
            <Routes>
              <Route path="home" element={<HomePage />} />
              <Route path="admin" element={<AdminDashboardNew />} />
              <Route path="teachers" element={<TeachersPortal />} />
              <Route path="students" element={<StudentsPortal />} />
              <Route path="class/:className" element={<ClassViewEnhanced />} />
              <Route path="library" element={<Library />} />
              <Route path="clinic" element={<Clinic />} />
              <Route path="*" element={<Navigate to="/dashboard/home" />} />
            </Routes>
          </MainDashboardMinimal>
        } />

        {/* Fallback */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App