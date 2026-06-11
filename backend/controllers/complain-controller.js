const supabase = require('../supabase');

const complainCreate = async (req, res) => {
    try {
        const { user, complaint, date, school } = req.body;
        const { data, error } = await supabase
            .from('complaints')
            .insert([{ student_id: user, complaint, date, school_id: school }])
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*, students(name)')
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data.map(c => ({...c, user: c.students})) : { message: "No complaints found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList };
