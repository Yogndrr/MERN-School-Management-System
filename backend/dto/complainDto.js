const { ok, fail, requiredString, requiredDate } = require('./validate');

const complainCreateDto = (body) => {
    const date = requiredDate(body, 'date', 'Date');
    if (date.error) return fail(date.error);
    const complaint = requiredString(body, 'complaint', 'Complaint');
    if (complaint.error) return fail(complaint.error);
    if (complaint.value.length > 2000) return fail('Complaint must be 2000 characters or less');

    return ok({
        date: date.value,
        complaint: complaint.value,
    });
};

module.exports = { complainCreateDto };
