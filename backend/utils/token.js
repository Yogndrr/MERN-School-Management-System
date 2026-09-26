const jwt = require('jsonwebtoken');

const signToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        { sub: id.toString(), role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

module.exports = { signToken };
