const supabase = require('../supabase');

const noticeCreate = async (req, res) => {
    try {
        const { title, details, date, adminID } = req.body;
        const { data, error } = await supabase
            .from('notices')
            .insert([{ title, details, date, school_id: adminID }])
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data : { message: "No notices found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteNotice = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notices')
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

const deleteNotices = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notices')
            .delete()
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateNotice = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notices')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice };
