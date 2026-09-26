const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const purifyWindow = new JSDOM('').window;
const DOMPurify = createDOMPurify(purifyWindow);

const XSS_PATTERN = /<\s*(script|iframe|object|embed|svg|img|link|meta|style|form|video|audio|math|base)|javascript\s*:|vbscript\s*:|on\w+\s*=|data\s*:\s*text\/html|expression\s*\(/i;

const RICH_TEXT_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'style', 'svg', 'math', 'form'],
    FORBID_ATTR: ['style', 'src', 'href', 'srcset', 'xlink:href'],
};

const PLAIN_TEXT_CONFIG = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
};

const looksLikeXss = (value) => XSS_PATTERN.test(String(value ?? ''));

const sanitizeValue = (input, config, field) => {
    const original = String(input ?? '');
    const sanitized = DOMPurify.sanitize(original, config).trim();
    const xssDetected = looksLikeXss(original) || original.trim() !== sanitized;

    return {
        field,
        value: sanitized,
        original,
        xssDetected,
    };
};

const sanitizePlainText = (input, field = 'text') =>
    sanitizeValue(input, PLAIN_TEXT_CONFIG, field);

const sanitizeRichText = (input, field = 'html') =>
    sanitizeValue(input, RICH_TEXT_CONFIG, field);

const applySanitizationHeaders = (res, results) => {
    const detected = results.some((item) => item.xssDetected);
    res.set('X-XSS-Input-Sanitized', detected ? 'true' : 'false');

    if (detected) {
        const fields = results
            .filter((item) => item.xssDetected)
            .map((item) => item.field);
        console.warn('[XSS] Unsafe HTML stripped from:', fields.join(', '));
    }

    return detected;
};

const sanitizationReport = (results) => {
    const sanitizedFields = results
        .filter((item) => item.xssDetected)
        .map((item) => item.field);

    return {
        xssDetected: sanitizedFields.length > 0,
        sanitizedFields,
    };
};

const toPlainObject = (doc) =>
    (doc && typeof doc.toObject === 'function' ? doc.toObject() : { ...doc });

module.exports = {
    sanitizePlainText,
    sanitizeRichText,
    applySanitizationHeaders,
    sanitizationReport,
    looksLikeXss,
    toPlainObject,
};
