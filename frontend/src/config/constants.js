// API Configuration
export const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    ADMIN_LOGIN: '/api/auth/admin-login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    CURRENT_USER: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
    
    // Attendance
    MARK_ATTENDANCE: '/api/attendance/mark',
    GET_ATTENDANCE_BY_CLASS: '/api/attendance/class',
    GET_STUDENT_ATTENDANCE: '/api/attendance/student',
    GET_ATTENDANCE_ANALYTICS: '/api/attendance/analytics',
    DELETE_ATTENDANCE: '/api/attendance',
    
    // Marksheet
    UPSERT_MARKSHEET: '/api/marksheet/upsert',
    GET_MARKSHEETS_BY_CLASS: '/api/marksheet/class',
    GET_STUDENT_MARKSHEET: '/api/marksheet/student',
    GET_ACADEMIC_ANALYTICS: '/api/marksheet/analytics',
    DELETE_MARKSHEET: '/api/marksheet',
    BULK_IMPORT_MARKSHEETS: '/api/marksheet/bulk-import',
    
    // Students
    REGISTER_STUDENT: '/api/student/register',
    GET_STUDENT_PROFILE: '/api/student/profile',
    TRANSFER_STUDENT: '/api/student/transfer',
    GET_TRANSFER_HISTORY: '/api/student/transfer-history',
    UPDATE_SPECIAL_NEEDS: '/api/student/special-needs',
    GET_SPECIAL_NEEDS_STUDENTS: '/api/student/special-needs',
    BULK_IMPORT_STUDENTS: '/api/student/bulk-import',
    
    // Library
    ISSUE_BOOK: '/api/library/issue',
    RETURN_BOOK: '/api/library/return',
    GET_STUDENT_LIBRARY: '/api/library/student',
    GET_BORROWED_BOOKS: '/api/library/borrowed',
    GET_OVERDUE_BOOKS: '/api/library/overdue',
    PAY_FINE: '/api/library/pay-fine',
    LIBRARY_ANALYTICS: '/api/library/analytics',
    
    // Clinic
    RECORD_CLINIC_VISIT: '/api/clinic/visit',
    GET_STUDENT_CLINIC: '/api/clinic/student',
    GET_CLINIC_VISITS: '/api/clinic/visits',
    GET_LEAVE_REQUESTS: '/api/clinic/leave-requests',
    PROCESS_LEAVE_REQUEST: '/api/clinic/leave-request',
    UPDATE_FOLLOW_UP: '/api/clinic/follow-up',
    CLINIC_ANALYTICS: '/api/clinic/analytics',
    GENERATE_CASE_REPORT: '/api/clinic/case-report',
    
    // Enhanced Transfer
    TRANSFER_WITH_DATA: '/api/transfer/student',
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    MAIN_TEACHER: 'main_teacher',
    ASSISTANT_TEACHER: 'assistant_teacher',
    SUBJECT_TEACHER: 'subject_teacher',
    STUDENT: 'Student',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
    PRESENT: 'P',
    LATE: 'L',
    ABSENT: 'A',
    ABSENT_WITH_PERMISSION: 'AP',
};

export const ATTENDANCE_STATUS_LABELS = {
    P: 'Present',
    L: 'Late',
    A: 'Absent',
    AP: 'Absent with Permission',
};

export const ATTENDANCE_STATUS_COLORS = {
    P: '#10b981', // Green
    L: '#f59e0b', // Orange
    A: '#ef4444', // Red
    AP: '#3b82f6', // Blue
};

// Attendance Types
export const ATTENDANCE_TYPES = {
    HOMEROOM: 'homeroom',
    SUBJECT: 'subject',
};

// Academic Terms
export const ACADEMIC_TERMS = ['Term 1', 'Term 2', 'Term 3', 'Final'];

// Special Needs Categories
export const SPECIAL_NEEDS_CATEGORIES = [
    { value: 'learning', label: 'Learning' },
    { value: 'physical', label: 'Physical' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'medical', label: 'Medical' },
    { value: 'other', label: 'Other' },
    { value: 'none', label: 'None' },
];

// Grade Thresholds
export const GRADE_THRESHOLDS = {
    'A+': 90,
    'A': 80,
    'B+': 70,
    'B': 60,
    'C': 50,
    'D': 40,
    'F': 0,
};

// Permissions by Role
export const ROLE_PERMISSIONS = {
    admin: {
        studentManagement: ['create', 'read', 'update', 'delete', 'transfer'],
        attendance: ['mark_homeroom', 'mark_subject', 'view_all', 'edit_all', 'delete'],
        academic: ['view_marks', 'enter_marks', 'edit_marks', 'delete_marks', 'generate_reports'],
        userManagement: ['create_users', 'edit_users', 'delete_users', 'assign_roles'],
        system: ['full_access', 'export_data', 'backup_restore'],
    },
    main_teacher: {
        studentManagement: ['create', 'read', 'update', 'transfer', 'delete'],
        attendance: ['mark_homeroom', 'view_all', 'edit_own'],
        academic: ['view_marks', 'generate_reports'],
        classManagement: ['manage_students', 'view_analytics'],
        transfer: ['initiate_transfers', 'view_transfer_history'],
    },
    assistant_teacher: {
        studentManagement: ['read', 'update_limited'],
        attendance: ['mark_homeroom', 'view_own_class'],
        academic: ['view_marks'],
        restrictions: ['no_deletes', 'no_transfers'],
    },
    subject_teacher: {
        attendance: ['mark_subject_wise'],
        academic: ['enter_marks', 'update_marksheets', 'view_subject_students'],
        restrictions: ['subject_scope_only'],
    },
};

// Chart Colors
export const CHART_COLORS = {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#fde047',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    FULL: 'MMMM dd, yyyy',
    SHORT: 'MM/dd/yyyy',
    TIME: 'hh:mm a',
    DATETIME: 'MMM dd, yyyy hh:mm a',
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Export Formats
export const EXPORT_FORMATS = {
    CSV: 'csv',
    PDF: 'pdf',
    EXCEL: 'xlsx',
    BIS_NOC: 'bis_noc',
};

export default {
    API_BASE_URL,
    API_ENDPOINTS,
    USER_ROLES,
    ATTENDANCE_STATUS,
    ATTENDANCE_STATUS_LABELS,
    ATTENDANCE_STATUS_COLORS,
    ATTENDANCE_TYPES,
    ACADEMIC_TERMS,
    SPECIAL_NEEDS_CATEGORIES,
    GRADE_THRESHOLDS,
    ROLE_PERMISSIONS,
    CHART_COLORS,
    DATE_FORMATS,
    PAGINATION,
    EXPORT_FORMATS,
};
