const authorize = (...allowedRoles) => {
    const roles = allowedRoles.flat();

    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        return next();
    };
};

module.exports = authorize;
