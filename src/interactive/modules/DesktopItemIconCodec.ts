/*
 * Filename: DesktopItemIconCodec.ts
 * FullPath: modules/projects/lur.e/src/interactive/modules/DesktopItemIconCodec.ts
 * Change date and time: 09.35.00_02.08.2026
 * Reason for changes: Do not auto-favicon same-origin / view-path open-link hrefs (blank tiles).
 */

/**
 * Desktop / launcher tiles: avoid persisting or hydrating `data:` / `blob:` icon URLs
 * (DevTools, clipboard, localStorage stay small). Favicons use a short `g:hostname` ref.
 *
 * INVARIANT: Auto-favicon only for *external* http(s) hosts. Bare view tokens
 * (`settings`, `/workcenter`) resolve to the local origin — those must keep the
 * Phosphor glyph, not a Google s2 fetch for the LAN IP (often blank / 404).
 */

const GOOGLE_FAVICON_RE = /^https:\/\/www\.google\.com\/s2\/favicons\?[^#]*domain=([^&]+)/i;

const isLoopbackOrPrivateHost = (hostname: string): boolean => {
    const h = String(hostname || "").trim().toLowerCase().replace(/\.$/, "");
    if (!h) return true;
    if (h === "localhost" || h.endsWith(".local") || h === "::1") return true;
    if (/^127\.\d+\.\d+\.\d+$/.test(h)) return true;
    if (/^10\.\d+\.\d+\.\d+$/.test(h)) return true;
    if (/^192\.168\.\d+\.\d+$/.test(h)) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(h)) return true;
    if (/^0\.0\.0\.0$/.test(h)) return true;
    return false;
};

/** Only external public http(s) hosts get an auto favicon ref. */
export const isExternalHttpHrefForFavicon = (href: string, baseHref?: string): boolean => {
    const raw = String(href || "").trim();
    if (!raw) return false;
    try {
        const base =
            baseHref ||
            (typeof location !== "undefined" ? location.href : "https://local.invalid/");
        const u = new URL(raw, base);
        if (!/^https?:$/i.test(u.protocol)) return false;
        const host = String(u.hostname || "").toLowerCase();
        if (!host || isLoopbackOrPrivateHost(host)) return false;
        if (typeof location !== "undefined" && location.hostname && host === location.hostname.toLowerCase()) {
            return false;
        }
        if (typeof location !== "undefined" && u.origin === location.origin) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

/** Strip scheme prefix for JSON (`S` = https, `H` = http, `R` = other e.g. mailto). */
export const packHrefInline = (href: string): string => {
    const h = String(href || "").trim();
    if (!h) return "";
    if (h.startsWith("https://")) return `S${h.slice(8)}`;
    if (h.startsWith("http://")) return `H${h.slice(7)}`;
    return `R${h}`;
};

export const unpackHrefInline = (packed: string): string => {
    const p = String(packed || "").trim();
    if (!p) return "";
    if (p.startsWith("S")) return `https://${p.slice(1)}`;
    if (p.startsWith("H")) return `http://${p.slice(1)}`;
    if (p.startsWith("R")) return p.slice(1);
    return p;
};

export const hostnameToFaviconRef = (hostname: string): string => {
    const h = String(hostname || "")
        .trim()
        .toLowerCase()
        .replace(/\.$/, "");
    if (!h || isLoopbackOrPrivateHost(h)) return "";
    if (typeof location !== "undefined" && location.hostname && h === location.hostname.toLowerCase()) {
        return "";
    }
    return `g:${h}`;
};

export const faviconUrlForHostname = (hostname: string): string => {
    const h = String(hostname || "").trim();
    if (!h || isLoopbackOrPrivateHost(h)) return "";
    try {
        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(h.replace(/^\./, ""))}&sz=128`;
    } catch {
        return "";
    }
};

/** Favicon ref for an href, or "" when the link is local / view-path / non-http. */
export const faviconRefForHref = (href: string, baseHref?: string): string => {
    if (!isExternalHttpHrefForFavicon(href, baseHref)) return "";
    try {
        const base =
            baseHref ||
            (typeof location !== "undefined" ? location.href : "https://local.invalid/");
        const u = new URL(String(href || "").trim(), base);
        return hostnameToFaviconRef(u.hostname);
    } catch {
        return "";
    }
};

/**
 * Normalize payload from JSON/import: never keep base64/blob; collapse Google favicon URLs to `g:`.
 * WHY: drop persisted `g:192.168.x.x` / same-host refs that blanked tiles after Open-link edits.
 */
export const normalizeIconSrcFromPayload = (iconSrcRaw: unknown, hrefRaw: unknown, action: string): string => {
    const raw = String(iconSrcRaw || "").trim();
    if (/^(data:|blob:)/i.test(raw)) return "";
    if (raw.startsWith("g:")) {
        const host = raw.slice(2).trim().toLowerCase();
        return hostnameToFaviconRef(host);
    }
    const m = raw.match(GOOGLE_FAVICON_RE);
    if (m) {
        try {
            const host = decodeURIComponent(m[1]).toLowerCase();
            return hostnameToFaviconRef(host);
        } catch {
            return "";
        }
    }
    if (/^https?:\/\//i.test(raw) && raw.length < 2048) {
        try {
            const u = new URL(raw);
            if (isLoopbackOrPrivateHost(u.hostname)) return "";
            if (typeof location !== "undefined" && u.origin === location.origin) return "";
            return raw;
        } catch {
            return raw;
        }
    }
    if (!raw && String(action || "") === "open-link" && hrefRaw) {
        return faviconRefForHref(String(hrefRaw));
    }
    return "";
};

/** Value safe to assign to `<img src>` (never data:/blob:). */
export const expandIconSrcForDom = (stored: string): string => {
    const s = String(stored || "").trim();
    if (!s) return "";
    if (/^(data:|blob:)/i.test(s)) return "";
    if (s.startsWith("g:")) {
        const host = s.slice(2);
        if (!hostnameToFaviconRef(host)) return "";
        return faviconUrlForHostname(host);
    }
    return s;
};

/** Shrink icon field before JSON.stringify / localStorage. */
export const compactIconSrcForStorage = (
    iconSrc: string,
    action: string | undefined,
    href: string | undefined
): string => {
    const raw = String(iconSrc || "").trim();
    if (/^(data:|blob:)/i.test(raw)) return "";
    if (raw.startsWith("g:")) return hostnameToFaviconRef(raw.slice(2));
    const m = raw.match(GOOGLE_FAVICON_RE);
    if (m) {
        try {
            const host = decodeURIComponent(m[1]).toLowerCase();
            return hostnameToFaviconRef(host);
        } catch {
            return "";
        }
    }
    if (String(action || "") === "open-link" && href) {
        const fromHref = faviconRefForHref(String(href));
        if (fromHref) return fromHref;
    }
    if (/^https?:\/\//i.test(raw) && raw.length < 2048) {
        try {
            const u = new URL(raw);
            if (isLoopbackOrPrivateHost(u.hostname)) return "";
            if (typeof location !== "undefined" && u.origin === location.origin) return "";
            return raw;
        } catch {
            return raw;
        }
    }
    return "";
};

/** Compact single-item clipboard / debug (no pretty-print, short keys, packed href). */
export const ITEM_COMPACT_KIND = "cw-sdi";

export type DesktopItemLike = {
    id: string;
    label: string;
    icon: string;
    iconSrc?: string;
    viewId: string;
    cell: [number, number];
    action?: string;
    href?: string;
    shape?: string;
};

export const serializeDesktopItemCompact = (item: DesktopItemLike): string => {
    const u = item.href ? packHrefInline(item.href) : "";
    const g = compactIconSrcForStorage(String(item.iconSrc || ""), item.action, item.href);
    return JSON.stringify({
        k: ITEM_COMPACT_KIND,
        v: 1,
        i: {
            id: item.id,
            l: item.label,
            n: item.icon,
            c: item.cell,
            a: item.action || "open-view",
            w: item.viewId,
            ...(u ? { u } : {}),
            ...(g ? { g } : {}),
            ...(item.shape ? { s: item.shape } : {})
        }
    });
};

export const parseDesktopItemCompact = (raw: unknown): Record<string, unknown> | null => {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    if (o.k !== ITEM_COMPACT_KIND || !o.i || typeof o.i !== "object") return null;
    const i = o.i as Record<string, unknown>;
    const cell = i.c;
    const cx = Array.isArray(cell) ? Number(cell[0]) : NaN;
    const cy = Array.isArray(cell) ? Number(cell[1]) : NaN;
    const hrefPacked = typeof i.u === "string" ? i.u : "";
    const href = hrefPacked ? unpackHrefInline(hrefPacked) : "";
    const action = String(i.a || (href ? "open-link" : "open-view"));
    return {
        id: String(i.id || ""),
        label: String(i.l ?? "Item"),
        icon: String(i.n ?? "sparkle"),
        iconSrc: typeof i.g === "string" ? String(i.g) : "",
        viewId: String(i.w ?? (action === "open-link" ? "home" : "viewer")),
        cell: [Number.isFinite(cx) ? cx : 0, Number.isFinite(cy) ? cy : 0],
        action,
        href,
        shape: i.s
    };
};
