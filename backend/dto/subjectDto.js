const {
    ok,
    fail,
    requiredString,
    requiredObjectId,
    requiredTextOrNumber,
} = require('./validate');

const subjectCreateDto = (body) => {
    const sclassName = requiredObjectId(body, 'sclassName', 'Class');
    if (sclassName.error) return fail(sclassName.error);
    if (!Array.isArray(body?.subjects) || body.subjects.length === 0) {
        return fail('At least one subject is required');
    }

    const subjects = [];
    for (const item of body.subjects) {
        if (!item || typeof item !== 'object') {
            return fail('Subject is invalid');
        }
        const subName = requiredString(item, 'subName', 'Subject name');
        if (subName.error) return fail(subName.error);
        const subCode = requiredString(item, 'subCode', 'Subject code');
        if (subCode.error) return fail(subCode.error);
        const sessions = requiredTextOrNumber(item, 'sessions', 'Sessions');
        if (sessions.error) return fail(sessions.error);
        subjects.push({
            subName: subName.value,
            subCode: subCode.value,
            sessions: sessions.value,
        });
    }

    return ok({
        sclassName: sclassName.value,
        subjects,
    });
};

module.exports = { subjectCreateDto };
