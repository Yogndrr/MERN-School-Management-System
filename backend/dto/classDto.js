const { ok, fail, requiredString } = require('./validate');

const classCreateDto = (body) => {
    const sclassName = requiredString(body, 'sclassName', 'Class name');
    if (sclassName.error) return fail(sclassName.error);
    return ok({ sclassName: sclassName.value });
};

module.exports = { classCreateDto };
