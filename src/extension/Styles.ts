import { bindWith } from "../lure/core/Binding";
import { handleStyleChange } from "fest/dom";

// string template for CSS values
export const S = (strings: string[], ...values: any[])=>{
    // extract possible reactive values
    const refValues = new Map<number, any>();

    //
    let index = 0, counter = 0;
    const parts: string[] = [];
    for (const string of strings) {
        parts.push(string);
        const $isValid = strings[index+1]?.trim?.()?.startsWith?.(";");
        if ($isValid) {
            parts.push(`var(--ref-${counter})`);
            refValues.set(counter, values?.[index]);
            counter++;
        }
        index++;
    }

    // return a function that applies the style to an element
    return (element: any)=>{
        element.style.cssText = parts?.join?.(";") ?? element.style.cssText;

        // apply reactive values
        const subs: any[] = [];
        for (const [index, value] of refValues) {
            subs.push(bindWith(element, `--ref-${index}`, value, handleStyleChange));
        }

        // return a function that unsubscribes the reactive values
        return ()=>{
            for (const sub of subs) {
                sub?.();
            }
        }
    }
};
