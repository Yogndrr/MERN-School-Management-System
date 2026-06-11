const router = require('express').Router();
const { authenticate, authorize, checkPermission } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

// Import Controllers
const {
    registerUser,
    loginUser,
    adminLogin,
    getCurrentUser,
    logout,
    changePassword
} = require('../controllers/auth-controller');

const {
    markAttendance,
    getAttendanceByClassAndDate,
    getStudentAttendance,
    getAttendanceAnalytics,
    deleteAttendance
} = require('../controllers/attendance-controller');

const {
    upsertMarksheet,
    getMarksheetsByClassAndTerm,
    getStudentMarksheet,
    getAcademicAnalytics,
    deleteMarksheet,
    bulkImportMarksheets
} = require('../controllers/marksheet-controller');

const {
    transferStudent,
    getTransferHistory,
    updateSpecialNeeds,
    getSpecialNeedsStudents,
    registerStudentEnhanced,
    getStudentProfile,
    bulkImportStudents
} = require('../controllers/enhanced-student-controller');

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Public routes with rate limiting
router.post('/auth/login', authLimiter, loginUser);
router.post('/auth/admin-login', authLimiter, adminLogin);

// Protected routes
router.get('/auth/me', authenticate, getCurrentUser);
router.post('/auth/logout', authenticate, logout);
router.put('/auth/change-password', authenticate, changePassword);

// Admin only - User management
router.post('/auth/register', authenticate, authorize('admin'), registerUser);

// ============================================
// ATTENDANCE ROUTES
// ============================================

// Mark attendance (Main Teachers, Assistant Teachers, Subject Teachers)
router.post(
    '/attendance/mark',
    authenticate,
    authorize('admin', 'main_teacher', 'assistant_teacher', 'subject_teacher'),
    markAttendance
);

// Get attendance by class and date
router.get(
    '/attendance/class',
    authenticate,
    getAttendanceByClassAndDate
);

// Get student attendance history
router.get(
    '/attendance/student/:studentId',
    authenticate,
    getStudentAttendance
);

// Get attendance analytics (Admin, Main Teachers)
router.get(
    '/attendance/analytics',
    authenticate,
    authorize('admin', 'main_teacher'),
    getAttendanceAnalytics
);

// Delete attendance (Admin, Main Teachers only)
router.delete(
    '/attendance/:id',
    authenticate,
    authorize('admin', 'main_teacher'),
    deleteAttendance
);

// ============================================
// MARKSHEET ROUTES
// ============================================

// Create or update marksheet (Subject Teachers, Main Teachers, Admin)
router.post(
    '/marksheet/upsert',
    authenticate,
    authorize('admin', 'main_teacher', 'subject_teacher'),
    upsertMarksheet
);

// Get marksheets by class and term
router.get(
    '/marksheet/class',
    authenticate,
    getMarksheetsByClassAndTerm
);

// Get student marksheet
router.get(
    '/marksheet/student/:studentId',
    authenticate,
    getStudentMarksheet
);

// Get academic analytics
router.get(
    '/marksheet/analytics',
    authenticate,
    authorize('admin', 'main_teacher'),
    getAcademicAnalytics
);

// Delete marksheet (Admin only)
router.delete(
    '/marksheet/:id',
    authenticate,
    authorize('admin'),
    deleteMarksheet
);

// Bulk import marksheets (Admin, Main Teachers)
router.post(
    '/marksheet/bulk-import',
    authenticate,
    authorize('admin', 'main_teacher'),
    bulkImportMarksheets
);

// ============================================
// ENHANCED STUDENT ROUTES
// ============================================

// Register student (Admin, Main Teachers)
router.post(
    '/student/register',
    authenticate,
    authorize('admin', 'main_teacher'),
    registerStudentEnhanced
);

// Get student profile
router.get(
    '/student/profile/:studentId',
    authenticate,
    getStudentProfile
);

// Transfer student (Main Teachers only)
router.put(
    '/student/transfer/:studentId',
    authenticate,
    authorize('admin', 'main_teacher'),
    checkPermission('transfer'),
    transferStudent
);

// Get transfer history
router.get(
    '/student/transfer-history/:studentId',
    authenticate,
    getTransferHistory
);

// Update special needs (Admin, Main Teachers, Assistant Teachers)
router.put(
    '/student/special-needs/:studentId',
    authenticate,
    authorize('admin', 'main_teacher', 'assistant_teacher'),
    updateSpecialNeeds
);

// Get students with special needs
router.get(
    '/student/special-needs',
    authenticate,
    getSpecialNeedsStudents
);

// Bulk import students (Admin only)
router.post(
    '/student/bulk-import',
    authenticate,
    authorize('admin'),
    bulkImportStudents
);

// ============================================
// LIBRARY ROUTES
// ============================================

const {
    issueBook,
    returnBook,
    getStudentLibraryHistory,
    getCurrentBorrowedBooks,
    getOverdueBooks,
    payFine,
    getLibraryAnalytics
} = require('../controllers/library-controller');

// Issue book
router.post(
    '/library/issue',
    authenticate,
    authorize('admin', 'main_teacher', 'assistant_teacher'),
    issueBook
);

// Return book
router.put(
    '/library/return/:recordId',
    authenticate,
    authorize('admin', 'main_teacher', 'assistant_teacher'),
    returnBook
);

// Get student library history
router.get(
    '/library/student/:studentId',
    authenticate,
    getStudentLibraryHistory
);

// Get currently borrowed books
router.get(
    '/library/borrowed',
    authenticate,
    getCurrentBorrowedBooks
);

// Get overdue books
router.get(
    '/library/overdue',
    authenticate,
    getOverdueBooks
);

// Pay fine
router.put(
    '/library/pay-fine/:recordId',
    authenticate,
    authorize('admin', 'main_teacher'),
    payFine
);

// Library analytics
router.get(
    '/library/analytics',
    authenticate,
    authorize('admin', 'main_teacher'),
    getLibraryAnalytics
);

// ============================================
// CLINIC ROUTES
// ============================================

const {
    recordClinicVisit,
    getStudentClinicHistory,
    getAllClinicVisits,
    getPendingLeaveRequests,
    processLeaveRequest,
    updateFollowUp,
    getClinicAnalytics,
    generateCaseReport
} = require('../controllers/clinic-controller');

// Record clinic visit
router.post(
    '/clinic/visit',
    authenticate,
    authorize('admin', 'main_teacher', 'assistant_teacher'),
    recordClinicVisit
);

// Get student clinic history
router.get(
    '/clinic/student/:studentId',
    authenticate,
    getStudentClinicHistory
);

// Get all clinic visits
router.get(
    '/clinic/visits',
    authenticate,
    getAllClinicVisits
);

// Get pending leave requests (Admin only)
router.get(
    '/clinic/leave-requests',
    authenticate,
    authorize('admin'),
    getPendingLeaveRequests
);

// Approve/Reject leave request (Admin only)
router.put(
    '/clinic/leave-request/:recordId',
    authenticate,
    authorize('admin'),
    processLeaveRequest
);

// Update follow-up
router.put(
    '/clinic/follow-up/:recordId',
    authenticate,
    authorize('admin', 'main_teacher', 'assistant_teacher'),
    updateFollowUp
);

// Clinic analytics
router.get(
    '/clinic/analytics',
    authenticate,
    authorize('admin', 'main_teacher'),
    getClinicAnalytics
);

// Generate case report
router.get(
    '/clinic/case-report/:recordId',
    authenticate,
    authorize('admin'),
    generateCaseReport
);

// ============================================
// ENHANCED TRANSFER ROUTES
// ============================================

const {
    transferStudentWithData
} = require('../controllers/transfer-controller');

// Transfer student with data migration (Main Teachers & Admin only)
router.put(
    '/transfer/student/:studentId',
    authenticate,
    authorize('admin', 'main_teacher'),
    transferStudentWithData
);

module.exports = router;
