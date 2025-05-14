import observableArray from "./Array";
import { getNode } from "./DOM";
import E from "./Element"
import M from "./Mapped";

//
const EMap = new WeakMap();
const parseTag = (str) => { const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/); if (!match) return { tag: str, id: null, className: null }; const [, tag = 'div', id, classStr] = match; const className = classStr ? classStr.replace(/\./g, ' ').trim() : null; return { tag, id, className }; }
const connectElement = (el: HTMLElement|null, atb: any[], psh: any[], mapped: WeakMap<HTMLElement, any>)=>{
    if (!el) return el;
    const attributes = {};
    if (el != null) {
        // TODO: advanced attributes support
        let style = "", dataset = {}, properties = {}, on = {}, aria = {}, iterate = [];
        for (const attr of Array.from(el.attributes)) {
            const isCustom = attr.value?.startsWith("#{");
            const value = isCustom ? atb[parseInt(((attr?.value || "") as string)?.match(/^#\{(.+)\}$/)?.[1] || "0")] : attr.value;

            // Symbol '@' for other framework-based compatibility
            if (attr.name == "style") { style = value; } else
            if (attr.name == "dataset") { dataset = value; } else
            if (attr.name == "iterate") { iterate = value; } else
            if (attr.name == "dataset") { dataset = value; } else
            if (attr.name == "properties") { properties = value; } else
            if (attr.name == "aria") { aria = value; } else
            if (attr.name.startsWith("@")) { on[attr.name.trim().replace("@", "").trim()] = Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value); } else
            if (attr.name.startsWith("on:")) { on[attr.name.trim().replace("on:", "").trim()] = Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value); } else
            if (attr.name.startsWith("prop:")) { properties[attr.name.trim().replace("prop:", "").trim()] = value; } else
                { attributes[attr.name.trim()] = value; }

            //
            if (isCustom) { el.removeAttribute(attr.name); };
        }

        //
        const ex = E(el, {aria, attributes, dataset, style, properties, on}, mapped.has(el) ? M(iterate, mapped.get(el)) : observableArray(Array.from(el.childNodes)?.map?.((el)=>EMap.get(el)??el)));
        EMap.set(el, ex); return ex?.element ?? el;
    }
    return el;
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
                    const isAttr = strings[i]?.trim()?.endsWith?.("=") && (strings[i+1]?.search?.(/^[\s\n\r\>]/) != null);
                    const psi = psh.length, ati = atb.length; parts.push(isAttr ? `"#{${ati}}"` : `<!--o:${psi}-->`);
                    if (values?.[i] != null) { (isAttr ? atb : psh).push(values?.[i]); };
                }
            }
        }

        //
        const mapped = new WeakMap();
        const parser = new DOMParser(), doc = parser.parseFromString(parts.join("").trim(), "text/html"), fragment = doc.body, walker: any = fragment ? document.createTreeWalker(fragment, NodeFilter.SHOW_ALL, null) : null;
        while (walker?.nextNode?.()) {
            const node: any = walker.currentNode;
            if (node.nodeType === Node.ELEMENT_NODE) {
                connectElement(node as HTMLElement, atb, psh, mapped);
            } else
            if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.startsWith("o:")) {
                let el: any = psh[Number(node.nodeValue.slice(2))];

                // make iteratable array and set
                if (typeof el == "function") { if (node.parentNode?.getAttribute?.("iterate")) { node.remove(); mapped.set(node.parentNode, el); } else { node.replaceWith(getNode(el?.())); } } else
                if (el == null || el === false) { node.remove(); } else { node.replaceWith(getNode(Array.isArray(el) ? M(el) : el)); } // text-node
            }
        }

        //
        const frag = fragment.childNodes.length > 0 ? document.createDocumentFragment() : null;
        frag?.append?.(...Array.from(fragment.childNodes).map((e: any)=>connectElement(e, atb, psh, mapped)).filter((e:any)=>(e!=null)) as any);
        return fragment.childNodes.length > 0 ? frag : connectElement(fragment?.firstChild as any, atb, psh, mapped);
    };
}
