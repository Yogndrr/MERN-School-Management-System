const supabase = require('../supabase');

const transferStudentWithData = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { targetClassId, reason, migrateAttendance, migrateMarks, migrateLibrary, migrateClinic } = req.body;
        const adminId = req.user?.id || req.body.adminId;

        const { data: student, error: fetchError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();

        if (fetchError || !student) return res.status(404).json({ message: 'Student not found' });

        const fromClassId = student.sclass_id;

        const { error: historyError } = await supabase
            .from('student_transfers')
            .insert([{
                student_id: studentId,
                from_class_id: fromClassId,
                to_class_id: targetClassId,
                transferred_by: adminId,
                reason: reason
            }]);

        if (historyError) return res.status(400).json(historyError);

        const { error: updateError } = await supabase
            .from('students')
            .update({ sclass_id: targetClassId })
            .eq('id', studentId);

        if (updateError) return res.status(400).json(updateError);

        if (migrateAttendance) await supabase.from('student_attendance').update({ sclass_id: targetClassId }).eq('student_id', studentId);
        if (migrateMarks) await supabase.from('marksheets').update({ sclass_id: targetClassId }).eq('student_id', studentId);
        if (migrateLibrary) await supabase.from('library_transactions').update({ sclass_id: targetClassId }).eq('student_id', studentId);
        if (migrateClinic) await supabase.from('clinic_visits').update({ sclass_id: targetClassId }).eq('student_id', studentId);

        res.json({ message: 'Student transferred successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error transferring student' });
    }
};

module.exports = { transferStudentWithData };
