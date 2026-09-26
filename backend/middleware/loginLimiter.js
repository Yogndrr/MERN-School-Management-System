const rateLimit = require('express-rate-limit');
const {
    accountKey,
    inspectLockout,
    sendLockoutResponse,
} = require('../utils/loginLockout');

const IP_WINDOW_MS = (Number(process.env.LOGIN_IP_WINDOW_MINUTES) || 15) * 60 * 1000;
const IP_MAX = Number(process.env.LOGIN_IP_MAX) || 15;

const loginIpLimiter = rateLimit({
    windowMs: IP_WINDOW_MS,
    max: IP_MAX,
    standardHeaders: true,
    legacyHeaders: true,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        const retryAfterSeconds = Math.ceil(IP_WINDOW_MS / 1000);
        console.warn(`[AUTH] IP rate limit exceeded for ${req.ip}`);
        res.set('Retry-After', String(retryAfterSeconds));
        res.status(429).json({
            message: 'Too many login attempts from this IP. Please try again later.',
            code: 'IP_RATE_LIMIT',
            retryAfterSeconds,
        });
    },
});

const checkAccountLockout = (role) => (req, res, next) => {
    const key = accountKey(role, req.body);
    req.loginAccountKey = key;

    const lockout = inspectLockout(key);
    if (lockout.locked) {
        console.warn(`[AUTH] Blocked locked account ${key}`);
        return sendLockoutResponse(res, lockout);
    }

    return next();
};

module.exports = {
    loginIpLimiter,
    checkAccountLockout,
};
