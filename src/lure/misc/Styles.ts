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
