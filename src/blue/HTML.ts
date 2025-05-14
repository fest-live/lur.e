import { html } from "./Syntax";

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
    if (str instanceof Node) { return str; }
    return null;
}

//
export default H;
