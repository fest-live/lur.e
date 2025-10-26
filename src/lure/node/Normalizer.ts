
//
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

function gcd(a: number, b: number): number {
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
}

function detectIndentStep(
    text: string,
    { ignoreFirstLine = true, tabWidth = 4 } = {}
): { min: number; step: number; allEven: boolean; allDiv4: boolean } {
    const lines = text.split(/\r\n|\n|\r/);
    const start = ignoreFirstLine ? 1 : 0;

    const indents: number[] = [];
    for (let i = start; i < lines.length; i++) {
        const ln = lines[i];
        if (ln.trim() === '') continue;
        indents.push(getIndentColumns(ln, tabWidth));
    }
    if (indents.length === 0) return { min: 0, step: 0, allEven: true, allDiv4: true };

    const min = Math.min(...indents);
    const shifted = indents.map(v => v - min).filter(v => v > 0);
    let step = 0;
    for (const v of shifted) step = step ? gcd(step, v) : v;

    const allEven = indents.every(v => v % 2 === 0);
    const allDiv4 = indents.every(v => v % 4 === 0);

    // Нормализация шага: предпочитаем 4, затем 2, иначе 1
    if (step === 0) {
        // все одинаково отступлены; берем по наблюдаемой кратности
        step = allDiv4 ? 4 : allEven ? 2 : 1;
    } else {
        if (step % 4 === 0) step = 4;
        else if (step % 2 === 0) step = 2;
        else step = 1;
    }

    return { min, step, allEven, allDiv4 };
}

function adjustIndentToGrid(
    line: string,
    step: number,
    mode: 'floor' | 'nearest' | 'ceil' = 'floor',
    tabWidth = 4
): string {
    if (!step || step <= 1) return line; // нет смысла квантизовать к 1n
    const cur = getIndentColumns(line, tabWidth);
    if (cur === 0) return line; // нечего править
    let target: number;
    if (mode === 'nearest') target = Math.round(cur / step) * step;
    else if (mode === 'ceil') target = Math.ceil(cur / step) * step;
    else target = Math.floor(cur / step) * step;

    const delta = cur - target;
    if (delta > 0) {
        // уменьшаем отступ на delta колонок
        return stripIndentColumns(line, delta, tabWidth);
    } else if (delta < 0) {
        // увеличиваем пробелами (без смешивания табов) при необходимости
        return ' '.repeat(-delta) + line;
    }
    return line;
}

function normalizeStartTagWhitespace(
    html: string,
    { scope = 'void-only' as 'void-only' | 'input-only' | 'all' } = {}
): string {
    if (!html || typeof html !== 'string') return html;

    const VOID = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
        'param', 'source', 'track', 'wbr'
    ]);

    let out = '';
    let i = 0;
    const n = html.length;

    while (i < n) {
        const ch = html[i];
        if (ch !== '<') { out += ch; i++; continue; }

        // Комментарии <!-- ... -->
        if (html.startsWith('<!--', i)) {
            const end = html.indexOf('-->', i + 4);
            if (end === -1) { out += html.slice(i); break; }
            out += html.slice(i, end + 3);
            i = end + 3;
            continue;
        }
        // DOCTYPE/DECL/CDATA/PI
        if (html[i + 1] === '!' || html[i + 1] === '?') {
            const end = html.indexOf('>', i + 2);
            if (end === -1) { out += html.slice(i); break; }
            out += html.slice(i, end + 1);
            i = end + 1;
            continue;
        }
        // Закрывающий тег
        if (html[i + 1] === '/') {
            const end = html.indexOf('>', i + 2);
            if (end === -1) { out += html.slice(i); break; }
            out += html.slice(i, end + 1);
            i = end + 1;
            continue;
        }

        // Открывающий тег
        let j = i + 1;
        // пропускаем пробелы после "<"
        while (j < n && /\s/.test(html[j])) j++;
        const nameStart = j;
        while (j < n && /[A-Za-z0-9:-]/.test(html[j])) j++;
        const tagName = html.slice(nameStart, j).toLowerCase();
        // Найти конец тега с учётом кавычек
        let k = j;
        let quote: '"' | "'" | null = null;
        while (k < n) {
            const c = html[k];
            if (quote) {
                if (c === quote) quote = null;
                k++;
            } else {
                if (c === '"' || c === "'") { quote = c as '"' | "'"; k++; }
                else if (c === '>') { break; }
                else { k++; }
            }
        }
        if (k >= n) { out += html.slice(i); break; }
        const rawTag = html.slice(i, k + 1); // включая '>'

        const shouldNormalize =
            scope === 'all' ||
            (scope === 'input-only' && tagName === 'input') ||
            (scope === 'void-only' && VOID.has(tagName));

        if (!shouldNormalize) {
            out += rawTag;
            i = k + 1;
            continue;
        }

        // Нормализация пробелов внутри тега (вне кавычек)
        let res = '';
        let q: '"' | "'" | null = null;
        let ws = false;
        for (let p = 0; p < rawTag.length; p++) {
            const c = rawTag[p];
            if (q) {
                res += c;
                if (c === q) q = null;
                continue;
            }
            if (c === '"' || c === "'") { q = c as '"' | "'"; res += c; ws = false; continue; }
            if (c === '\n' || c === '\r' || c === '\t' || c === ' ') {
                if (!ws) { res += ' '; ws = true; }
                continue;
            }
            res += c;
            ws = false;
        }
        // Удалить пробел перед '>' и '/>'
        res = res.replace(/\s*(\/?)\s*>$/, '$1>');

        out += res;
        i = k + 1;
    }

    return out;
}

function collapseInterTagWhitespaceSmart(
    html: string,
    { preserveCommentGaps = true } = {}
): string {
    if (!html || typeof html !== 'string') return html;

    if (!preserveCommentGaps) {
        // Старое поведение
        return html.replace(/>\s+</g, '><');
    }

    // Маркер не-пробельного символа
    const SENT = '\u0001';

    let s = html;

    // 1) Помечаем одно-строчные промежутки вокруг комментариев:
    //    <!-- --> ␠ <!-- -->,  <!-- --> ␠ <tag,  <tag> ␠ <!-- -->
    //    [^\S\r\n]+ — только горизонтальные пробелы (без переводов строки)
    s = s
        .replace(/-->([^\S\r\n]+)<!--/g, `-->${SENT}<!--`)
        .replace(/-->([^\S\r\n]+)</g, `-->${SENT}<`)
        .replace(/>([^\S\r\n]+)<!--/g, `>${SENT}<!--`);

    // 2) Убираем все межтеговые пробелы (и с переводами строк)
    s = s.replace(/>\s+</g, '><');

    // 3) Возвращаем один пробел там, где он обязателен
    s = s.replace(new RegExp(SENT, 'g'), ' ');

    return s;
}

//
export function cleanupInterTagWhitespaceAndIndent(
    html: string,
    {
        normalizeIndent = true,          // убрать общий минимальный отступ
        ignoreFirstLine = true,          // первую строку не учитываем при детекте
        tabWidth = 4,                    // ширина таба в колонках
        alignStep = 'auto' as 'auto' | 1 | 2 | 4, // сетка 2n/4n/1n
        quantize = 'none' as 'none' | 'floor' | 'nearest' | 'ceil', // квантизация к сетке
    } = {}
): string {
    if (!html || typeof html !== 'string' || html.indexOf('<') === -1) return html;
    html = html?.trim?.();

    //
    const placeholders: string[] = [];
    const protectedHtml = html.replace(
        /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi,
        (m) => {
            const i = placeholders.push(m) - 1;
            return `\u0000${i}\u0000`;
        }
    );

    const eol = pickEOL(protectedHtml);
    const lines = protectedHtml.split(/\r\n|\n|\r/);
    const start = ignoreFirstLine ? 1 : 0;

    // 1) Детект шага и минимального отступа
    const { min, step: autoStep } = detectIndentStep(protectedHtml, { ignoreFirstLine, tabWidth });

    // 2) Dedent: убираем общий минимальный отступ
    if (normalizeIndent && min > 0) {
        for (let i = start; i < lines.length; i++) {
            const ln = lines[i];
            if (ln.trim() === '') continue;
            lines[i] = stripIndentColumns(ln, min, tabWidth);
        }
    }

    // 3) Квантизация к сетке 2n/4n по желанию
    let step = alignStep === 'auto' ? autoStep : alignStep;
    if (quantize !== 'none' && step > 1) {
        for (let i = start; i < lines.length; i++) {
            const ln = lines[i];
            if (ln.trim() === '') continue;
            lines[i] = adjustIndentToGrid(ln, step, quantize, tabWidth);
        }
    }

    // 4) Склеиваем и убираем межтеговые пробелы/переводы строк
    let working = lines.join(eol);

    // 5) ...dedent/квантизация
    working = normalizeStartTagWhitespace(working, { scope: 'void-only' });

    // 6) убрать межтеговые пробелы
    working = collapseInterTagWhitespaceSmart(working);

    // 7) Возвращаем защищённые блоки
    const cleaned = working.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i]);
    return cleaned?.trim?.();
}
