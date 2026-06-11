import { format, parseISO } from 'date-fns';
import { 
    ATTENDANCE_STATUS_LABELS, 
    GRADE_THRESHOLDS,
    DATE_FORMATS 
} from '../config/constants';

// Format date
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr);
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
};

// Get attendance status label
export const getAttendanceStatusLabel = (status) => {
    return ATTENDANCE_STATUS_LABELS[status] || status;
};

// Calculate attendance percentage
export const calculateAttendancePercentage = (present, total) => {
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(2);
};

// Calculate grade from percentage
export const calculateGrade = (percentage) => {
    if (percentage >= GRADE_THRESHOLDS['A+']) return 'A+';
    if (percentage >= GRADE_THRESHOLDS['A']) return 'A';
    if (percentage >= GRADE_THRESHOLDS['B+']) return 'B+';
    if (percentage >= GRADE_THRESHOLDS['B']) return 'B';
    if (percentage >= GRADE_THRESHOLDS['C']) return 'C';
    if (percentage >= GRADE_THRESHOLDS['D']) return 'D';
    return 'F';
};

// Get grade color
export const getGradeColor = (grade) => {
    const colors = {
        'A+': '#10b981',
        'A': '#34d399',
        'B+': '#3b82f6',
        'B': '#60a5fa',
        'C': '#f59e0b',
        'D': '#f97316',
        'F': '#ef4444',
    };
    return colors[grade] || '#6b7280';
};

// Check if user has permission
export const hasPermission = (userRole, permission) => {
    const rolePermissions = {
        admin: ['full_access'],
        main_teacher: ['create', 'read', 'update', 'delete', 'transfer'],
        assistant_teacher: ['read', 'update_limited'],
        subject_teacher: ['read', 'mark_attendance', 'enter_marks'],
    };
    
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes('full_access') || permissions.includes(permission);
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
export const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        strength: errors.length === 0 ? 'strong' : errors.length <= 2 ? 'medium' : 'weak'
    };
};

// Export data to CSV
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Generate student ID
export const generateStudentId = (prefix = 'BIS') => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${random}`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};

// Truncate text
export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

// Sort array of objects
export const sortByKey = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

export default {
    formatDate,
    getAttendanceStatusLabel,
    calculateAttendancePercentage,
    calculateGrade,
    getGradeColor,
    hasPermission,
    isValidEmail,
    validatePasswordStrength,
    exportToCSV,
    debounce,
    generateStudentId,
    formatPhoneNumber,
    truncateText,
    getInitials,
    sortByKey,
    groupBy,
};
