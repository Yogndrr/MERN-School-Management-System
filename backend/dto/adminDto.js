const { ok, fail, requiredString } = require('./validate');

const adminRegisterDto = (body) => {
    const name = requiredString(body, 'name', 'Name');
    if (name.error) return fail(name.error);
    const email = requiredString(body, 'email', 'Email');
    if (email.error) return fail(email.error);
    const password = requiredString(body, 'password', 'Password');
    if (password.error) return fail(password.error);
    const schoolName = requiredString(body, 'schoolName', 'School name');
    if (schoolName.error) return fail(schoolName.error);

    return ok({
        name: name.value,
        email: email.value,
        password: password.value,
        schoolName: schoolName.value,
    });
};

module.exports = { adminRegisterDto };
