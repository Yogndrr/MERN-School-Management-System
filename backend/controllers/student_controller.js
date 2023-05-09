const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const student = new Student({
            ...req.body,
            school: req.body.adminID,
            password: hashedPass
        });

        const existingStudentByRollNum = await Student.findOne({ rollNum: req.body.rollNum });

        if (existingStudentByRollNum) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
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
        let student = await Student.findOne({ rollNum: req.body.rollNum });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student.password = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
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
        let student = await Student.findById(req.params.id);
        if (student) {
            student.password = undefined;
            student = await student.populate("school", "schoolName")
            student = await student.populate("sclassName", "sclassName subjects")
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
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
        res.status(500).json(err);
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
        res.status(500).json(err);
    }
}

// const updateStudent = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         const result = await Student.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const { name, rollNum, password, className, attendanceFields } = req.body;
        const { currentDate, attendanceRadio } = attendanceFields;

        const attendanceInfo = {
            date: currentDate,
            attenStatus: attendanceRadio
        };

        const result = await Student.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name,
                    rollNum,
                    password,
                    className,
                    attendance: attendanceInfo
                }
            },
            { new: true }
        );

        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    try {
        const studentId = req.params.id;

        let student = await Student.findById(studentId);

        let updateObj;
        if (student.attendance) {
            updateObj = {
                $set: {
                    "attendance.date": req.body.date,
                    "attendance.attenStatus": req.body.attenStatus
                }
            };
        } else {
            updateObj = {
                $set: {
                    attendance: {
                        date: req.body.date,
                        attenStatus: req.body.attenStatus
                    }
                }
            };
        }
        const result = await Student.findByIdAndUpdate(studentId, updateObj, { new: true });

        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass
};