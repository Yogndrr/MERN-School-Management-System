const supabase = require('../supabase');

const sclassCreate = async (req, res) => {
    try {
        const { data: existingSclass } = await supabase
            .from('sclasses')
            .select('id')
            .eq('sclass_name', req.body.sclassName)
            .eq('school_id', req.body.adminID)
            .single();

        if (existingSclass) return res.send({ message: 'Sorry this class name already exists' });

        const { data, error } = await supabase
            .from('sclasses')
            .insert([{ sclass_name: req.body.sclassName, school_id: req.body.adminID }])
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const sclassList = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sclasses')
            .select('*')
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data : { message: "No sclasses found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSclassDetail = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sclasses')
            .select('*, schools(school_name)')
            .eq('id', req.params.id)
            .single();

        if (error) return res.send({ message: "No class found" });
        res.send({ ...data, school: data.schools });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSclassStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('sclass_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data : { message: "No students found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSclass = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sclasses')
            .delete()
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSclasses = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sclasses')
            .delete()
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };
