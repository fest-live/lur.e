import { E } from "../lure/node/Bindings";
import { M } from "../lure/node/Mapped";
import { I } from "../lure/node/Switched";
import { Q } from "../lure/node/Queried";

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
export const createElement = (type: string | HTMLElement | Node | DocumentFragment | Document | Element, props: any = {}, children?: any[]|any|null, ...others: any[]|any|null)=>{
    let normalizedProps: any = {}, key, ref;
    let attributes: any = {}, properties: any = {}, classList: any = {}, style: any = {}, ctrls: any = {}, iterator: any = null, switchKey: any = null, on: any = {};

    //
    for (const i in props) {
        console.log(i, props[i]);
        if (i == 'key') { key = props[i]; } else
        if (i == 'ref') {
            if (typeof type != 'function') {
                ref = typeof props[i] != 'function' ? props[i] : Q(props[i]);
            }
        } else
        if (i == 'classList') { classList = props[i]; } else
        if (i == 'style') { style = props[i]; } else
        if (i == 'iterator') { iterator = props[i]; } else
        if (i == 'switchKey') { switchKey = props[i]; } else

        //
        if (i?.startsWith?.("on:")) { bindEvent(on, i.replace("on:", ""), props[i]); } else
        if (i?.startsWith?.("prop:")) { properties[i.replace("prop:", "")] = props[i]; } else
        if (i?.startsWith?.("attr:")) { attributes[i.replace("attr:", "")] = props[i]; } else
        if (i?.startsWith?.("ctrl:")) { ctrls[i.replace("ctrl:", "")] = props[i]; } else
            { attributes[i.replace("attr:", "")] = props[i]; }
    }

    //
    const $children = Array.isArray(children) ? children : (others?.length > 0 ? [children, ...others] : [children]);

    //
    Object.assign(normalizedProps, {
        attributes,
        properties,
        classList,
        style,
        on,
    });

    //
    if (type == "For" && iterator) {
        return M(iterator, children);
    }
    if (type == "Switch") {
        return I({
            current: switchKey,
            mapped: children,
        });
    }

    //
    console.log(type, $children);
    const element = E(type, normalizedProps, $children);
    Promise.resolve().then(()=>{
        if (ref) { if (typeof ref == "function") { ref?.(element); } else { ref.value = element; } }
    });
    return element;
}
