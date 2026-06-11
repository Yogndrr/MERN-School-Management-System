const supabase = require('../supabase');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'Authentication required' });

        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return res.status(401).json({ message: 'Invalid authentication' });

        // Fetch profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        req.user = { ...user, ...profile, school: profile?.school_id }; // Map school_id to school for compatibility
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Authentication required' });

        // Normalize role for comparison
        const userRole = req.user.role?.toLowerCase();
        const allowedRoles = roles.map(r => r.toLowerCase());

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: `Forbidden: Required ${roles.join(', ')}` });
        }
        next();
    };
};

const checkPermission = (permission) => {
    return (req, res, next) => {
        next(); // Stub
    };
};

module.exports = { authenticate, authorize, checkPermission };
