const supabase = require('../supabase');

const teacherRegister = async (req, res) => {
    try {
        const { name, email, password, role, school, teachSubject, teachSclass, teacherType, teacherId } = req.body;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, role: 'Teacher' } }
        });

        if (authError) return res.send({ message: authError.message });

        const userId = authData.user.id;

        const { data: teacher, error: teacherError } = await supabase
            .from('teachers')
            .insert([{
                id: userId,
                name,
                email,
                teacher_id_str: teacherId,
                role: role || 'Teacher',
                school_id: school,
                teacher_type: teacherType || 'main_teacher',
                homeroom_class_id: teacherType === 'main_teacher' ? teachSclass : null,
                primary_subject_id: teacherType === 'subject_teacher' ? teachSubject : null
            }])
            .select()
            .single();

        if (teacherError) return res.send({ message: teacherError.message });

        await supabase.from('profiles').insert([{
            id: userId,
            role: 'teacher',
            school_id: school,
            related_id: userId,
            full_name: name
        }]);

        if (teachSubject) {
            await supabase.from('subjects').update({ teacher_id: userId }).eq('id', teachSubject);
        }

        res.send(teacher);
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.send({ message: error.message });

        const { data: teacher, error: teacherError } = await supabase
            .from('teachers')
            .select('*, schools(school_name), sclasses(sclass_name), subjects(sub_name)')
            .eq('id', data.user.id)
            .single();

        if (teacherError) return res.send({ message: "Teacher not found" });

        res.send({
            ...teacher,
            _id: teacher.id,
            school: teacher.schools,
            teachSclass: teacher.sclasses,
            teachSubject: teacher.subjects
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teachers')
            .select('*, subjects(sub_name), sclasses(sclass_name)')
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data.map(t => ({...t, teachSubject: t.subjects, teachSclass: t.sclasses})) : { message: "No teachers found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teachers')
            .select('*, subjects(sub_name), sclasses(sclass_name)');
        
        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data.map(t => ({...t, teachSubject: t.subjects, teachSclass: t.sclasses})) : { message: "No teachers found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teachers')
            .select('*, schools(school_name), sclasses(sclass_name), subjects(sub_name)')
            .eq('id', req.params.id)
            .single();

        if (error) return res.send({ message: "No teacher found" });
        res.send({ ...data, school: data.schools, teachSclass: data.sclasses, teachSubject: data.subjects });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teachers')
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

const updateTeacher = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teachers')
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

// Stubs for complex mappings
const updateTeacherSubject = async (req, res) => res.status(501).json({ message: "Not implemented" });
const deleteTeachers = async (req, res) => res.status(501).json({ message: "Not implemented" });
const deleteTeachersByClass = async (req, res) => res.status(501).json({ message: "Not implemented" });
const teacherAttendance = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getAllTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    updateTeacher,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};
