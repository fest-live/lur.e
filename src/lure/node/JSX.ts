import { E } from "./Bindings";
import { M } from "./Mapped";
import { I } from "./Switched";
import { Q } from "./Queried";

//
const bindEvent = (on: any, key: string, value: any)=>{
    if (on?.[key] != null) {
        const exists = on[key];
        if (Array.isArray(value)) { exists.add(...value); } else if (typeof value == "function") { exists.add(value); }
        return on;
    }
    on[key] ??= Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value);
    return on;
}

//
export const createElement = (type: string | HTMLElement | Node | DocumentFragment | Document | Element | Function, props: any = {}, children?: any[]|any|null, ...others: any[]|any|null)=>{
    let normalized: any = {}, ref;
    let attributes: any = {}, properties: any = {}, classList: any = {}, style: any = {}, ctrls: any = {}, on: any = {};

    //
    for (const i in props) {
        if (i == 'ref') {
            if (typeof type != 'function') {
                ref = typeof props[i] != 'function' ? props[i] : Q(props[i]);
            }
        } else
        if (i == 'classList') { classList = props[i]; } else
        if (i == 'style') { style = props[i]; } else

        //
        if (i?.startsWith?.("@"))     { const name = i.replace("@", "").trim();   if (name) { bindEvent(on, name, props[i]); } else { on = props[i]; } } else
        if (i?.startsWith?.("on:"))   { const name = i.replace("on:", "").trim(); if (name) { bindEvent(on, name, props[i]); } else { on = props[i]; } } else
        if (i?.startsWith?.("prop:")) { const name = i.replace("prop:", "").trim(); if (name) { properties[name] = props[i]; } else { properties = props[i]; } } else
        if (i?.startsWith?.("attr:")) { const name = i.replace("attr:", "").trim(); if (name) { attributes[name] = props[i]; } else { attributes = props[i]; } } else
        if (i?.startsWith?.("ctrl:")) { const name = i.replace("ctrl:", "").trim(); if (name) { ctrls.set(name, props[i]); } else { ctrls = props[i]; } } else
            { attributes[i.trim()] = props[i]; }
    };

    //
    Object.assign(normalized, {
        attributes,
        properties,
        classList,
        style,
        on,
    });

    //
    const $children = Array.isArray(children) ? children :
        (others?.length > 0 ? [children, ...others] :
            ((typeof children == "object" && !(children instanceof Node) || children instanceof DocumentFragment) ? children : [children]));

    //
    if (typeof type == "function") { return type(props, $children); }
    if (type == "For") { return M(props, $children); }
    if (type == "Switch") { return I(props, $children); }

    //
    const element = E(type, normalized, $children); if (!element) return element;
    Promise.try(()=>{ if (ref) { if (typeof ref == "function") { ref?.(element); } else { ref.value = element; } } })?.catch?.(console.warn.bind(console));
    return element;
}
