const supabase = require('../supabase');

const recordClinicVisit = async (req, res) => {
    try {
        const { studentId, visitDate, visitTime, incidentType, chiefComplaint, diagnosis, outcome, schoolId, classId } = req.body;

        const { data, error } = await supabase
            .from('clinic_visits')
            .insert([{
                student_id: studentId,
                visit_date: visitDate,
                visit_time: visitTime,
                incident_type: incidentType,
                chief_complaint: chiefComplaint,
                diagnosis: diagnosis,
                outcome: outcome,
                school_id: schoolId,
                sclass_id: classId,
                attended_by: req.user?.id
            }])
            .select()
            .single();

        if (error) return res.status(400).json(error);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error recording clinic visit' });
    }
};

const getStudentClinicHistory = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clinic_visits')
            .select('*')
            .eq('student_id', req.params.studentId)
            .order('visit_date', { ascending: false });

        if (error) return res.status(400).json(error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clinic history' });
    }
};

const getAllClinicVisits = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getPendingLeaveRequests = async (req, res) => res.status(501).json({ message: "Not implemented" });
const processLeaveRequest = async (req, res) => res.status(501).json({ message: "Not implemented" });
const updateFollowUp = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getClinicAnalytics = async (req, res) => res.status(501).json({ message: "Not implemented" });
const generateCaseReport = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
    recordClinicVisit,
    getStudentClinicHistory,
    getAllClinicVisits,
    getPendingLeaveRequests,
    processLeaveRequest,
    updateFollowUp,
    getClinicAnalytics,
    generateCaseReport
};
