const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const { loginIpLimiter, checkAccountLockout } = require('../middleware/loginLimiter');

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');
const { me, refresh, logout } = require('../controllers/auth-controller.js');
const { startGoogle, googleCallback } = require('../controllers/google-auth-controller.js');

// Public auth
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', loginIpLimiter, checkAccountLockout('Admin'), adminLogIn);
router.post('/StudentLogin', loginIpLimiter, checkAccountLockout('Student'), studentLogIn);
router.post('/TeacherLogin', loginIpLimiter, checkAccountLockout('Teacher'), teacherLogIn);
router.get('/auth/google', startGoogle);
router.get('/auth/google/callback', googleCallback);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);
router.get('/auth/me', authenticate, me);

router.get("/Admin/:id", authenticate, authorize('Admin'), getAdminDetail)
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Student

router.post('/StudentReg', authenticate, authorize('Admin'), studentRegister);

router.get("/Students/:id", authenticate, authorize('Admin'), getStudents)
router.get("/Student/:id", authenticate, authorize('Admin', 'Teacher', 'Student'), getStudentDetail)

router.delete("/Students/:id", authenticate, authorize('Admin'), deleteStudents)
router.delete("/StudentsClass/:id", authenticate, authorize('Admin'), deleteStudentsByClass)
router.delete("/Student/:id", authenticate, authorize('Admin'), deleteStudent)

router.put("/Student/:id", authenticate, authorize('Admin'), updateStudent)

router.put('/UpdateExamResult/:id', authenticate, authorize('Admin', 'Teacher'), updateExamResult)

router.put('/StudentAttendance/:id', authenticate, authorize('Admin', 'Teacher'), studentAttendance)

router.put('/RemoveAllStudentsSubAtten/:id', authenticate, authorize('Admin'), clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', authenticate, authorize('Admin'), clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', authenticate, authorize('Admin'), removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', authenticate, authorize('Admin'), removeStudentAttendance)

// Teacher

router.post('/TeacherReg', authenticate, authorize('Admin'), teacherRegister);

router.get("/Teachers/:id", authenticate, authorize('Admin'), getTeachers)
router.get("/Teacher/:id", authenticate, authorize('Admin'), getTeacherDetail)

router.delete("/Teachers/:id", authenticate, authorize('Admin'), deleteTeachers)
router.delete("/TeachersClass/:id", authenticate, authorize('Admin'), deleteTeachersByClass)
router.delete("/Teacher/:id", authenticate, authorize('Admin'), deleteTeacher)

router.put("/TeacherSubject", authenticate, authorize('Admin'), updateTeacherSubject)

router.post('/TeacherAttendance/:id', authenticate, authorize('Admin'), teacherAttendance)

// Notice

router.post('/NoticeCreate', authenticate, authorize('Admin'), noticeCreate);

router.get('/NoticeList/:id', authenticate, authorize('Admin', 'Teacher', 'Student'), noticeList);

router.delete("/Notices/:id", authenticate, authorize('Admin'), deleteNotices)
router.delete("/Notice/:id", authenticate, authorize('Admin'), deleteNotice)

router.put("/Notice/:id", authenticate, authorize('Admin'), updateNotice)

// Complain

router.post('/ComplainCreate', authenticate, authorize('Student'), complainCreate);

router.get('/ComplainList/:id', authenticate, authorize('Admin'), complainList);

// Sclass

router.post('/SclassCreate', authenticate, authorize('Admin'), sclassCreate);

router.get('/SclassList/:id', authenticate, authorize('Admin'), sclassList);
router.get("/Sclass/:id", authenticate, authorize('Admin'), getSclassDetail)

router.get("/Sclass/Students/:id", authenticate, authorize('Admin', 'Teacher'), getSclassStudents)

router.delete("/Sclasses/:id", authenticate, authorize('Admin'), deleteSclasses)
router.delete("/Sclass/:id", authenticate, authorize('Admin'), deleteSclass)

// Subject

router.post('/SubjectCreate', authenticate, authorize('Admin'), subjectCreate);

router.get('/AllSubjects/:id', authenticate, authorize('Admin'), allSubjects);
router.get('/ClassSubjects/:id', authenticate, authorize('Admin', 'Teacher', 'Student'), classSubjects);
router.get('/FreeSubjectList/:id', authenticate, authorize('Admin'), freeSubjectList);
router.get("/Subject/:id", authenticate, authorize('Admin', 'Teacher'), getSubjectDetail)

router.delete("/Subject/:id", authenticate, authorize('Admin'), deleteSubject)
router.delete("/Subjects/:id", authenticate, authorize('Admin'), deleteSubjects)
router.delete("/SubjectsClass/:id", authenticate, authorize('Admin'), deleteSubjectsByClass)

module.exports = router;