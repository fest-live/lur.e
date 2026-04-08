/**
 * Versioned JSON persistence for the orient-layer speed dial / desktop grid.
 * - Main key: canonical layout + items
 * - Draft key: debounced snapshot while dragging (crash recovery if main never flushed)
 */

export const DESKTOP_MAIN_KEY = "cw-oriented-desktop-layout-v1";
export const DESKTOP_DRAFT_KEY = `${DESKTOP_MAIN_KEY}.draft`;

export type DesktopPersistFile = {
    v: 2;
    updatedAt: string;
    columns: number;
    rows: number;
    items: unknown[];
};

const safeGet = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeSet = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* quota / private mode */
    }
};

const safeRemove = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch {
        /* noop */
    }
};

/** Encode grid state as compact JSON (ISO timestamp for debugging / sync). */
export function encodeDesktopState(columns: number, rows: number, items: unknown[]): string {
    const payload: DesktopPersistFile = {
        v: 2,
        updatedAt: new Date().toISOString(),
        columns,
        rows,
        items
    };
    return JSON.stringify(payload);
}

/**
 * Decode persisted JSON. Accepts v2 envelope or legacy flat `{ columns, rows, items }`.
 */
export function decodeDesktopState(raw: string): DesktopPersistFile | null {
    try {
        const p = JSON.parse(raw) as Record<string, unknown> | null;
        if (!p || typeof p !== "object") return null;
        const items = p.items;
        if (!Array.isArray(items)) return null;
        const columns = Math.max(0, Number(p.columns));
        const rows = Math.max(0, Number(p.rows));
        if (p.v === 2 && Number.isFinite(columns) && Number.isFinite(rows)) {
            return {
                v: 2,
                updatedAt: String(p.updatedAt || new Date().toISOString()),
                columns: columns || 6,
                rows: rows || 8,
                items
            };
        }
        return {
            v: 2,
            updatedAt: new Date().toISOString(),
            columns: Number.isFinite(columns) && columns > 0 ? columns : 6,
            rows: Number.isFinite(rows) && rows > 0 ? rows : 8,
            items
        };
    } catch {
        return null;
    }
}

export function loadDesktopRaw(): string | null {
    const main = safeGet(DESKTOP_MAIN_KEY);
    const draft = safeGet(DESKTOP_DRAFT_KEY);
    if (!main) return draft;
    if (!draft) return main;
    const mainDec = decodeDesktopState(main);
    const draftDec = decodeDesktopState(draft);
    if (!mainDec) return draft;
    if (!draftDec) return main;
    const mainT = Date.parse(mainDec.updatedAt || "");
    const draftT = Date.parse(draftDec.updatedAt || "");
    if (Number.isFinite(draftT) && Number.isFinite(mainT) && draftT > mainT) return draft;
    return main;
}

/** Write main snapshot and drop draft (commit). */
export function persistDesktopMain(columns: number, rows: number, items: unknown[]): void {
    safeSet(DESKTOP_MAIN_KEY, encodeDesktopState(columns, rows, items));
    safeRemove(DESKTOP_DRAFT_KEY);
}

/** Intermediate snapshot only (e.g. while dragging). */
export function persistDesktopDraft(columns: number, rows: number, items: unknown[]): void {
    safeSet(DESKTOP_DRAFT_KEY, encodeDesktopState(columns, rows, items));
}

export function clearDesktopDraft(): void {
    safeRemove(DESKTOP_DRAFT_KEY);
}
