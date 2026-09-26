const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const Admin = require("../models/adminSchema.js");
const Teacher = require("../models/teacherSchema.js");
const { issueAuthSession } = require("../utils/sessions.js");

const STATE_COOKIE = "google_oauth";
const STATE_MAX_AGE = 10 * 60 * 1000;

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/auth/google",
    maxAge: STATE_MAX_AGE,
});

const clientUrl = () => process.env.CLIENT_URL || "http://localhost:3000";

const googleClient = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback";
    if (!clientId || !clientSecret) return null;
    return new OAuth2Client(clientId, clientSecret, redirectUri);
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findAccountByEmail = async (email) => {
    const pattern = new RegExp(`^${escapeRegex(email)}$`, "i");
    const admin = await Admin.findOne({ email: pattern });
    if (admin) return admin;

    const teacher = await Teacher.findOne({ email: pattern });
    if (teacher) return teacher;

    return null;
};

const redirectWithError = (res, role, message) => {
    const loginPath = role === "Teacher" ? "/Teacherlogin" : "/Adminlogin";
    const url = new URL(loginPath, clientUrl());
    url.searchParams.set("oauthError", message);
    const { maxAge, ...clearOptions } = cookieOptions();
    res.clearCookie(STATE_COOKIE, clearOptions);
    return res.redirect(url.toString());
};

const startGoogle = (req, res) => {
    const client = googleClient();
    const role = req.query.role === "Teacher" ? "Teacher" : "Admin";
    if (!client) {
        return redirectWithError(res, role, "Google sign-in is not configured");
    }

    const state = crypto.randomBytes(16).toString("hex");
    const nonce = crypto.randomBytes(16).toString("hex");

    res.cookie(STATE_COOKIE, JSON.stringify({ state, nonce, role }), cookieOptions());

    const url = client.generateAuthUrl({
        access_type: "online",
        scope: ["openid", "email", "profile"],
        state,
        nonce,
        prompt: "select_account",
    });

    return res.redirect(url);
};

const googleCallback = async (req, res) => {
    const client = googleClient();
    let pending = null;
    try {
        pending = JSON.parse(req.cookies[STATE_COOKIE] || "");
    } catch (err) {
        pending = null;
    }

    const role = pending && pending.role === "Teacher" ? "Teacher" : "Admin";

    if (!client) {
        return redirectWithError(res, role, "Google sign-in is not configured");
    }
    if (!pending || !req.query.state || req.query.state !== pending.state) {
        return redirectWithError(res, role, "Google sign-in could not be verified. Try again.");
    }
    if (req.query.error) {
        return redirectWithError(res, role, "Google sign-in was cancelled");
    }
    if (!req.query.code) {
        return redirectWithError(res, role, "Google did not return a sign-in code");
    }

    try {
        const { tokens } = await client.getToken(req.query.code);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const issuerOk = payload.iss === "accounts.google.com" || payload.iss === "https://accounts.google.com";

        if (!issuerOk || payload.nonce !== pending.nonce || payload.email_verified !== true || !payload.email) {
            return redirectWithError(res, role, "Google identity could not be verified");
        }

        const account = await findAccountByEmail(payload.email);
        if (!account || (account.role !== "Admin" && account.role !== "Teacher")) {
            return redirectWithError(res, role, "No admin or teacher account uses this Google email. Register first, then sign in with the same email.");
        }

        await issueAuthSession(res, account);
        res.clearCookie(STATE_COOKIE, cookieOptions());
        return res.redirect(clientUrl());
    } catch (err) {
        return redirectWithError(res, role, "Google sign-in failed");
    }
};

module.exports = { startGoogle, googleCallback };
