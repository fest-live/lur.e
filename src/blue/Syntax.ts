//
import E, { T } from "./Element"

//
export function html(strings, ...values) { return htmlBuilder({ createElement: null })(strings, ...values); }
export function htmlBuilder({ createElement = null } = {}) {
    return function(strings, ...values) {
        //
        let parts = [];
        const psh = [], atb = [];
        for (let i = 0; i < strings.length; i++) {
            parts.push(strings?.[i] || "");
            if (i < values.length) {
                const isAttr = strings[i]?.endsWith?.("=") && (strings[i+1]?.startsWith?.(" ") || strings[i+1]?.startsWith?.(">"));
                const psi = psh.length, ati = atb.length; parts.push(isAttr ? `"#{${ati}}"` : `<!--o:${psi}-->`);
                if (values?.[i] != null) { (isAttr ? atb : psh).push(values?.[i]); };
            }
        }

        //
        const parser = new DOMParser();
        const doc = parser.parseFromString(parts.join("").trim(), "text/html");
        const fragment = doc.body.firstChild;

        //
        const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ALL, null, false);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.startsWith("o:")) {
                let el: any = psh[Number(node.nodeValue.slice(2))];
                if (Array.isArray(el)) { el = el.flat(Infinity); }

                //
                if (typeof el == "object" && "element" in el) { node.replaceWith(el.element); } else
                if (el instanceof Node) { node.replaceWith(el); } else
                if (Array.isArray(el) && el.every((v) => v instanceof Node) ) { node.replaceWith(...el); } else
                if (el == null || el === false) { node.remove(); } else
                    { node.replaceWith(T(el)); } // text-node
            }
        }

        //
        if (fragment?.nodeType === Node.ELEMENT_NODE) {
            const el = fragment;
            const attributes = {};
            if (el != null) {
                // TODO: advanced attributes support
                for (const attr of el.attributes) {
                    { attributes[attr.name] = attr.value?.startsWith("#{") ? atb[parseInt(attr.value.match(/^#\{(.+)\}$/)?.[1])] : attr.value; }
                }

                //
                return E(el, {attributes}, Array.from(el.childNodes));
            }
        }

        //
        return fragment;
    };
}
