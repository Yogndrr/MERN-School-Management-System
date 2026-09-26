const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { issueAuthSession } = require('../utils/sessions.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const { clearLoginFailures, sendFailedLogin } = require('../utils/loginLockout');
const { sendValidationError } = require('../dto/validate');
const { studentLoginSchema, validateLoginBody } = require('../dto/loginDto');
const {
    studentRegisterDto,
    updateStudentDto,
    examResultDto,
    studentAttendanceDto,
    removeSubjectAttendanceDto,
} = require('../dto/studentDto');
const Subject = require('../models/subjectSchema.js');

const studentRegister = async (req, res) => {
    try {
        const data = sendValidationError(res, studentRegisterDto(req.body));
        if (!data) return;

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(data.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: data.rollNum,
            school: req.user.schoolId,
            sclassName: data.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                name: data.name,
                rollNum: data.rollNum,
                password: hashedPass,
                sclassName: data.sclassName,
                school: req.user.schoolId,
                role: 'Student'
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        const data = validateLoginBody(studentLoginSchema, req.body, res);
        if (!data) return;

        let student = await Student.findOne({ rollNum: data.rollNum, name: data.studentName });
        if (student) {
            const validated = await bcrypt.compare(data.password, student.password);
            if (validated) {
                clearLoginFailures(req.loginAccountKey);
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                await issueAuthSession(res, student);
                res.send({
                    user: {
                        _id: student._id,
                        name: student.name,
                        rollNum: student.rollNum,
                        sclassName: student.sclassName,
                        school: student.school,
                        role: 'Student'
                    }
                });
            } else {
                return sendFailedLogin(req, res);
            }
        } else {
            return sendFailedLogin(req, res);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "No student found" });
        }

        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");

        if (!student) {
            return res.status(404).json({ message: "No student found" });
        }

        // Context-Aware Attribute-Based Access Control (ABAC) Guard - CWE-639 / BOLA
        const authorized = await isAuthorizedForStudent(req, student, true);
        if (!authorized) {
            return res.status(404).json({ message: "No student found" });
        }

        student.password = undefined;
        res.send(student);
    } catch (err) {
        res.status(500).json(err);
    }
}

/**
 * Context-Aware ABAC Authorization Guard for Student Entities (CWE-639 / BOLA & Multi-Tenant Isolation)
 * @param {object} req - Express request object containing req.user
 * @param {object} student - Student Mongoose document
 * @param {boolean} allowSelf - Whether self-access is allowed (e.g., read own profile vs modify grades)
 * @returns {Promise<boolean>} True if authorized, false otherwise
 */
const isAuthorizedForStudent = async (req, student, allowSelf = false) => {
    if (!student || !req.user) return false;

    const requesterId = req.user.id || req.user._id?.toString();
    const requesterRole = req.user.role;
    const studentSchoolId = (student.school?._id || student.school)?.toString();

    // 1. Student self-access: student can only access their own record for read operations
    if (allowSelf && requesterRole === 'Student' && requesterId === student._id.toString()) {
        return true;
    }

    // 2. School Admin access: admin must belong to the exact same school tenant
    if (requesterRole === 'Admin' && req.user.schoolId === studentSchoolId) {
        return true;
    }

    // 3. Assigned Class Teacher access: teacher must teach the student's assigned class AND belong to the same school tenant
    if (requesterRole === 'Teacher') {
        const teacher = await Teacher.findById(requesterId);
        const teacherSchoolId = (teacher?.school?._id || teacher?.school)?.toString();
        const studentClassId = (student.sclassName?._id || student.sclassName)?.toString();

        if (
            teacher &&
            teacher.teachSclass &&
            teacherSchoolId &&
            teacherSchoolId === studentSchoolId &&
            teacher.teachSclass.toString() === studentClassId
        ) {
            return true;
        }
    }

    return false;
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "No student found" });
        }

        const authorized = await isAuthorizedForStudent(req, student, false);
        if (!authorized) {
            return res.status(404).json({ message: "No student found" });
        }

        const result = await Student.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateStudent = async (req, res) => {
    try {
        const data = sendValidationError(res, updateStudentDto(req.body));
        if (!data) return;

        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "No student found" });
        }

        const authorized = await isAuthorizedForStudent(req, student, false);
        if (!authorized) {
            return res.status(404).json({ message: "No student found" });
        }

        const update = {
            name: data.name,
            rollNum: data.rollNum,
        };
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(data.password, salt);
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: update },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const data = sendValidationError(res, examResultDto(req.body));
    if (!data) return;
    const { subName, marksObtained } = data;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'No student found' });
        }

        // BOLA / IDOR Guard on Exam Result Mutation (CWE-639)
        const authorized = await isAuthorizedForStudent(req, student, false);
        if (!authorized) {
            return res.status(404).json({ message: 'No student found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const data = sendValidationError(res, studentAttendanceDto(req.body));
    if (!data) return;
    const { subName, status, date } = data;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'No student found' });
        }

        // BOLA / IDOR Guard on Student Attendance Mutation (CWE-639)
        const authorized = await isAuthorizedForStudent(req, student, false);
        if (!authorized) {
            return res.status(404).json({ message: 'No student found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const data = sendValidationError(res, removeSubjectAttendanceDto(req.body));
    if (!data) return;
    const studentId = req.params.id;
    const subName = data.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
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
    removeStudentAttendance,
};