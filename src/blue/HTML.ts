import { html } from "./Syntax";

//
export const H = (str: any, ...values: any[])=>{
    if (typeof str == "string") {
        const parser = new DOMParser();
        const doc    = parser.parseFromString(str, "text/html");
        if (doc.body.childNodes.length > 1) {
            const frag   = document.createDocumentFragment();
            frag.append(...Array.from(doc.body.childNodes)); return frag;
        }
        return doc.body.childNodes[0];
    } else
    if (typeof str == "function") { return str?.(); } else
    if (Array.isArray(str) && values) { return html(str, values); } else
    if (str instanceof Node) { return str; }
    return "";
}

//
export default H;
