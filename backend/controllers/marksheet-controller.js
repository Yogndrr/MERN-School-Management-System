const supabase = require('../supabase');

const upsertMarksheet = async (req, res) => {
    try {
        const { studentId, subjectId, term, marks, totalMarks, maxMarks, percentage, grade, classId } = req.body;
        const schoolId = req.user?.school_id || req.body.schoolId;

        const { data, error } = await supabase
            .from('marksheets')
            .upsert({
                student_id: studentId,
                subject_id: subjectId,
                term,
                marks_json: marks,
                total_marks: totalMarks,
                max_marks: maxMarks,
                percentage,
                grade,
                sclass_id: classId,
                school_id: schoolId,
                updated_at: new Date()
            }, { onConflict: 'student_id, subject_id, term' })
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error saving marksheet' });
    }
};

const getStudentMarksheet = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('marksheets')
            .select('*, subjects(sub_name)')
            .eq('student_id', req.params.studentId);

        if (error) return res.status(400).json(error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching marksheet' });
    }
};

const getMarksheetsByClassAndTerm = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getAcademicAnalytics = async (req, res) => res.status(501).json({ message: "Not implemented" });
const deleteMarksheet = async (req, res) => res.status(501).json({ message: "Not implemented" });
const bulkImportMarksheets = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
    upsertMarksheet,
    getStudentMarksheet,
    getMarksheetsByClassAndTerm,
    getAcademicAnalytics,
    deleteMarksheet,
    bulkImportMarksheets
};
