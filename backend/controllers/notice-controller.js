const Notice = require('../models/noticeSchema.js');
const { noticeCreateDto, noticeUpdateDto } = require('../dto/noticeDto');
const { sendValidationError } = require('../dto/validate');
const {
    sanitizePlainText,
    sanitizeRichText,
    applySanitizationHeaders,
    sanitizationReport,
    toPlainObject,
} = require('../utils/sanitize');

const sanitizeNoticeContent = (title, details) => ([
    sanitizePlainText(title, 'title'),
    sanitizeRichText(details, 'details'),
]);

const buildNoticeResponse = (notice, titleResult, detailsResult) => {
    const payload = toPlainObject(notice);
    payload.title = titleResult.value;
    payload.details = detailsResult.value;
    payload.security = sanitizationReport([titleResult, detailsResult]);
    return payload;
};

const noticeCreate = async (req, res) => {
    try {
        const data = sendValidationError(res, noticeCreateDto(req.body));
        if (!data) return;

        const [titleResult, detailsResult] = sanitizeNoticeContent(data.title, data.details);
        if (!titleResult.value || !detailsResult.value) {
            return res.status(400).json({
                message: 'Notice content is empty after removing unsafe HTML',
            });
        }

        applySanitizationHeaders(res, [titleResult, detailsResult]);

        const notice = new Notice({
            title: titleResult.value,
            details: detailsResult.value,
            date: data.date,
            school: req.user.schoolId,
        });
        const result = await notice.save();
        res.send(buildNoticeResponse(result, titleResult, detailsResult));
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await Notice.find({ school: req.params.id });
        if (notices.length > 0) {
            const results = [];
            const payload = notices.map((notice) => {
                const [titleResult, detailsResult] = sanitizeNoticeContent(notice.title, notice.details);
                results.push(titleResult, detailsResult);
                return buildNoticeResponse(notice, titleResult, detailsResult);
            });
            applySanitizationHeaders(res, results);
            res.send(payload);
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const data = sendValidationError(res, noticeUpdateDto(req.body));
        if (!data) return;

        const [titleResult, detailsResult] = sanitizeNoticeContent(data.title, data.details);
        if (!titleResult.value || !detailsResult.value) {
            return res.status(400).json({
                message: 'Notice content is empty after removing unsafe HTML',
            });
        }

        applySanitizationHeaders(res, [titleResult, detailsResult]);

        const result = await Notice.findByIdAndUpdate(
            req.params.id,
            { $set: { title: titleResult.value, details: detailsResult.value, date: data.date } },
            { new: true }
        );
        res.send(buildNoticeResponse(result, titleResult, detailsResult));
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
};

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
};

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };
