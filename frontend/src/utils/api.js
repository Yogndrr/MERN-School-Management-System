import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
            
            // Handle 403 Forbidden
            if (error.response.status === 403) {
                console.error('Permission denied');
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Helper functions for common API calls
export const apiHelpers = {
    // Auth
    login: (credentials) => api.post('/api/auth/login', credentials),
    adminLogin: (credentials) => api.post('/api/auth/admin-login', credentials),
    getCurrentUser: () => api.get('/api/auth/me'),
    logout: () => api.post('/api/auth/logout'),
    changePassword: (data) => api.put('/api/auth/change-password', data),
    
    // Attendance
    markAttendance: (data) => api.post('/api/attendance/mark', data),
    getAttendanceByClass: (params) => api.get('/api/attendance/class', { params }),
    getStudentAttendance: (studentId, params) => 
        api.get(`/api/attendance/student/${studentId}`, { params }),
    getAttendanceAnalytics: (params) => api.get('/api/attendance/analytics', { params }),
    deleteAttendance: (id) => api.delete(`/api/attendance/${id}`),
    
    // Marksheet
    upsertMarksheet: (data) => api.post('/api/marksheet/upsert', data),
    getMarksheetsByClass: (params) => api.get('/api/marksheet/class', { params }),
    getStudentMarksheet: (studentId, params) => 
        api.get(`/api/marksheet/student/${studentId}`, { params }),
    getAcademicAnalytics: (params) => api.get('/api/marksheet/analytics', { params }),
    deleteMarksheet: (id) => api.delete(`/api/marksheet/${id}`),
    bulkImportMarksheets: (data) => api.post('/api/marksheet/bulk-import', data),
    
    // Students
    registerStudent: (data) => api.post('/api/student/register', data),
    getStudentProfile: (studentId) => api.get(`/api/student/profile/${studentId}`),
    transferStudent: (studentId, data) => api.put(`/api/student/transfer/${studentId}`, data),
    getTransferHistory: (studentId) => api.get(`/api/student/transfer-history/${studentId}`),
    updateSpecialNeeds: (studentId, data) => 
        api.put(`/api/student/special-needs/${studentId}`, data),
    getSpecialNeedsStudents: (params) => api.get('/api/student/special-needs', { params }),
    bulkImportStudents: (data) => api.post('/api/student/bulk-import', data),
};
