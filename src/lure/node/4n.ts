

function getIndentColumns(line: string, tabWidth = 4): number {
    let col = 0;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === ' ') col += 1;
        else if (ch === '\t') col += tabWidth - (col % tabWidth);
        else break;
    }
    return col;
}

function stripIndentColumns(line: string, columns: number, tabWidth = 4): string {
    let col = 0, i = 0;
    while (i < line.length && col < columns) {
        const ch = line[i];
        if (ch === ' ') { col += 1; i++; }
        else if (ch === '\t') { col += tabWidth - (col % tabWidth); i++; }
        else break;
    }
    return line.slice(i);
}

function pickEOL(s: string): string {
    if (s.includes('\r\n')) return '\r\n';
    if (s.includes('\r')) return '\r';
    return '\n';
}


export function detectIndentation(
    text: string,
    { ignoreFirstLine = true, tabWidth = 4 } = {}
) {
    const lines = text.split(/\r\n|\n|\r/);
    const start = ignoreFirstLine ? 1 : 0;

    const indents: number[] = [];
    for (let i = start; i < lines.length; i++) {
        const ln = lines[i];
        if (ln.trim() === '') continue;
        indents.push(getIndentColumns(ln, tabWidth));
    }

    if (indents.length === 0) {
        return { min: 0, last: 0, step: 0, multipleOf4: true };
    }

    const min = Math.min(...indents);

    // Часто минимальный — у последней непустой строки (например, закрывающий тег)
    let j = lines.length - 1;
    while (j >= 0 && lines[j].trim() === '') j--;
    const last = j >= 0 ? getIndentColumns(lines[j], tabWidth) : 0;

    // Оценка шага (GCD разностей)
    const uniq = Array.from(new Set(indents)).sort((a, b) => a - b);
    let step = 0;
    for (let i = 1; i < uniq.length; i++) {
        const d = uniq[i] - uniq[i - 1];
        step = step === 0 ? d : gcd(step, d);
    }
    // нормализуем “шум”: если шаг некрасивый, округлим к 2/4 при необходимости
    if (step && step % 2 !== 0) {
        if (step % 4 === 0) step = 4;
        else if (step % 2 === 0) step = 2;
    }

    return {
        min,
        last,
        step,
        multipleOf4: min % 4 === 0
    };

    function gcd(a: number, b: number): number {
        while (b) [a, b] = [b, a % b];
        return Math.abs(a);
    }
}

export function cleanupInterTagWhitespaceAndIndent(
    html: string,
    {
        normalizeIndent = true,
        ignoreFirstLine = true,
        tabWidth = 4
    }: { normalizeIndent?: boolean; ignoreFirstLine?: boolean; tabWidth?: number } = {}
): string {
    if (!html || typeof html !== 'string' || html.indexOf('<') === -1) return html;

    const placeholders: string[] = [];
    const protectedHtml = html.replace(
        /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi,
        (m) => {
            const i = placeholders.push(m) - 1;
            return `\u0000${i}\u0000`;
        }
    );

    let working = protectedHtml;

    // 1) Нормализация отступов блока (исправляет “смещение на 4n” и пр.)
    if (normalizeIndent) {
        const eol = pickEOL(working);
        const lines = working.split(/\r\n|\n|\r/);
        const start = ignoreFirstLine ? 1 : 0;

        // Находим минимальный общий отступ по непустым строкам (кроме first line)
        let minIndent = Infinity;
        for (let i = start; i < lines.length; i++) {
            const ln = lines[i];
            if (ln.trim() === '') continue;
            const ind = getIndentColumns(ln, tabWidth);
            if (ind < minIndent) minIndent = ind;
        }
        if (!isFinite(minIndent)) minIndent = 0;

        if (minIndent > 0) {
            for (let i = start; i < lines.length; i++) {
                const ln = lines[i];
                if (ln.trim() === '') continue;
                lines[i] = stripIndentColumns(ln, minIndent, tabWidth);
            }
        }
        working = lines.join(eol);
    }

    // 2) Удаление whitespace между тегами (восстанавливает корректность :empty)
    working = working.replace(/>\s+</g, '><');

    // 3) Возвращаем защищённые блоки
    const cleaned = working.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i]);

    return cleaned;
}



export function cleanupInterTagWhitespace(html: string): string {
    if (!html || typeof html !== 'string' || html.indexOf('<') === -1) return html;

    const placeholders: string[] = [];
    // 1) Временно вырезаем "чувствительные" блоки
    const protectedHtml = html.replace(
        /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi,
        (m) => {
            const i = placeholders.push(m) - 1;
            return `\u0000${i}\u0000`;
        }
    );

    // 2) Удаляем межтеговые пробелы/переводы строк
    let cleaned = protectedHtml.replace(/>\s+</g, '><').trim();

    // 3) Возвращаем защищённые блоки на место
    cleaned = cleaned.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i]);

    return cleaned;
}
