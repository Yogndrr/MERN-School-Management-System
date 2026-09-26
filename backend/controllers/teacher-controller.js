const bcrypt = require('bcrypt');
const { issueAuthSession } = require('../utils/sessions.js');
const Teacher = require('../models/teacherSchema.js');
const { clearLoginFailures, sendFailedLogin } = require('../utils/loginLockout');
const { sendValidationError } = require('../dto/validate');
const { teacherLoginSchema, validateLoginBody } = require('../dto/loginDto');
const {
    teacherRegisterDto,
    assignTeacherSubjectDto,
    teacherAttendanceDto,
} = require('../dto/teacherDto');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const data = sendValidationError(res, teacherRegisterDto(req.body));
    if (!data) return;
    const { name, email, password, teachSubject, teachSclass } = data;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({
            name,
            email,
            password: hashedPass,
            role: 'Teacher',
            school: req.user.schoolId,
            teachSubject,
            teachSclass
        });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await teacher.save();
            await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        const data = validateLoginBody(teacherLoginSchema, req.body, res);
        if (!data) return;

        let teacher = await Teacher.findOne({ email: data.email });
        if (teacher) {
            const validated = await bcrypt.compare(data.password, teacher.password);
            if (validated) {
                clearLoginFailures(req.loginAccountKey);
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                await issueAuthSession(res, teacher);
                res.send({
                    user: {
                        _id: teacher._id,
                        name: teacher.name,
                        email: teacher.email,
                        school: teacher.school,
                        teachSubject: teacher.teachSubject,
                        teachSclass: teacher.teachSclass,
                        role: 'Teacher'
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

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const data = sendValidationError(res, assignTeacherSubjectDto(req.body));
    if (!data) return;
    const { teacherId, teachSubject } = data;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const data = sendValidationError(res, teacherAttendanceDto(req.body));
    if (!data) return;
    const { date, presentCount, absentCount } = data;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            if (presentCount !== undefined) existingAttendance.presentCount = presentCount;
            if (absentCount !== undefined) existingAttendance.absentCount = absentCount;
        } else {
            const entry = { date };
            if (presentCount !== undefined) entry.presentCount = presentCount;
            if (absentCount !== undefined) entry.absentCount = absentCount;
            teacher.attendance.push(entry);
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};