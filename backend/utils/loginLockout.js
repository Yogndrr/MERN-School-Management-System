const MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS) || 5;
const LOCKOUT_MS = (Number(process.env.LOGIN_LOCKOUT_MINUTES) || 5) * 60 * 1000;

const attempts = new Map();

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const accountKey = (role, body = {}) => {
    if (role === 'Student') {
        const rollNum = normalize(body.rollNum);
        const studentName = normalize(body.studentName);
        if (!rollNum || !studentName) return null;
        return `Student:${rollNum}:${studentName}`;
    }

    const email = normalize(body.email);
    if (!email) return null;
    return `${role}:${email}`;
};

const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes <= 0) {
        return `${seconds} second(s)`;
    }
    return `${minutes} minute(s) ${seconds} second(s)`;
};

const getState = (key) => {
    const current = attempts.get(key) || { count: 0, lockUntil: 0 };
    if (current.lockUntil && Date.now() >= current.lockUntil) {
        attempts.delete(key);
        return { count: 0, lockUntil: 0 };
    }
    return current;
};

const inspectLockout = (key) => {
    if (!key) {
        return { locked: false, remaining: MAX_ATTEMPTS };
    }

    const state = getState(key);
    if (state.lockUntil && Date.now() < state.lockUntil) {
        const retryAfterSeconds = Math.max(1, Math.ceil((state.lockUntil - Date.now()) / 1000));
        return {
            locked: true,
            retryAfterSeconds,
            lockUntil: new Date(state.lockUntil).toISOString(),
            remaining: 0,
        };
    }

    return {
        locked: false,
        remaining: Math.max(0, MAX_ATTEMPTS - state.count),
        retryAfterSeconds: 0,
    };
};

const recordFailedLogin = (key) => {
    if (!key) {
        return inspectLockout(key);
    }

    const state = getState(key);
    state.count += 1;

    if (state.count >= MAX_ATTEMPTS) {
        state.lockUntil = Date.now() + LOCKOUT_MS;
        attempts.set(key, state);
        console.warn(`[AUTH] Account locked for ${key} until ${new Date(state.lockUntil).toISOString()}`);
        return inspectLockout(key);
    }

    attempts.set(key, state);
    const remaining = MAX_ATTEMPTS - state.count;
    console.warn(`[AUTH] Failed login for ${key} (${state.count}/${MAX_ATTEMPTS}), ${remaining} remaining`);
    return {
        locked: false,
        remaining,
        retryAfterSeconds: 0,
    };
};

const clearLoginFailures = (key) => {
    if (key && attempts.has(key)) {
        attempts.delete(key);
        console.log(`[AUTH] Lockout reset after successful login for ${key}`);
    }
};

const sendLockoutResponse = (res, lockout) => {
    res.set('Retry-After', String(lockout.retryAfterSeconds));
    return res.status(429).json({
        message: `Too many failed login attempts. Account locked. Try again in ${formatDuration(lockout.retryAfterSeconds)}.`,
        code: 'ACCOUNT_LOCKED',
        retryAfterSeconds: lockout.retryAfterSeconds,
        lockUntil: lockout.lockUntil,
        maxAttempts: MAX_ATTEMPTS,
    });
};

const sendFailedLogin = (req, res) => {
    const key = req.loginAccountKey;
    const result = recordFailedLogin(key);

    if (result.locked) {
        return sendLockoutResponse(res, result);
    }

    return res.status(401).json({
        message: `Invalid credentials. ${result.remaining} attempt(s) remaining before lockout.`,
        code: 'INVALID_CREDENTIALS',
        attemptsRemaining: result.remaining,
        maxAttempts: MAX_ATTEMPTS,
    });
};

module.exports = {
    MAX_ATTEMPTS,
    LOCKOUT_MS,
    accountKey,
    inspectLockout,
    recordFailedLogin,
    clearLoginFailures,
    sendFailedLogin,
    sendLockoutResponse,
    formatDuration,
};
