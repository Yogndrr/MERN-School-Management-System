import DOMPurify from 'dompurify';

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

export const looksLikeXss = (value) => XSS_PATTERN.test(String(value ?? ''));

const sanitizeValue = (input, config) => {
    const original = String(input ?? '');
    const sanitized = DOMPurify.sanitize(original, config).trim();

    return {
        value: sanitized,
        original,
        xssDetected: looksLikeXss(original) || original.trim() !== sanitized,
    };
};

export const sanitizePlainText = (input) => sanitizeValue(input, PLAIN_TEXT_CONFIG);

export const sanitizeRichText = (input) => sanitizeValue(input, RICH_TEXT_CONFIG);

export const NOTICE_TITLE_MAX = 150;
export const NOTICE_DETAILS_MAX = 2000;
export const COMPLAINT_MAX = 2000;
