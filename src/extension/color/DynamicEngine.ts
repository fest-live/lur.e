import { addEvent, fixedClientZoom } from "fest/dom";
import { stringRef } from "fest/object";

//
export const electronAPI = "electronBridge";

//
function extractAlpha(input) {
    if (typeof input !== 'string') return null;
    let color = input.trim().toLowerCase();

    // 1) Ключевые слова
    if (color === 'transparent') return 0;

    // 2) Hex-формы (#rgb[a], #rrggbb[aa]) — обычно не из getComputedStyle, но полезно
    if (color.startsWith('#')) {
        const hex = color;
        if (hex.length === 4) return 1; // #rgb
        if (hex.length === 7) return 1; // #rrggbb
        if (hex.length === 5) { // #rgba
            const a = hex[4];
            const aa = a + a; // expand
            return clamp(parseInt(aa, 16) / 255, 0, 1);
        }
        if (hex.length === 9) { // #rrggbbaa
            const aa = hex.slice(7, 9);
            return clamp(parseInt(aa, 16) / 255, 0, 1);
        }
        return null; // неизвестная длина
    }

    // 3) Функциональные нотации: rgb(), rgba(), hsl()/hsla() и т.п., color()
    const fnMatch = color.match(/^([a-z-]+)\((.*)\)$/i);
    if (!fnMatch) {
        // getComputedStyle не возвращает 'inherit/initial/unset' — если вдруг:
        return null;
    }

    const name = fnMatch[1];
    const body = fnMatch[2].trim();

    // 3a) Новая синтаксис с косой чертой: … / <alpha>
    // Работает для rgb(), hsl(), hwb(), lab(), lch(), oklab(), oklch(), color()
    {
        const slashIdx = body.lastIndexOf('/');
        if (slashIdx !== -1) {
            const aStr = body.slice(slashIdx + 1).trim();
            const a = parseAlphaComponent(aStr);
            if (a != null) return clamp(a, 0, 1);
            return null;
        }
    }

    // 3b) Старая запятая-форма с 4-м аргументом: rgba(..., a), hsla(..., a)
    // Также многие браузеры ещё возвращают rgba(r,g,b,a)
    if (body.includes(',')) {
        const parts = body.split(',').map(s => s.trim());
        if (parts.length >= 4) {
            const a = parseAlphaComponent(parts[3]);
            if (a != null) return clamp(a, 0, 1);
            return null;
        }
        // 3 аргумента — альфы нет
        return 1;
    }

    // 3c) Другие функциональные без альфы => 1
    return 1;
}

function parseAlphaComponent(str) {
    if (!str) return null;
    // Проценты: 30% => 0.3
    if (str.endsWith('%')) {
        const n = parseFloat(str);
        if (Number.isNaN(n)) return null;
        return n / 100;
    }
    // Число 0..1
    const n = parseFloat(str);
    if (Number.isNaN(n)) return null;
    return n;
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}



//
const tacp = (color: string)=>{
    if (!color || color == null) return 0;
    return (extractAlpha?.(color) || 0) > 0.1;
};

//
const setIdleInterval = (cb, timeout = 1000, ...args)=>{
    requestIdleCallback(async ()=>{
        if (!cb || (typeof cb != "function")) return;
        while (true) { // @ts-ignore
            await Promise.try(cb, ...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r, {timeout: 100}));
            await new Promise((r)=>requestAnimationFrame(r));
        }
    }, {timeout: 1000});
}

//
export const pickBgColor = (x, y, holder: HTMLElement | null = null)=>{
    // exclude any non-reasonable
    const opaque = Array.from(document.elementsFromPoint(x, y))?.filter?.((el: any)=>(
        ((el instanceof HTMLElement) && el != holder) &&
        (el?.dataset?.alpha != null ? parseFloat(el?.dataset?.alpha) > 0.01 : true) && // @ts-ignore
         el?.checkVisibility?.({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true }) &&
         el?.matches?.(":not([data-hidden])") &&
        (el?.style?.getPropertyValue("display") != "none")
    ))
    .map((element) => {
        const computed = getComputedStyle?.(element);
        return {
            element,
            zIndex: parseInt(computed?.zIndex || "0", 10) || 0,
            color: (computed?.backgroundColor || "transparent")
        }})
    .sort((a, b) => Math.sign(b.zIndex - a.zIndex))
    .filter(({ color })=>(tacp(color)));

    //
    if (opaque?.[0]?.element instanceof HTMLElement) {
        return opaque?.[0]?.color || "transparent";
    }

    //
    return "transparent";
};

//
export const pickFromCenter = (holder)=>{
    // not able to using some mechanics
    const box = holder?.getBoundingClientRect();//getBoundingOrientBox(holder);
    if (box) {
        const Z = 0.5 * (fixedClientZoom?.() || 1);
        const xy: [number, number] = [(box.left + box.right) * Z, (box.top + box.bottom) * Z];
        return pickBgColor(...xy, holder);
    }
}

//
export const dynamicNativeFrame = (root = document.documentElement)=>{
    let media = root?.querySelector?.('meta[data-theme-color]') ?? root?.querySelector?.('meta[name="theme-color"]');

    // Create meta element if it doesn't exist
    if (!media && root == document.documentElement) {
        media = document.createElement('meta');
        media.setAttribute('name', 'theme-color');
        media.setAttribute('data-theme-color', '');
        media.setAttribute('content', 'transparent');
        document.head.appendChild(media);
    }

    const color = pickBgColor(window.innerWidth - 64, 10);
    if ((media || window?.[electronAPI]) && root == document.documentElement) {
        media?.setAttribute?.("content", color);
    }
}

//
export const dynamicBgColors = (root = document.documentElement) => {
    root.querySelectorAll("body, body > *, body > * > *").forEach((target)=>{
        if (target) { pickFromCenter(target); }
    });
};

//
export const dynamicTheme = (ROOT = document.documentElement)=>{
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({}) => dynamicBgColors(ROOT));

    //
    const updater = ()=>{
        dynamicNativeFrame(ROOT);
        dynamicBgColors(ROOT);
    }

    //
    addEvent(ROOT, "u2-appear", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(ROOT, "u2-hidden", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(ROOT, "u2-theme-change", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(window, "load", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(document, "visibilitychange", ()=>requestIdleCallback(updater, {timeout: 100}));
    setIdleInterval(updater, 500);
}

//
export const currentColorFromPointRef = (x, y, ROOT = document.documentElement, timeout = 500)=>{
    const color = pickBgColor(x, y, ROOT);
    const rfc = stringRef(color);
    const updater = ()=>{
        const color = pickBgColor(x, y, ROOT);
        rfc.value = color;
    }

    //
    addEvent(ROOT, "u2-appear", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(ROOT, "u2-hidden", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(ROOT, "u2-theme-change", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(window, "load", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(document, "visibilitychange", ()=>requestIdleCallback(updater, {timeout: 100}));
    setIdleInterval(updater, timeout);
    return rfc;
}

//
export const currentColorFromCenterRef = (element: HTMLElement, ROOT = document.documentElement, timeout = 500)=>{
    const color = pickFromCenter(element);
    const rfc = stringRef(color);
    const updater = ()=>{
        const color = pickFromCenter(element);
        rfc.value = color;
    }

    //
    addEvent(ROOT, "u2-appear", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(ROOT, "u2-hidden", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(ROOT, "u2-theme-change", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(window, "load", ()=>requestIdleCallback(updater, {timeout: 100}));
    addEvent(document, "visibilitychange", ()=>requestIdleCallback(updater, {timeout: 100}));
    setIdleInterval(updater, timeout);
    return rfc;
}

//
export default dynamicTheme;
