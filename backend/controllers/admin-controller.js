const supabase = require('../supabase');

const adminRegister = async (req, res) => {
    const { email, password, name, schoolName } = req.body;
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, role: 'Admin' } }
        });

        if (authError) return res.send({ message: authError.message });

        const userId = authData.user.id;

        const { error: schoolError } = await supabase
            .from('schools')
            .insert([{ id: userId, name, school_name: schoolName, email }]);

        if (schoolError) return res.send({ message: schoolError.message });

        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: userId, role: 'admin', school_id: userId, full_name: name }]);

        if (profileError) return res.send({ message: profileError.message });

        res.send({ id: userId, email, name, schoolName, role: 'Admin' });
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.send({ message: error.message });

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, schools(*)')
            .eq('id', data.user.id)
            .single();

        if (profileError) return res.send({ message: profileError.message });

        res.send({
            _id: profile.id,
            id: profile.id,
            name: profile.full_name,
            email: data.user.email,
            role: 'Admin',
            schoolName: profile.schools?.school_name,
            school: profile.schools
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAdminDetail = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, schools(*)')
            .eq('id', req.params.id)
            .single();

        if (error) return res.send({ message: error.message });
        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };
