const crypto = require("crypto");
const Session = require("../models/sessionSchema.js");
const { setAuthCookies, REFRESH_MS } = require("./authCookies.js");

const issueAuthSession = async (res, user) => {
    const jti = crypto.randomBytes(16).toString("hex");
    await Session.create({
        jti,
        userId: user._id,
        role: user.role,
        expiresAt: new Date(Date.now() + REFRESH_MS),
    });
    setAuthCookies(res, user, jti);
    return jti;
};

const getActiveSession = (jti) => {
    if (!jti) return null;
    return Session.findOne({
        jti,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
    });
};

const revokeSession = async (jti) => {
    if (!jti) return;
    await Session.updateOne(
        { jti, revokedAt: null },
        { revokedAt: new Date() }
    );
};

module.exports = { issueAuthSession, getActiveSession, revokeSession };
