/*
 * Filename: index.ts
 * FullPath: modules/projects/lur.e/src/lure/node/jsx-runtime/index.ts
 * Change date and time: 20.24.00_15.08.2026
 * Reason for changes: Export automatic JSX runtime (jsx/jsxs/Fragment) so
 * jsxImportSource=@fest-lib/lure/src/lure/node resolves for TS + Vite.
 * NOTE: jsx-dev-runtime is a symlink to this directory — keep one SoT.
 */
import { E } from "../Bindings";
import { M } from "../Mapped";
import { I } from "../Switched";
import { Q } from "../Queried";
import { bindEvent } from "@fest-lib/core";

/** INVARIANT: Symbol identity is shared via jsx-dev-runtime → jsx-runtime symlink. */
export const Fragment = Symbol.for("fest.jsx.Fragment");

// WHY: Automatic JSX (`react-jsx` / plugin-react) puts children on props.children;
// classic createElement keeps them as trailing args. Support both call shapes.
export const createElement = (type: string | HTMLElement | Node | DocumentFragment | Document | Element | Function | symbol, props: any = {}, children?: any[]|any|null, ...others: any[]|any|null)=>{
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
        if (i !== "children" && i !== "key")
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
    const fromProps = props?.children;
    const $children = Array.isArray(children) ? children :
        (others?.length > 0 ? [children, ...others] :
            (children != null
                ? (((typeof children == "object" || typeof children == "function") && !(children instanceof Node) || children instanceof DocumentFragment) ? children : [children])
                : (fromProps != null ? fromProps : null)));

    //
    if (type == Fragment) { return E(document.createDocumentFragment(), normalized, $children); }
    if (typeof type == "function") { return type(props, $children); }
    if (type == "For") { return M(props, $children); }
    if (type == "Switch") { return I(props, $children); }

    //
    const element = E(type as any, normalized, $children); if (!element) return element;
    Promise.try(()=>{ if (ref) { if (typeof ref == "function") { ref?.(element); } else { ref.value = element; } } })?.catch?.(console.warn.bind(console));
    return element;
}

/** Automatic runtime entry used by TS `jsxImportSource` + Vite plugin-react. */
export const jsx = (type: any, props: any, _key?: any) => createElement(type, props ?? {});
export const jsxs = jsx;
export const jsxDEV = (type: any, props: any, _key?: any, _isStatic?: boolean, _source?: any, _self?: any) => createElement(type, props ?? {});

//
globalThis["createElement"] = createElement;
globalThis["Fragment"] = Fragment;
globalThis["render"] = createElement;
