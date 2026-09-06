/*
 * FIND:toast
 * WHY: Toast and clipboard copy often carry encodeURI / encodeURIComponent paths.
 * Cyrillic then lands as %D0%xx runs that overflow the pill.
 *
 * decodeURIComponent is the pair for path/query pieces; decodeURI keeps reserved
 * URI marks. Both throw URIError on a lone `%` (`50% done`), so valid %XX runs
 * are decoded on their own when the whole string is not a URI.
 */

const PCT_OCTET = /%[0-9A-Fa-f]{2}/;
const PCT_RUN = /(?:%[0-9A-Fa-f]{2})+/g;
const MAX_PASSES = 3;

const decodePctRun = (seq: string): string => {
    try {
        return decodeURIComponent(seq);
    } catch {
        try {
            return decodeURI(seq);
        } catch {
            return seq;
        }
    }
};

const decodeOnce = (text: string): string => {
    try {
        return decodeURIComponent(text);
    } catch {
        try {
            return decodeURI(text);
        } catch {
            return text.replace(PCT_RUN, decodePctRun);
        }
    }
};

/** Expand percent-encoded UTF-8 in toast / status text. Idempotent when already decoded. */
export const decodeToastMessage = (raw: unknown): string => {
    let text = String(raw ?? "");
    if (!text || !PCT_OCTET.test(text)) return text;
    for (let i = 0; i < MAX_PASSES; i++) {
        const next = decodeOnce(text);
        if (next === text) break;
        text = next;
        if (!PCT_OCTET.test(text)) break;
    }
    return text;
};
