const { ok, fail, requiredString, requiredDate } = require('./validate');

const noticeFields = (body) => {
    const title = requiredString(body, 'title', 'Title');
    if (title.error) return fail(title.error);
    if (title.value.length > 150) return fail('Title must be 150 characters or less');
    const details = requiredString(body, 'details', 'Details');
    if (details.error) return fail(details.error);
    if (details.value.length > 2000) return fail('Details must be 2000 characters or less');
    const date = requiredDate(body, 'date', 'Date');
    if (date.error) return fail(date.error);

    return ok({
        title: title.value,
        details: details.value,
        date: date.value,
    });
};

const noticeCreateDto = noticeFields;
const noticeUpdateDto = noticeFields;

module.exports = { noticeCreateDto, noticeUpdateDto };
