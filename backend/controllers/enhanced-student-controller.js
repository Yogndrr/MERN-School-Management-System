const supabase = require('../supabase');

const registerStudentEnhanced = async (req, res) => {
    const { studentRegister } = require('./student_controller');
    return studentRegister(req, res);
};

const getStudentProfile = async (req, res) => {
    const { getStudentDetail } = require('./student_controller');
    return getStudentDetail(req, res);
};

const updateSpecialNeeds = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { hasSpecialNeeds, category, notes, accommodations } = req.body;

        const { data, error } = await supabase
            .from('students')
            .update({
                has_special_needs: hasSpecialNeeds,
                special_needs_category: category,
                special_needs_notes: notes
            })
            .eq('id', studentId)
            .select()
            .single();

        if (error) return res.status(400).json(error);

        if (accommodations) {
            await supabase.from('student_accommodations').delete().eq('student_id', studentId);
            const accRecords = accommodations.map(acc => ({ student_id: studentId, accommodation: acc }));
            await supabase.from('student_accommodations').insert(accRecords);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error updating special needs' });
    }
};

const getSpecialNeedsStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*, sclasses(sclass_name)')
            .eq('has_special_needs', true);

        if (error) return res.status(400).json(error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching special needs students' });
    }
};

const transferStudent = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getTransferHistory = async (req, res) => res.status(501).json({ message: "Not implemented" });
const bulkImportStudents = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
    registerStudentEnhanced,
    getStudentProfile,
    updateSpecialNeeds,
    getSpecialNeedsStudents,
    transferStudent,
    getTransferHistory,
    bulkImportStudents
};
