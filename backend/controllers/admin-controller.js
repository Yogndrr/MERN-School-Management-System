const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const { issueAuthSession } = require('../utils/sessions.js');
const { clearLoginFailures, sendFailedLogin } = require('../utils/loginLockout');
const { adminRegisterDto } = require('../dto/adminDto');
const { adminLoginSchema, validateLoginBody } = require('../dto/loginDto');
const { sendValidationError } = require('../dto/validate');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');

// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$/.test(value);

const adminRegister = async (req, res) => {
    try {
        const data = sendValidationError(res, adminRegisterDto(req.body));
        if (!data) return;

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(data.password, salt);

        const admin = new Admin({
            name: data.name,
            email: data.email,
            password,
            schoolName: data.schoolName,
            role: 'Admin'
        });

        const existingAdminByEmail = await Admin.findOne({ email: data.email });
        const existingSchool = await Admin.findOne({ schoolName: data.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await admin.save();
            await issueAuthSession(res, result);
            res.send({
                user: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    schoolName: result.schoolName,
                    role: 'Admin'
                }
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    try {
        const data = validateLoginBody(adminLoginSchema, req.body, res);
        if (!data) return;

        let admin = await Admin.findOne({ email: data.email });
        if (admin) {
            let validated = false;
            if (isBcryptHash(admin.password)) {
                validated = await bcrypt.compare(data.password, admin.password);
            } else if (data.password === admin.password) {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(data.password, salt);
                await admin.save();
                validated = true;
            }

            if (validated) {
                clearLoginFailures(req.loginAccountKey);
                await issueAuthSession(res, admin);
                res.send({
                    user: {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        schoolName: admin.schoolName,
                        role: 'Admin'
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

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
