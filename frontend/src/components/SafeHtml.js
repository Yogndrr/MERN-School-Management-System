import React from 'react';
import { sanitizePlainText, sanitizeRichText } from '../utils/sanitize';

const SafeHtml = ({ html, allowMarkup = false }) => {
    const clean = allowMarkup
        ? sanitizeRichText(html).value
        : sanitizePlainText(html).value;

    if (!allowMarkup) {
        return <>{clean}</>;
    }

    return <span dangerouslySetInnerHTML={{ __html: clean }} />;
};

export default SafeHtml;
