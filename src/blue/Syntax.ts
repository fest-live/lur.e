//
import E, { T } from "./Element"
import M from "./Mapped";

//
export function html(strings, ...values) { return htmlBuilder({ createElement: null })(strings, ...values); }
export function htmlBuilder({ createElement = null } = {}) {
    return function(strings, ...values) {
        let parts = [];
        const psh = [], atb = [];
        for (let i = 0; i < strings.length; i++) {
            parts.push(strings?.[i] || "");
            if (i < values.length) {
                const isAttr = strings[i]?.trim()?.endsWith?.("=") && (strings[i+1]?.startsWith?.(" ") || strings[i+1]?.trim()?.startsWith?.(">"));
                const psi = psh.length, ati = atb.length; parts.push(isAttr ? `"#{${ati}}"` : `<!--o:${psi}-->`);
                if (values?.[i] != null) { (isAttr ? atb : psh).push(values?.[i]); };
            }
        }

        //
        const parser = new DOMParser();
        const doc = parser.parseFromString(parts.join("").trim(), "text/html");
        const fragment = doc.body.firstChild;

        //
        const mapped = new WeakMap();
        const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ALL, null, false);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.startsWith("o:")) {
                let el: any = psh[Number(node.nodeValue.slice(2))];

                // make iteratable array and set
                if (typeof el == "function") { if (node.parentNode?.getAttribute?.("iterate")) { node.remove(); mapped.set(node.parentNode, el); } else { node.replaceWith(el?.() || ""); } } else
                if (typeof el == "object" && "element" in el) { node.replaceWith(el.element); } else
                if (el instanceof Node) { node.replaceWith(el); } else
                if (Array.isArray(el))  { node.replaceWith(M(el)?.element); } else
                if (el == null || el === false) { node.remove(); } else
                    { node.replaceWith(T(el)?.element); } // text-node
            }
        }

        //
        if (fragment?.nodeType === Node.ELEMENT_NODE) {
            const el = fragment as HTMLElement;
            const attributes = {};
            if (el != null) {
                // TODO: advanced attributes support
                let style = "", dataset = {}, properties = {}, on = {}, iterate = [];
                for (const attr of el.attributes) {
                    const isCustom = attr.value?.startsWith("#{");
                    const value = isCustom ? atb[parseInt(attr.value.match(/^#\{(.+)\}$/)?.[1])] : attr.value;

                    //
                    if (attr.name == "style") { style = value; } else
                    if (attr.name == "dataset") { dataset = value; } else
                    if (attr.name == "iterate") { iterate = value; } else
                    if (attr.name.startsWith("on:")) { on[attr.name.replace("on:", Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value))] } else
                    //if (attr.name.startsWith("data-")) { dataset[attr.name.replace("data-", "")] = value; } else
                    if (attr.name.startsWith("prop:")) { properties[attr.name.replace("prop:", "")] = value; } else
                        { attributes[attr.name] = value; }

                    //
                    if (isCustom) { el.removeAttribute(attr.name); };
                }

                //
                return E(el, {attributes, dataset, style, properties, on}, mapped.has(el) ? M(iterate, mapped.get(el)) : Array.from(el.childNodes))?.element;
            }
        }

        //
        return fragment;
    };
}
