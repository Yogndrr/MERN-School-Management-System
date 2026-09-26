const {
    ok,
    fail,
    requiredString,
    optionalString,
    requiredNumber,
    requiredObjectId,
    requiredDate,
} = require('./validate');

const studentRegisterDto = (body) => {
    const name = requiredString(body, 'name', 'Name');
    if (name.error) return fail(name.error);
    const rollNum = requiredNumber(body, 'rollNum', 'Roll number');
    if (rollNum.error) return fail(rollNum.error);
    const password = requiredString(body, 'password', 'Password');
    if (password.error) return fail(password.error);
    const sclassName = requiredObjectId(body, 'sclassName', 'Class');
    if (sclassName.error) return fail(sclassName.error);

    return ok({
        name: name.value,
        rollNum: rollNum.value,
        password: password.value,
        sclassName: sclassName.value,
    });
};

const updateStudentDto = (body) => {
    const name = requiredString(body, 'name', 'Name');
    if (name.error) return fail(name.error);
    const rollNum = requiredNumber(body, 'rollNum', 'Roll number');
    if (rollNum.error) return fail(rollNum.error);
    const password = optionalString(body, 'password', 'Password');
    if (password.error) return fail(password.error);

    return ok({
        name: name.value,
        rollNum: rollNum.value,
        password: password.value,
    });
};

const examResultDto = (body) => {
    const subName = requiredObjectId(body, 'subName', 'Subject');
    if (subName.error) return fail(subName.error);
    const marksObtained = requiredNumber(body, 'marksObtained', 'Marks');
    if (marksObtained.error) return fail(marksObtained.error);

    return ok({
        subName: subName.value,
        marksObtained: marksObtained.value,
    });
};

const studentAttendanceDto = (body) => {
    const subName = requiredObjectId(body, 'subName', 'Subject');
    if (subName.error) return fail(subName.error);
    const status = requiredString(body, 'status', 'Status');
    if (status.error) return fail(status.error);
    if (status.value !== 'Present' && status.value !== 'Absent') {
        return fail('Status must be Present or Absent');
    }
    const date = requiredDate(body, 'date', 'Date');
    if (date.error) return fail(date.error);

    return ok({
        subName: subName.value,
        status: status.value,
        date: date.value,
    });
};

const removeSubjectAttendanceDto = (body) => {
    const subId = requiredObjectId(body, 'subId', 'Subject');
    if (subId.error) return fail(subId.error);
    return ok({ subId: subId.value });
};

module.exports = {
    studentRegisterDto,
    updateStudentDto,
    examResultDto,
    studentAttendanceDto,
    removeSubjectAttendanceDto,
};
