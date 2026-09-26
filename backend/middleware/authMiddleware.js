const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const { getActiveSession } = require('../utils/sessions');

const modelsByRole = {
    Admin,
    Student,
    Teacher,
};

const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    const bearer = header && header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    const token = (req.cookies && req.cookies.accessToken) || bearer;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const Model = modelsByRole[payload.role];
    if (!Model || !payload.sub || !payload.jti) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
        const session = await getActiveSession(payload.jti);
        if (!session || session.userId.toString() !== payload.sub || session.role !== payload.role) {
            return res.status(401).json({ message: 'Session revoked' });
        }

        const account = await Model.findById(payload.sub);
        if (!account) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = {
            id: account._id.toString(),
            role: payload.role,
            schoolId: payload.role === 'Admin'
                ? account._id.toString()
                : account.school?.toString(),
        };

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
