const supabase = require('../supabase');

const registerUser = async (req, res) => {
    const { email, password, name, schoolName, role } = req.body;
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, role: role || 'admin' } }
        });
        if (authError) return res.status(400).json({ message: authError.message });

        // Create profile if schoolId is provided in body (for non-admins)
        if (req.body.schoolId) {
            await supabase.from('profiles').insert([{
                id: authData.user.id,
                role: role || 'admin',
                school_id: req.body.schoolId,
                full_name: name
            }]);
        }

        res.status(201).json(authData.user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ message: error.message });

        const { data: profile } = await supabase
            .from('profiles')
            .select('*, schools(*)')
            .eq('id', data.user.id)
            .single();

        res.status(200).json({
            ...data.user,
            token: data.session.access_token,
            role: profile?.role,
            school: profile?.schools,
            schoolId: profile?.school_id,
            _id: data.user.id
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const adminLogin = async (req, res) => loginUser(req, res);

const getCurrentUser = async (req, res) => res.status(200).json(req.user);

const logout = async (req, res) => {
    await supabase.auth.signOut();
    res.status(200).json({ message: 'Logged out' });
};

const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json({ message: 'Password updated' });
};

module.exports = { registerUser, loginUser, adminLogin, getCurrentUser, logout, changePassword };
