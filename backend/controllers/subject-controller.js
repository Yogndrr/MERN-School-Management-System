const supabase = require('../supabase');

const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            sub_name: subject.subName,
            sub_code: subject.subCode,
            sessions: subject.sessions,
            sclass_id: req.body.sclassName,
            school_id: req.body.adminID
        }));

        const { data: existingSubject } = await supabase
            .from('subjects')
            .select('id')
            .eq('sub_code', subjects[0].sub_code)
            .eq('school_id', req.body.adminID)
            .single();

        if (existingSubject) return res.send({ message: 'Sorry this subcode must be unique as it already exists' });

        const { data, error } = await supabase
            .from('subjects')
            .insert(subjects)
            .select();

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*, sclasses(sclass_name)')
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data.map(s => ({...s, sclassName: s.sclasses})) : { message: "No subjects found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('sclass_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data : { message: "No subjects found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('sclass_id', req.params.id)
            .is('teacher_id', null);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data : { message: "No subjects found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*, sclasses(sclass_name), teachers(name)')
            .eq('id', req.params.id)
            .single();

        if (error) return res.send({ message: "No subject found" });
        res.send({ ...data, sclassName: data.sclasses, teacher: data.teachers });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSubject = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
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

const deleteSubjects = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .delete()
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .delete()
            .eq('sclass_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects };
