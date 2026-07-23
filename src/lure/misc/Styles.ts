import { bindWith } from "../core/Binding";
import { handleStyleChange } from "fest/dom";

//
/** True when there is no non-empty declaration value (handles `prop: ` / `prop:` after empty `${...}` in html templates). */
export const isEffectivelyEmptyStyleText = (cssText: string | null | undefined): boolean => {
    const s = typeof cssText == "string" ? cssText.trim() : "";
    if (!s) return true;
    for (const chunk of s.split(";")) {
        const t = chunk.trim();
        if (!t) continue;
        const ci = t.indexOf(":");
        if (ci < 0) return false;
        if (t.slice(ci + 1).trim().length > 0) return false;
    }
    return true;
};

//
/** Drop a useless `style` attribute left over from empty template interpolations. */
export const pruneEmptyStyleAttribute = (element: HTMLElement | null | undefined): void => {
    if (element == null) return;
    const raw = element.getAttribute("style");
    if (raw == null) return;
    if (isEffectivelyEmptyStyleText(raw)) {
        element.removeAttribute("style");
        element.style.cssText = "";
    }
};

//
/** Set inline styles or remove the attribute when the effective CSS text is empty. */
export const applyNormalizedInlineStyle = (element: HTMLElement, cssText: string): void => {
    if (isEffectivelyEmptyStyleText(cssText)) {
        element.style.cssText = "";
        element.removeAttribute("style");
    } else {
        element.style.cssText = cssText;
    }
};

/*
//
// NEWER, INLINE STYLES ONLY!!!
// string template for CSS values
export const S = (strings, ...values: any[])=>{
    // extract possible reactive values
    let props: string[] = [], vars: Map<string, any> = new Map();
    let index = 0, counter = 0;
    const parts: string[] = [];
    for (const string of strings) {
        parts.push(string);
        const $value = values?.[index], $isValid = strings[index+1]?.trim?.()?.includes?.(";");
        if ($isValid) {
            if (typeof $value == "object" && ($value?.value != null || "value" in $value)) {
                const varName = `--ref-${counter}`;
                parts.push(`var(${varName})`);
                props.push(`@property ${varName} { syntax: "<number>"; initial-value: ${$value?.value ?? 0}; inherits: true; };`);
                vars.set(varName, $value);
                counter++;
            } else
            if (typeof $value != "object" && typeof $value != "function") {
                if ($value != null && String($value).trim() !== "") {
                    parts.push(String($value));
                }
            }
        }
        index++;
    }

    // return a function that applies the style to an element
    return [(element: any)=>{
        applyNormalizedInlineStyle(element, parts?.join?.(";") ?? "");

        // apply reactive values
        const subs: any[] = [];
        for (const [name, value] of vars) {
            subs.push(bindWith(element, name, value, handleStyleChange));
        }

        // return a function that unsubscribes the reactive values
        return ()=>{
            for (const sub of subs) {
                sub?.();
            }
        }
    }, props, vars];
};

//
export const css = (strings, ...values: any[])=>{ return S(strings, ...values); }
*/



type TypedStyleSlot = {
    marker: string;
    value: any;
    multipliedByUnit?: string;
};

let typedStyleTemplateId = 0;

/** Detects CSSUnitValue, CSSMathValue and other native CSSStyleValue descendants. */
export const isNativeCSSStyleValue = (value: any): boolean => {
    if (value == null || typeof value !== "object") return false;

    try {
        const ctor = (globalThis as any).CSSStyleValue;
        if (typeof ctor === "function" && value instanceof ctor) {
            return true;
        }

        // Typed OM object from another Window/realm.
        for (
            let proto = value;
            proto;
            proto = Object.getPrototypeOf(proto)
        ) {
            if (proto?.constructor?.name === "CSSStyleValue") {
                return true;
            }
        }
    } catch {
        // Some proxies reject instanceof/getPrototypeOf.
    }

    return false;
};

export const isReactiveStyleValue = (value: any): boolean => {
    if (
        value == null ||
        typeof value !== "object" ||
        isNativeCSSStyleValue(value)
    ) {
        return false;
    }

    try {
        return "value" in value;
    } catch {
        return false;
    }
};

const isStaticStyleInterpolation = (value: any): boolean => {
    return (
        value == null ||
        (
            typeof value !== "object" &&
            typeof value !== "function"
        )
    );
};

type InlineStyleTemplateParts = {
    strings: string[];
    values: any[];
    indices: number[];
};

export type InlineStyleAttributePlan =
    | {
        kind: "static";
        cssText: string;
    }
    | {
        // Preserve the existing handling of style="${styleObject}".
        kind: "direct";
        value: any;
    }
    | {
        kind: "template";
        binding: ReturnType<typeof S>;
    };

/**
 * Splits:
 *
 *   "color: #{0}; width: #{2}px"
 *
 * back into:
 *
 *   ["color: ", "; width: ", "px"]
 *   [attributes[0], attributes[2]]
 */
const splitInlineStylePlaceholders = (
    source: string,
    attributes: readonly any[],
): InlineStyleTemplateParts | null => {
    const strings: string[] = [];
    const values: any[] = [];
    const indices: number[] = [];

    const pattern = /#\{(\d+)\}/g;
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(source)) != null) {
        const index = Number.parseInt(match[1], 10);

        if (!Number.isSafeInteger(index) || index < 0) {
            continue;
        }

        strings.push(source.slice(cursor, match.index));
        values.push(attributes[index]);
        indices.push(index);

        cursor = match.index + match[0].length;
    }

    if (values.length === 0) return null;

    strings.push(source.slice(cursor));

    return {
        strings,
        values,
        indices,
    };
};

const joinStaticInlineStyle = (
    strings: readonly string[],
    values: readonly any[],
): string => {
    let result = strings[0] ?? "";

    for (let index = 0; index < values.length; index++) {
        const value = values[index];

        if (value != null) {
            result += String(value);
        }

        result += strings[index + 1] ?? "";
    }

    return result;
};

/**
 * Converts an HTML style attribute containing internal #{n} placeholders
 * either into static CSS or into the same binding returned by S`...`.
 */
export const compileInlineStyleAttribute = (
    source: string,
    attributes: readonly any[],
): InlineStyleAttributePlan | null => {
    const parsed = splitInlineStylePlaceholders(source, attributes);
    if (!parsed) return null;

    const { strings, values } = parsed;

    const isWholeAttributeValue =
        values.length === 1 &&
        (strings[0] ?? "").trim() === "" &&
        (strings[1] ?? "").trim() === "";

    // Keep the old style="${styleObject}" / style="${styleRef}" contract.
    // A complete reactive cssText value cannot be represented as a CSS
    // variable because there is no surrounding property declaration.
    if (
        isWholeAttributeValue &&
        !isStaticStyleInterpolation(values[0]) &&
        !isNativeCSSStyleValue(values[0])
    ) {
        return {
            kind: "direct",
            value: values[0],
        };
    }

    const containsDynamicStyleValue = values.some(
        value =>
            isReactiveStyleValue(value) ||
            isNativeCSSStyleValue(value),
    );

    if (containsDynamicStyleValue) {
        return {
            kind: "template",
            binding: S(
                strings as unknown as TemplateStringsArray,
                ...values,
            ),
        };
    }

    // Long attributes containing only primitive values must remain one
    // ordinary CSS declaration string. No binding or CSS variables needed.
    if (values.every(isStaticStyleInterpolation)) {
        return {
            kind: "static",
            cssText: joinStaticInlineStyle(strings, values),
        };
    }

    // Retain S semantics for mixed declarations containing an unsupported
    // object/function: S decides whether that interpolation is omitted.
    return {
        kind: "template",
        binding: S(
            strings as unknown as TemplateStringsArray,
            ...values,
        ),
    };
};

const escapeRegExp = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const replaceTypedMarkers = (
    value: string,
    slots: readonly TypedStyleSlot[],
): string => {
    let result = value;

    for (const slot of slots) {
        result = result.replace(
            new RegExp(`var\\(\\s*${escapeRegExp(slot.marker)}\\s*\\)`, "g"),
            String(slot.value),
        );
    }

    return result;
};

//
const applyStyleTemplate = (
    element: HTMLElement,
    cssText: string,
    slots: readonly TypedStyleSlot[],
): void => {
    // Let the browser parse the declaration block, including strings,
    // comments, functions, semicolons and declaration priorities.
    const probe = element.ownerDocument.createElement("span");
    probe.style.cssText = cssText;

    applyNormalizedInlineStyle(element, "");

    const target: any = element;
    const styleMap: any = target.attributeStyleMap ?? target.styleMap;
    const win: any = element.ownerDocument.defaultView ?? globalThis;
    const CSSStyleValueCtor: any = win.CSSStyleValue;

    for (let index = 0; index < probe.style.length; index++) {
        const property = probe.style.item(index);
        const parsedValue = probe.style.getPropertyValue(property);
        const priority = probe.style.getPropertyPriority(property);

        const usedSlots = slots.filter(({ marker }) =>
            parsedValue.includes(marker),
        );

        if (usedSlots.length === 0) {
            element.style.setProperty(property, parsedValue, priority);
            continue;
        }

        //
        const reconstructed = replaceTypedMarkers(parsedValue, usedSlots);
        let appliedThroughTypedOM = false;

        //
        if (styleMap?.set && !priority) {
            try {
                const directSlot = usedSlots.find(
                    ({ marker }) =>
                        parsedValue.trim() === `var(${marker})`,
                );
        
                const productSlot = usedSlots.find(
                    slot => isDirectTypedUnitProduct(parsedValue, slot),
                );
        
                if (directSlot) {
                    // width: ${CSS.px(10)}
                    styleMap.set(property, directSlot.value);
                } else if (productSlot?.multipliedByUnit) {
                    // width: ${CSS.number(10)}px
                    //
                    // Becomes the Typed OM equivalent of:
                    // calc(10 * 1px)
                    styleMap.set(
                        property,
                        createTypedUnitProduct(
                            win,
                            productSlot.value,
                            productSlot.multipliedByUnit,
                        ),
                    );
                } else if (CSSStyleValueCtor?.parseAll) {
                    const values = CSSStyleValueCtor.parseAll(
                        property,
                        reconstructed,
                    );
        
                    styleMap.set(property, ...values);
                } else if (CSSStyleValueCtor?.parse) {
                    styleMap.set(
                        property,
                        CSSStyleValueCtor.parse(property, reconstructed),
                    );
                } else {
                    styleMap.set(property, reconstructed);
                }
        
                appliedThroughTypedOM = true;
            } catch {
                // Unsupported Typed OM combinations, shorthands and incompatible
                // dimensions fall back to their reconstructed static CSS text.
            }
        }
        
        //
        if (!appliedThroughTypedOM) {
            element.style.setProperty(property, reconstructed, priority);
        }

        //
        if (!appliedThroughTypedOM) {
            element.style.setProperty(property, reconstructed, priority);
        }
    }

    pruneEmptyStyleAttribute(element);
};


const CSS_DIMENSION_UNITS = new Set([
    // Unitless and percentage
    "%",

    // Length
    "px", "cm", "mm", "q", "in", "pc", "pt",
    "em", "ex", "ch", "cap", "ic", "lh",
    "rem", "rex", "rch", "rcap", "ric", "rlh",

    // Viewport
    "vw", "vh", "vi", "vb", "vmin", "vmax",
    "svw", "svh", "svi", "svb", "svmin", "svmax",
    "lvw", "lvh", "lvi", "lvb", "lvmin", "lvmax",
    "dvw", "dvh", "dvi", "dvb", "dvmin", "dvmax",

    // Container
    "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax",

    // Angle
    "deg", "grad", "rad", "turn",

    // Time
    "s", "ms",

    // Frequency
    "hz", "khz",

    // Resolution
    "dpi", "dpcm", "dppx", "x",

    // Grid flex
    "fr",
]);

type AttachedUnit = {
    authored: string;
    normalized: string;
    length: number;
};

/**
 * Detects a unit immediately attached to an interpolation:
 *
 * `${value}px`
 * `${value}deg`
 * `${value}%`
 */
const readAttachedCSSUnit = (text: string): AttachedUnit | null => {
    const match = /^(%|[a-zA-Z]+)/.exec(text);
    if (!match) return null;

    const authored = match[0];
    const normalized = authored.toLowerCase();

    if (!CSS_DIMENSION_UNITS.has(normalized)) return null;

    return {
        authored,
        normalized,
        length: authored.length,
    };
};

const getCSSUnitFactoryName = (unit: string): string => {
    switch (unit.toLowerCase()) {
        case "%": return "percent";
        case "q": return "Q";
        case "hz": return "Hz";
        case "khz": return "kHz";
        default: return unit.toLowerCase();
    }
};

const createTypedUnitValue = (
    win: any,
    unit: string,
    value = 1,
): any => {
    const CSSNamespace = win.CSS;
    const factoryName = getCSSUnitFactoryName(unit);
    const factory = CSSNamespace?.[factoryName];

    if (typeof factory === "function") {
        return factory.call(CSSNamespace, value);
    }

    const CSSUnitValueCtor = win.CSSUnitValue;
    if (typeof CSSUnitValueCtor !== "function") {
        throw new TypeError(`Typed OM does not support CSS unit "${unit}"`);
    }

    return new CSSUnitValueCtor(
        value,
        unit === "%" ? "percent" : unit,
    );
};

const createTypedUnitProduct = (
    win: any,
    value: any,
    unit: string,
): any => {
    const CSSMathProductCtor = win.CSSMathProduct;
    if (typeof CSSMathProductCtor !== "function") {
        throw new TypeError("CSSMathProduct is not supported");
    }

    return new CSSMathProductCtor(
        value,
        createTypedUnitValue(win, unit, 1),
    );
};

const isDirectTypedUnitProduct = (
    cssValue: string,
    slot: TypedStyleSlot,
): boolean => {
    if (!slot.multipliedByUnit) return false;

    const marker = escapeRegExp(slot.marker);
    const unit = escapeRegExp(slot.multipliedByUnit);

    return new RegExp(
        `^calc\\(\\s*var\\(\\s*${marker}\\s*\\)\\s*\\*\\s*1${unit}\\s*\\)$`,
        "i",
    ).test(cssValue.trim());
};

/*
// NEWER, INLINE STYLES ONLY!!!
export const S = (strings: TemplateStringsArray, ...values: any[]) => {
    const props: string[] = [];
    const vars = new Map<string, any>();
    const slots: TypedStyleSlot[] = [];
    const parts: string[] = [];
    const templateId = typedStyleTemplateId++;

    for (let index = 0; index < strings.length; index++) {
        parts.push(strings[index]);

        if (index >= values.length) continue;

        const value = values[index];

        // Must precede the reactive-object check: CSSUnitValue has .value.
        if (isNativeCSSStyleValue(value)) {
            const marker = `--fest-typed-${templateId}-${slots.length}`;
            slots.push({ marker, value });
            parts.push(`var(${marker})`);
            continue;
        }

        if (
            value != null &&
            typeof value === "object" &&
            "value" in value
        ) {
            const name = `--ref-${vars.size}`;
            parts.push(`var(${name})`);
            props.push(
                `@property ${name} { syntax: "<number>"; initial-value: ${
                    value.value ?? 0
                }; inherits: true; };`,
            );
            vars.set(name, value);
            continue;
        }

        if (typeof value !== "object" && typeof value !== "function") {
            if (value != null && String(value).trim() !== "") {
                parts.push(String(value));
            }
        }
    }

    return [
        (element: HTMLElement) => {
            // No artificial ";" between template fragments.
            applyStyleTemplate(element, parts.join(""), slots);

            const subs: any[] = [];
            for (const [name, value] of vars) {
                subs.push(bindWith(element, name, value, handleStyleChange));
            }

            return () => {
                for (const sub of subs) sub?.();
            };
        },
        props,
        vars,
    ];
};
*/

export const S = (
    strings: TemplateStringsArray,
    ...values: any[]
) => {
    const props: string[] = [];
    const vars = new Map<string, any>();
    const slots: TypedStyleSlot[] = [];
    const parts: string[] = [];
    const templateId = typedStyleTemplateId++;

    // Number of characters already consumed from each static fragment.
    const consumed = new Array(strings.length).fill(0);

    for (let index = 0; index < strings.length; index++) {
        parts.push(strings[index].slice(consumed[index]));

        if (index >= values.length) continue;

        const value = values[index];
        const nextText = strings[index + 1] ?? "";
        const attachedUnit = readAttachedCSSUnit(nextText);

        //
        if (isNativeCSSStyleValue(value)) {
            // Typed OM branch, including attached-unit reconstruction.
        } else
        if (isReactiveStyleValue(value)) {
            // Existing --ref-* branch.\
            const marker = `--fest-typed-${templateId}-${slots.length}`;

            slots.push({
                marker,
                value,
                multipliedByUnit: attachedUnit?.normalized,
            });

            if (attachedUnit) {
                parts.push(
                    `calc(var(${marker}) * 1${attachedUnit.authored})`,
                );

                consumed[index + 1] += attachedUnit.length;
            } else {
                parts.push(`var(${marker})`);
            }

            continue;
        }

        if (
            value != null &&
            typeof value === "object" &&
            "value" in value
        ) {
            const name = `--ref-${vars.size}`;

            if (attachedUnit) {
                parts.push(
                    `calc(var(${name}) * 1${attachedUnit.authored})`,
                );

                consumed[index + 1] += attachedUnit.length;
            } else {
                parts.push(`var(${name})`);
            }

            props.push(
                `@property ${name} { ` +
                `syntax: "<number>"; ` +
                `initial-value: ${value.value ?? 0}; ` +
                `inherits: true; ` +
                `};`,
            );

            vars.set(name, value);
            continue;
        }

        if (
            typeof value !== "object" &&
            typeof value !== "function" &&
            value != null &&
            String(value).trim() !== ""
        ) {
            // Ordinary values retain normal template-string semantics:
            // `${10}px` becomes `10px`, without calc().
            parts.push(String(value));
        }
    }

    return [
        (element: HTMLElement) => {
            applyStyleTemplate(element, parts.join(""), slots);

            const subs: any[] = [];

            for (const [name, value] of vars) {
                subs.push(
                    bindWith(element, name, value, handleStyleChange),
                );
            }

            return () => {
                for (const sub of subs) sub?.();
            };
        },
        props,
        vars,
    ];
};

//
export const css = (strings: TemplateStringsArray, ...values: any[]) =>
    S(strings, ...values);
