const supabase = require('../supabase');

const markAttendance = async (req, res) => {
    try {
        const { attendanceRecords, date, classId, subjectId } = req.body;
        const schoolId = req.body.schoolId || req.user?.school_id;

        const records = attendanceRecords.map(record => ({
            student_id: record.studentId,
            date: date,
            status: record.status === 'P' || record.status === 'Present' ? 'Present' : 'Absent',
            subject_id: subjectId,
            school_id: schoolId
        }));

        const { data, error } = await supabase
            .from('student_attendance')
            .upsert(records, { onConflict: 'student_id, date, subject_id' })
            .select();

        if (error) return res.status(400).json(error);
        res.status(201).json({ message: 'Attendance marked successfully', count: data.length });
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance' });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('student_attendance')
            .select('*, subjects(sub_name)')
            .eq('student_id', req.params.studentId);

        if (error) return res.status(400).json(error);
        res.json({ attendance: data });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance' });
    }
};

const getAttendanceByClassAndDate = async (req, res) => {
    try {
        const { classId, date, subjectId } = req.query;
        let query = supabase
            .from('student_attendance')
            .select('*, students!inner(name, roll_num)')
            .eq('date', date)
            .eq('students.sclass_id', classId);

        if (subjectId) query = query.eq('subject_id', subjectId);

        const { data, error } = await query;
        if (error) return res.status(400).json(error);
        res.json({ attendance: data });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance' });
    }
};

const getAttendanceAnalytics = async (req, res) => res.status(501).json({ message: "Not implemented" });
const deleteAttendance = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
    markAttendance,
    getStudentAttendance,
    getAttendanceByClassAndDate,
    getAttendanceAnalytics,
    deleteAttendance
};
