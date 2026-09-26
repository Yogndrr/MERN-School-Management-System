const {
    ok,
    fail,
    requiredString,
    optionalString,
    requiredObjectId,
    requiredDate,
} = require('./validate');

const teacherRegisterDto = (body) => {
    const name = requiredString(body, 'name', 'Name');
    if (name.error) return fail(name.error);
    const email = requiredString(body, 'email', 'Email');
    if (email.error) return fail(email.error);
    const password = requiredString(body, 'password', 'Password');
    if (password.error) return fail(password.error);
    const teachSubject = requiredObjectId(body, 'teachSubject', 'Subject');
    if (teachSubject.error) return fail(teachSubject.error);
    const teachSclass = requiredObjectId(body, 'teachSclass', 'Class');
    if (teachSclass.error) return fail(teachSclass.error);

    return ok({
        name: name.value,
        email: email.value,
        password: password.value,
        teachSubject: teachSubject.value,
        teachSclass: teachSclass.value,
    });
};

const assignTeacherSubjectDto = (body) => {
    const teacherId = requiredObjectId(body, 'teacherId', 'Teacher');
    if (teacherId.error) return fail(teacherId.error);
    const teachSubject = requiredObjectId(body, 'teachSubject', 'Subject');
    if (teachSubject.error) return fail(teachSubject.error);

    return ok({
        teacherId: teacherId.value,
        teachSubject: teachSubject.value,
    });
};

const teacherAttendanceDto = (body) => {
    const date = requiredDate(body, 'date', 'Date');
    if (date.error) return fail(date.error);
    const presentCount = optionalString(body, 'presentCount', 'Present count');
    if (presentCount.error) return fail(presentCount.error);
    const absentCount = optionalString(body, 'absentCount', 'Absent count');
    if (absentCount.error) return fail(absentCount.error);

    return ok({
        date: date.value,
        presentCount: presentCount.value,
        absentCount: absentCount.value,
    });
};

module.exports = {
    teacherRegisterDto,
    assignTeacherSubjectDto,
    teacherAttendanceDto,
};
