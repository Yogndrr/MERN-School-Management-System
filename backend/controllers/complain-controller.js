const Complain = require('../models/complainSchema.js');
const { complainCreateDto } = require('../dto/complainDto');
const { sendValidationError } = require('../dto/validate');
const {
    sanitizeRichText,
    applySanitizationHeaders,
    sanitizationReport,
    toPlainObject,
} = require('../utils/sanitize');

const buildComplainResponse = (complain, complaintResult) => {
    const payload = toPlainObject(complain);
    payload.complaint = complaintResult.value;
    payload.security = sanitizationReport([complaintResult]);
    return payload;
};

const complainCreate = async (req, res) => {
    try {
        const data = sendValidationError(res, complainCreateDto(req.body));
        if (!data) return;

        const complaintResult = sanitizeRichText(data.complaint, 'complaint');
        if (!complaintResult.value) {
            return res.status(400).json({
                message: 'Complaint is empty after removing unsafe HTML',
            });
        }

        applySanitizationHeaders(res, [complaintResult]);

        const complain = new Complain({
            date: data.date,
            complaint: complaintResult.value,
            user: req.user.id,
            school: req.user.schoolId,
        });
        const result = await complain.save();
        res.send(buildComplainResponse(result, complaintResult));
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await Complain.find({ school: req.params.id }).populate("user", "name");
        if (complains.length > 0) {
            const results = [];
            const payload = complains.map((complain) => {
                const complaintResult = sanitizeRichText(complain.complaint, 'complaint');
                results.push(complaintResult);
                return buildComplainResponse(complain, complaintResult);
            });
            applySanitizationHeaders(res, results);
            res.send(payload);
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList };
