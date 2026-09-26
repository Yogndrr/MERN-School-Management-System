const jwt = require("jsonwebtoken");

const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

const cookieBase = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
});

const signAccess = (user, jti) =>
    jwt.sign(
        { sub: String(user._id), role: user.role, jti },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

const signRefresh = (user, jti) =>
    jwt.sign(
        { sub: String(user._id), role: user.role, jti },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

const setAuthCookies = (res, user, jti) => {
    res.cookie("accessToken", signAccess(user, jti), { ...cookieBase(), maxAge: ACCESS_MS });
    res.cookie("refreshToken", signRefresh(user, jti), { ...cookieBase(), maxAge: REFRESH_MS });
};

const clearAuthCookies = (res) => {
    const base = cookieBase();
    res.clearCookie("accessToken", base);
    res.clearCookie("refreshToken", base);
};

module.exports = { setAuthCookies, clearAuthCookies, REFRESH_MS };
