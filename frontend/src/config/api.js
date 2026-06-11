// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
    // Base URL
    BASE_URL: API_BASE_URL,
    
    // Admin
    ADMIN_REGISTER: `${API_BASE_URL}/AdminReg`,
    ADMIN_LOGIN: `${API_BASE_URL}/AdminLogin`,
    
    // Student
    STUDENT_REGISTER: `${API_BASE_URL}/StudentReg`,
    STUDENT_LOGIN: `${API_BASE_URL}/StudentLogin`,
    STUDENTS_ALL: `${API_BASE_URL}/Students/all`,
    STUDENT_DETAIL: (id) => `${API_BASE_URL}/Student/${id}`,
    STUDENT_UPDATE: (id) => `${API_BASE_URL}/Student/${id}`,
    STUDENT_DELETE: (id) => `${API_BASE_URL}/Student/${id}`,
    STUDENT_TRANSFER: (id) => `${API_BASE_URL}/api/student/transfer/${id}`,
    STUDENT_TRANSFER_WITH_DATA: (id) => `${API_BASE_URL}/api/transfer/student/${id}`,
    STUDENT_SPECIAL_NEEDS: (id) => `${API_BASE_URL}/api/student/special-needs/${id}`,
    
    // Teacher
    TEACHER_REGISTER: `${API_BASE_URL}/TeacherReg`,
    TEACHER_LOGIN: `${API_BASE_URL}/TeacherLogin`,
    TEACHERS_ALL: `${API_BASE_URL}/AllTeachers`,
    TEACHER_DETAIL: (id) => `${API_BASE_URL}/Teacher/${id}`,
    TEACHER_UPDATE: (id) => `${API_BASE_URL}/Teacher/${id}`,
    TEACHER_DELETE: (id) => `${API_BASE_URL}/Teacher/${id}`,
    TEACHER_SUBJECT_UPDATE: `${API_BASE_URL}/TeacherSubject`,
    
    // Class
    CLASSES_ALL: `${API_BASE_URL}/Sclasses`,
    CLASS_CREATE: `${API_BASE_URL}/SclassCreate`,
    CLASS_DETAIL: (id) => `${API_BASE_URL}/Sclass/${id}`,
    CLASS_DELETE: (id) => `${API_BASE_URL}/Sclass/${id}`,
    CLASS_LIST: (adminId) => `${API_BASE_URL}/SclassList/${adminId}`,
    
    // Subject
    SUBJECTS_ALL: (adminId) => `${API_BASE_URL}/AllSubjects/${adminId}`,
    SUBJECT_CREATE: `${API_BASE_URL}/SubjectCreate`,
    SUBJECT_DETAIL: (id) => `${API_BASE_URL}/Subject/${id}`,
    SUBJECT_DELETE: (id) => `${API_BASE_URL}/Subject/${id}`,
    CLASS_SUBJECTS: (classId) => `${API_BASE_URL}/ClassSubjects/${classId}`,
    
    // Library
    LIBRARY_ISSUE: `${API_BASE_URL}/api/library/issue`,
    LIBRARY_RETURN: (id) => `${API_BASE_URL}/api/library/return/${id}`,
    LIBRARY_STUDENT_HISTORY: (id) => `${API_BASE_URL}/api/library/student/${id}`,
    LIBRARY_BORROWED: `${API_BASE_URL}/api/library/borrowed`,
    LIBRARY_OVERDUE: `${API_BASE_URL}/api/library/overdue`,
    LIBRARY_PAY_FINE: (id) => `${API_BASE_URL}/api/library/pay-fine/${id}`,
    LIBRARY_ANALYTICS: `${API_BASE_URL}/api/library/analytics`,

    // Clinic
    CLINIC_VISIT: `${API_BASE_URL}/api/clinic/visit`,
    CLINIC_STUDENT_HISTORY: (id) => `${API_BASE_URL}/api/clinic/student/${id}`,
    CLINIC_VISITS_ALL: `${API_BASE_URL}/api/clinic/visits`,
    CLINIC_LEAVE_REQUESTS: `${API_BASE_URL}/api/clinic/leave-requests`,
    CLINIC_PROCESS_LEAVE: (id) => `${API_BASE_URL}/api/clinic/leave-request/${id}`,
    CLINIC_FOLLOW_UP: (id) => `${API_BASE_URL}/api/clinic/follow-up/${id}`,
    CLINIC_ANALYTICS: `${API_BASE_URL}/api/clinic/analytics`,
    CLINIC_CASE_REPORT: (id) => `${API_BASE_URL}/api/clinic/case-report/${id}`,

    // Health Check
    HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
