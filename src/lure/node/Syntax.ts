import { makeReactive, unwrap } from "fest/object";

//
import { getNode } from "../context/Utils";
import E from "./Bindings";
import M from "./Mapped";
import { reflectChildren } from "../context/Reflect";

//
const EMap = new WeakMap(), parseTag = (str) => { const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/); if (!match) return { tag: str, id: null, className: null }; const [, tag = 'div', id, classStr] = match; const className = classStr ? classStr.replace(/\./g, ' ').trim() : null; return { tag, id, className }; }
const findIterator = (element, psh) => { if (element.childNodes.length <= 1 && element.childNodes?.[0]?.nodeType === Node.COMMENT_NODE && element.childNodes?.[0]?.nodeValue.includes("o:")) { const node = element.childNodes?.[0]; if (!node) return; let el: any = psh[Number(node?.nodeValue?.slice(2))]; if (typeof el == "function") return el; } }
const connectElement = (el: HTMLElement|null, atb: any[], psh: any[], mapped: WeakMap<HTMLElement, any>, cmdBuffer: any[], fragment?)=>{
    if (!el) return el;
    if (el != null) {
        const attributes = {};
        // TODO: advanced attributes support
        let style = {}, dataset = {}, properties = {}, on = {}, aria = {}, iterate = [], doAction: any = null, ctrls = new Map(), classList: any = [];
        for (const attr of Array.from(el?.attributes || [])) {
            const isCustom = attr.value?.includes?.("#{");
            const value = isCustom ? atb[parseInt(((attr?.value || "") as string)?.match?.(/^#\{(.+)\}$/)?.[1] ?? "0")] : attr.value;
            if (attr.name == "style" && isCustom) { style = value; } else
            if (attr.name == "classList" || attr.name == "classlist") { classList = value ?? classList; } else
            if (attr.name == "ref") { doAction = value; } else
            if (attr.name == "iterate") { iterate = value; mapped.set(el, mapped.get(el) ?? findIterator(el, psh)); } else
            if (attr.name == "dataset") { dataset = value; } else
            if (attr.name == "properties") { properties = value; } else
            if (attr.name == "aria") { aria = value; } else
            if (attr.name.startsWith("@")) { on[attr.name.trim().replace("@", "").trim()] = Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value); } else
            if (attr.name.startsWith("on:")) { on[attr.name.trim().replace("on:", "").trim()] = Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value); } else
            if (attr.name.startsWith("prop:")) { properties[attr.name.trim().replace("prop:", "").trim()] = value; } else
            if (attr.name.startsWith("ctrl:")) { ctrls.set(attr.name.trim().replace("ctrl:", "").trim(), value); } else { attributes[attr.name.trim()] = value; }
            if (isCustom) { el.removeAttribute(attr.name); };
        }

        //
        if (!EMap.has(el)) { cmdBuffer.push(()=>{
            const ex = E(el, {aria, attributes, classList, dataset, style, properties, on, ctrls}, mapped.has(el) ? M(iterate, mapped.get(el)) : makeReactive(Array.from(el.childNodes)?.map?.((el)=>EMap.get(el)??el)));
            doAction?.(el); EMap.set(el, ex); return ex;
        }); };
    }; return el;
}

//
const removeFromRoot = (node: any, fragment?)=>{
    if (node?.parentNode?.tagName == "TEMPLATE" || node?.parentNode?.tagName == "BODY" || node?.parentNode?.tagName == "HTML") {
        node?.remove?.();
        if (node?.tagName != "TEMPLATE" && node?.tagName != "BODY" && node?.tagName != "HTML") { fragment?.append?.(node); }
    }
}

//
export function html(strings, ...values) { return htmlBuilder({ createElement: null })(strings, ...values); }
export function htmlBuilder({ createElement = null } = {}) {
    return function(strings, ...values) {
        let parts: string[] = [];
        const psh: any[] = [], atb: any[] = [];
        for (let i = 0; i < strings.length; i++) {
            parts.push(strings?.[i] || "");
            if (i < values.length) {
                if (strings[i]?.trim()?.endsWith?.("<")) {
                    const dat = parseTag(values?.[i]);
                    parts.push((dat.tag || "div"));
                    if (dat.id) parts.push(` id="${dat.id}"`);
                    if (dat.className) parts.push(` class="${dat.className}"`);
                } else {
                    const $betweenQuotes = strings[i]?.trim()?.match(/^['"]/) && (strings[i+1]?.trim()?.match?.(/['"]$/) ?? true);
                    const $stylePattern = strings[i]?.trim()?.startsWith?.(";"); const $pt = strings[i+1]?.search?.(/^[\s\n\r\>]/);
                    const $attributePattern = strings[i]?.trim()?.endsWith?.("=") && ($pt != null ? $pt : true);
                    const isAttr = ($stylePattern || $attributePattern || $betweenQuotes);
                    const psi = psh.length, ati = atb.length; parts.push(isAttr ? `"#{${ati}}"` : `<!--o:${psi}-->`);
                    if (values?.[i] != null) { (isAttr ? atb : psh).push(values?.[i]); };
                }
            }
        }

        //
        const mapped = new WeakMap(), cmdBuffer: any[] = [];
        const parser = new DOMParser(), doc = parser.parseFromString(parts.join("").trim(), "text/html"), template = (doc.querySelector("template")?.content ?? doc.body), walker: any = template ? document.createTreeWalker(template, NodeFilter.SHOW_ALL, null) : null;
        const fragment = document.createDocumentFragment(); //template instanceof DocumentFragment ? template : document.createDocumentFragment();
        do {
            const node: any = walker.currentNode;
            if (node.nodeType === Node.ELEMENT_NODE) {
                cmdBuffer.push(()=>{ removeFromRoot(node, fragment); });
                connectElement(node as HTMLElement, atb, psh, mapped, cmdBuffer, fragment);
            } else
            if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.includes("o:")) {
                let el: any = psh[Number(node.nodeValue.slice(2))];

                // make iteratable array and set
                if (typeof el == "function") {
                    removeFromRoot(node, fragment);
                    if (node?.parentNode?.getAttribute?.("iterate") || node?.parentNode?.childNodes?.length <= 1)
                        { cmdBuffer.push(()=>{ node?.remove?.(); }); mapped.set(node?.parentNode, el); }
                } else {
                    removeFromRoot(node, fragment);
                    cmdBuffer.push(()=>{
                        if (Array.isArray(unwrap(el)))
                            { const $parent = node?.parentNode; node?.remove?.(); reflectChildren($parent, el); } else
                            {
                                const n = getNode(el);
                                if (el == null || el === false || n == null) { node?.remove?.(); } else { node?.replaceWith?.(n); }
                            }
                    });
                }
            }
        } while (walker?.nextNode?.());

        //
        cmdBuffer.forEach((c)=>c?.()); // @ts-ignore
        if (fragment instanceof DocumentFragment) { return (Array.from(fragment?.childNodes)?.length > 1 ? fragment : fragment?.childNodes?.[0]); } else // @ts-ignore
        if (fragment?.childNodes?.length > 1) { const frag = document.createDocumentFragment(); frag?.append?.(...Array.from(fragment.childNodes).filter((e:any)=>(e!=null)) as any); return frag; } // @ts-ignore
        return fragment?.childNodes?.[0];
    };
}

//
export const H = (str: any, ...values: any[])=>{
    if (typeof str == "string") {
        if (str?.trim?.()?.startsWith?.("<")) {
            const parser = new DOMParser(), doc = parser.parseFromString(str, "text/html");
            const basis  = doc.querySelector("template")?.content ?? doc.body;
            if (basis instanceof DocumentFragment) { return basis; }
            if (basis?.childNodes?.length > 1) { const frag = document.createDocumentFragment(); frag.append(...Array.from(basis?.childNodes));  return frag; }
            return basis?.childNodes?.[0] ?? new Text(str);
        }
        return new Text(str);
    } else
    if (typeof str == "function") { return H(str?.()); } else
    if (Array.isArray(str) && values) { return html(str, ...values); } else
    if (str instanceof Node) { return str; }; return null;
}
