import { bindWith } from "../lure/core/Binding";
import { handleStyleChange } from "fest/dom";

//
// NEWER, INLINE STYLES ONLY!!!
// string template for CSS values
export const S = (strings: string[], ...values: any[])=>{
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
                parts.push(`${$value}`);
            }
        }
        index++;
    }

    // return a function that applies the style to an element
    return [(element: any)=>{
        element.style.cssText = parts?.join?.(";") ?? element.style.cssText;

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
