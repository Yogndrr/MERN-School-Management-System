const supabase = require('../supabase');

const studentRegister = async (req, res) => {
    try {
        const { email, password, name, rollNum, adminID, sclassName, studentId } = req.body;
        
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email || `student${rollNum}_${adminID}@bisnoc.com`,
            password: password,
            options: { data: { full_name: name, role: 'Student' } }
        });

        if (authError) return res.send({ message: authError.message });

        const userId = authData.user.id;

        // 2. Create Student record
        const { data, error: studentError } = await supabase
            .from('students')
            .insert([{
                id: userId,
                student_id_str: studentId,
                name: name,
                roll_num: rollNum,
                email: email,
                sclass_id: sclassName,
                school_id: adminID,
                role: 'Student',
                active: true
            }])
            .select()
            .single();

        if (studentError) return res.send({ message: studentError.message });

        // 3. Create Profile
        await supabase.from('profiles').insert([{
            id: userId,
            role: 'student',
            school_id: adminID,
            related_id: userId,
            full_name: name
        }]);

        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        const { email, password, studentId, rollNum, studentName } = req.body;
        
        let loginEmail = email;
        if (!loginEmail) {
             // Fallback for legacy login modes if needed, but Supabase Auth needs email
             // For now, assume email is provided or derived
             return res.send({ message: "Email and password are required for Supabase Auth" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (error) return res.send({ message: error.message });

        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*, schools(school_name), sclasses(sclass_name)')
            .eq('id', data.user.id)
            .single();

        if (studentError) return res.send({ message: "Student record not found" });

        res.send({
            ...student,
            _id: student.id,
            school: student.schools,
            sclassName: student.sclasses
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*, sclasses(sclass_name)');
        
        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data.map(s => ({...s, sclassName: s.sclasses})) : { message: "No students found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*, sclasses(sclass_name)')
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data.length > 0 ? data.map(s => ({...s, sclassName: s.sclasses})) : { message: "No students found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select(`
                *,
                schools(school_name),
                sclasses(sclass_name)
            `)
            .eq('id', req.params.id)
            .single();

        if (error) return res.send({ message: "No student found" });
        res.send({ ...data, school: data.schools, sclassName: data.sclasses });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
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

const deleteStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .delete()
            .eq('school_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteStudentsByClass = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .delete()
            .eq('sclass_id', req.params.id);

        if (error) return res.status(400).json(error);
        res.send(data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateStudent = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
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

// Simplified attendance/marksheet methods to be handled by specific controllers
const updateExamResult = async (req, res) => res.status(501).json({ message: "Use Marksheet Controller" });
const studentAttendance = async (req, res) => res.status(501).json({ message: "Use Attendance Controller" });
const clearAllStudentsAttendanceBySubject = async (req, res) => res.status(501).json({ message: "Use Attendance Controller" });
const clearAllStudentsAttendance = async (req, res) => res.status(501).json({ message: "Use Attendance Controller" });
const removeStudentAttendanceBySubject = async (req, res) => res.status(501).json({ message: "Use Attendance Controller" });
const removeStudentAttendance = async (req, res) => res.status(501).json({ message: "Use Attendance Controller" });

module.exports = {
    studentRegister,
    studentLogIn,
    getAllStudents,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};
