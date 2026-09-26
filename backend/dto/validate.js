const mongoose = require('mongoose');

const ok = (value) => ({ ok: true, value });
const fail = (message) => ({ ok: false, message });

const requiredString = (source, field, label = field) => {
    const value = source?.[field];
    if (typeof value !== 'string' || value.trim() === '') {
        return { error: `${label} is required` };
    }
    return { value: value.trim() };
};

const optionalString = (source, field, label = field) => {
    const value = source?.[field];
    if (value === undefined || value === null || value === '') {
        return { value: undefined };
    }
    if (typeof value !== 'string' || value.trim() === '') {
        return { error: `${label} is invalid` };
    }
    return { value: value.trim() };
};

const requiredNumber = (source, field, label = field) => {
    const value = source?.[field];
    if (typeof value === 'number' && Number.isFinite(value)) {
        return { value };
    }
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
        return { value: Number(value) };
    }
    return { error: `${label} must be a number` };
};

const requiredObjectId = (source, field, label = field) => {
    const value = source?.[field];
    if (typeof value !== 'string' || !mongoose.Types.ObjectId.isValid(value)) {
        return { error: `${label} is invalid` };
    }
    return { value };
};

const requiredDate = (source, field, label = field) => {
    const value = source?.[field];
    const date = new Date(value);
    if (value === undefined || value === null || value === '' || Number.isNaN(date.getTime())) {
        return { error: `${label} is invalid` };
    }
    return { value: date };
};

const requiredTextOrNumber = (source, field, label = field) => {
    const value = source?.[field];
    if (typeof value === 'number' && Number.isFinite(value)) {
        return { value: String(value) };
    }
    if (typeof value === 'string' && value.trim() !== '') {
        return { value: value.trim() };
    }
    return { error: `${label} is required` };
};

const sendValidationError = (res, result) => {
    if (!result.ok) {
        res.status(400).json({ message: result.message });
        return null;
    }
    return result.value;
};

module.exports = {
    ok,
    fail,
    requiredString,
    optionalString,
    requiredNumber,
    requiredObjectId,
    requiredDate,
    requiredTextOrNumber,
    sendValidationError,
};
