import { makeReactive, unwrap } from "fest/object";

//
import { getNode } from "../context/Utils";
import E from "./Bindings";
import M from "./Mapped";
import { reflectChildren } from "../context/ReflectChildren";

//
const EMap = new WeakMap(), parseTag = (str) => { const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/); if (!match) return { tag: str, id: null, className: null }; const [, tag = 'div', id, classStr] = match; const className = classStr ? classStr.replace(/\./g, ' ').trim() : null; return { tag, id, className }; }

//
const preserveWhitespaceTags = new Set(["PRE", "TEXTAREA", "SCRIPT", "STYLE"]);
const cleanupInterTagWhitespace = (root: Node) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const queue: Text[] = [];
    // Walk and collect whitespace-only text nodes for removal
    // Preserve whitespace in certain tags like <pre>, <textarea>, <script>, <style>
    while (walker.nextNode()) {
        const t = walker.currentNode as Text;
        const parent: any = t?.parentNode;
        if (!parent || preserveWhitespaceTags.has(parent?.tagName)) continue;
        if (/^\s+$/.test(t?.nodeValue?.trim?.() || "") || !t?.textContent?.trim?.()) queue.push(t);
    }
    for (const t of queue) t?.remove?.();
}

//
const findIterator = (element, psh) => { if (element.childNodes.length <= 1 && element.childNodes?.[0]?.nodeType == Node.COMMENT_NODE && element.childNodes?.[0]?.nodeValue.includes("o:")) { const node = element.childNodes?.[0]; if (!node) return; let el: any = psh[Number(node?.nodeValue?.slice(2))]; if (typeof el == "function") return el; } }

//
const connectElement = (el: HTMLElement|null, atb: any[], psh: any[], mapped: WeakMap<HTMLElement, any>, cmdBuffer: any[], fragment?: DocumentFragment)=>{
    if (!el) return el;
    if (el != null) {
        const attributes = {};
        // TODO: advanced attributes support
        const datasetIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "dataset" && attr.value?.includes?.("#{")));
        const styleIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "style" && attr.value?.includes?.("#{")));
        const classListIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "classList" && attr.value?.includes?.("#{")));
        const visibleIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "visible" && attr.value?.includes?.("#{")));
        const ariaIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "aria" && attr.value?.includes?.("#{")));
        const onIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "on" && attr.value?.includes?.("#{")));
        const propIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "properties" && attr.value?.includes?.("#{")));
        const ctrlsIndex = Array.from(el?.attributes || []).findIndex((attr)=>(attr.name == "ctrls" && attr.value?.includes?.("#{")));

        //
        let style = atb[styleIndex], dataset = atb[datasetIndex], properties: any = atb[propIndex] ?? {}, on = atb[onIndex] ?? {}, aria = atb[ariaIndex] ?? {}, iterate = [], doAction: any = null, ctrls = new Map(), classList: any = atb[classListIndex], visible: any = atb[visibleIndex];

        //
        if (propIndex != -1) { atb.splice(propIndex, 1); };
        if (datasetIndex != -1) { atb.splice(datasetIndex, 1); };
        if (styleIndex != -1) { atb.splice(styleIndex, 1); };
        if (classListIndex != -1) { atb.splice(classListIndex, 1); };
        if (visibleIndex != -1) { atb.splice(visibleIndex, 1); };
        if (ariaIndex != -1) { atb.splice(ariaIndex, 1); };
        if (onIndex != -1) { atb.splice(onIndex, 1); };
        if (ctrlsIndex != -1) { atb.splice(ctrlsIndex, 1); };

        //
        for (const attr of Array.from(el?.attributes || [])) {
            const isCustom = attr.value?.includes?.("#{");
            const value = isCustom ? atb[parseInt(((attr?.value || "") as string)?.match?.(/^#\{(.+)\}$/)?.[1] ?? "0")] : attr.value;
            if (attr.name == "classList" || attr.name == "classlist") { classList = value ?? classList; } else
            if (attr.name == "ref") { doAction = value; } else
            if (attr.name == "iterate") { iterate = value; mapped.set(el, mapped.get(el) ?? findIterator(el, psh)); } else
            if (attr.name == "value") { properties.value = value; } else
            if (attr.name?.trim?.()?.startsWith?.("@")) { on[attr.name.trim().replace("@", "").trim()] = Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value); } else
            if (attr.name?.trim?.()?.startsWith?.("on:")) { on[attr.name.trim().replace("on:", "").trim()] = Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value); } else
            if (attr.name?.trim?.()?.startsWith?.("prop:")) { properties[attr.name.trim().replace("prop:", "").trim()] = value; } else
            if (attr.name?.trim?.()?.startsWith?.("ctrl:")) { ctrls.set(attr.name.trim().replace("ctrl:", "").trim(), value); } else { attributes[attr.name.trim()] = value; }
            if (isCustom) { el.removeAttribute(attr.name); };
        }

        //
        if (!EMap.has(el)) {
            cmdBuffer.push(() => { // @ts-ignore
            const ex = E(el, {aria, attributes, classList, dataset, style, properties, on, ctrls, visible}, mapped.has(el) ? M(iterate, mapped.get(el)) : makeReactive(Array.from(el.childNodes)?.map?.((el)=>EMap.get(el)??el)));
            if (typeof doAction == "function") { doAction?.(el); } else if (doAction != null && typeof doAction == "object") { doAction.value = el; }
            if (el != ex) { EMap.set(el, ex); }; return ex;
        }); };
    }; return el;
}

//
const removeFromRoot = (node: any, fragment?: DocumentFragment)=>{
    if (node?.parentNode?.tagName == "TEMPLATE" || node?.parentNode?.tagName == "BODY" || node?.parentNode?.tagName == "HTML") {
        node?.remove?.();
        if (node?.tagName != "TEMPLATE" && node?.tagName != "BODY" && node?.tagName != "HTML") { fragment?.append?.(node); }
    }
}

//
export function html(strings, ...values) { return htmlBuilder({ createElement: null })(strings, ...values); };

//
const checkInsideTagBlock = (contextParts: string[], ...str: string[]) => {
    const current = str?.[0] ?? "";
    const idx = contextParts.indexOf(current);
    // Fallback simple heuristic if index not found
    if (idx < 0) {
        const tail = (str?.join?.("") ?? "");
        return /<([A-Za-z\/!?])[\w\W]*$/.test(tail) && !/>[\w\W]*$/.test(tail);
    }

    // Scan all static parts up to and including the current part
    const prefix = contextParts.slice(0, idx + 1).join("");
    let inTag = false, inSingle = false, inDouble = false;

    for (let i = 0; i < prefix.length; i++) {
        const ch = prefix[i];
        const next = prefix[i + 1] ?? '';

        if (!inTag) {
            if (ch === '<') {
                // Treat as a tag only if followed by a likely opener: letter, '/', '!', or '?'
                if (/[A-Za-z\/!?]/.test(next)) {
                    inTag = true; inSingle = false; inDouble = false;
                }
            }
            continue;
        }

        if (!inSingle && !inDouble) {
            if (ch === '"') { inDouble = true; continue; }
            if (ch === "'") { inSingle = true; continue; }
            if (ch === '>') { inTag = false; continue; }
        } else if (inDouble) {
            if (ch === '"') { inDouble = false; continue; }
        } else if (inSingle) {
            if (ch === "'") { inSingle = false; continue; }
        }
    }

    return inTag;
}

//
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
                    // sequences such as inside of `<...>`
                    const $inTagOpen = checkInsideTagBlock(strings, strings?.[i] || "", strings?.[i + 1] || "");

                    //
                    const $afterEquals = /[\w:\-\.\]]\s*=\s*$/.test(strings[i]?.trim?.() ?? "") || strings[i]?.trim?.()?.endsWith?.("=");

                    //
                    const $isQuoteBegin = strings[i]?.trim?.()?.match?.(/['"]$/);
                    const $isQuoteEnd = strings[i + 1]?.trim?.()?.match?.(/^['"]/) ?? $isQuoteBegin;

                    //
                    const $betweenQuotes = ($isQuoteBegin && $isQuoteEnd);
                    const $attributePattern = $afterEquals;

                    //
                    const isAttr = ($attributePattern || $betweenQuotes) && $inTagOpen;
                    if (isAttr) {
                        const $needsToQuoteWrap = ($attributePattern && !($betweenQuotes));
                        const ati = atb.length;
                        parts.push($needsToQuoteWrap ? `"#{${ati}}"` : `#{${ati}}`);
                        atb.push(values?.[i]);
                    } else
                        if (!$inTagOpen) {
                            const psi = psh.length;
                            parts.push(`<!--o:${psi}-->`);
                            psh.push(values?.[i]);
                        }
                }
            }
        }

        //
        const mapped = new WeakMap(), cmdBuffer: any[] = [];
        const parser = new DOMParser(), doc: any = parser.parseFromString(parts.join("").trim(), "text/html");

        //
        let template: any = (((doc instanceof HTMLTemplateElement || doc?.matches?.("template")) ? doc : doc.querySelector("template"))?.content ?? doc.body);
        if (template instanceof HTMLBodyElement) {
            const children = Array.from(template.childNodes).filter((e: any) => (e != null));
            template = document.createDocumentFragment();
            template.append(...children);
        }

        // Clean up whitespace-only text nodes between tags before further processing
        cleanupInterTagWhitespace(template);

        //
        const walker: any = template ? document.createTreeWalker(template, NodeFilter.SHOW_ALL, null) : null;
        const fragment = template instanceof DocumentFragment ? template : document.createDocumentFragment();
        do {
            const node: any = walker.currentNode;

            if (node.nodeType == Node.ELEMENT_NODE) {
                connectElement(node as HTMLElement, atb, psh, mapped, cmdBuffer, fragment);
            } else
            if (node.nodeType == Node.COMMENT_NODE && node.nodeValue.includes("o:")) {
                let el: any = psh[Number(node.nodeValue.slice(2))];

                // make iteratable array and set
                if (typeof el == "function") {
                    if (node?.parentNode?.getAttribute?.("iterate") || node?.parentNode?.childNodes?.length <= 1) {
                        cmdBuffer.push(() => { node?.remove?.(); });
                        mapped.set(node?.parentNode, el);
                    } else {
                        // Fallback: render function result inline (supports placeholders within mixed content)
                        cmdBuffer.push(() => {
                            const result = el?.();
                            if (Array.isArray(unwrap(result))) {
                                const $parent = node?.parentNode; node?.remove?.(); reflectChildren($parent, result);
                            } else {
                                const n = getNode(result);
                                if (n == null) { node?.remove?.(); } else { node?.replaceWith?.(n); }
                            }
                        });
                    }
                } else {
                    cmdBuffer.push(() => {
                        if (Array.isArray(unwrap(el)))
                        { const $parent = node?.parentNode; node?.remove?.(); reflectChildren($parent, el); } else
                        {
                            const n = getNode(el); if (typeof el == "object" && el != null) el.boundParent ??= (!(n?.parentParent instanceof DocumentFragment) ? n?.parentParent : null) ?? (!(n?.parentParent instanceof DocumentFragment) ? node?.parentParent : null) ?? el.boundParent; if (n == null) { node?.remove?.(); } else { node?.replaceWith?.(n); }
                        }
                    });
                }
            }
        } while (walker?.nextNode?.());

        //
        cmdBuffer?.forEach?.((c) => c?.());
        // Final whitespace cleanup to ensure :empty works even after dynamic insertions
        cleanupInterTagWhitespace(template); // @ts-ignore
        if (fragment instanceof DocumentFragment) {
            return (Array.from(fragment?.childNodes)?.length > 1 ? fragment : fragment?.childNodes?.[0]);
        } else // @ts-ignore
            if (fragment?.childNodes?.length > 1) { // @ts-ignore
                const frag = fragment instanceof DocumentFragment ? fragment : document.createDocumentFragment(); // @ts-ignore
                if (frag != fragment) { frag?.append?.(...Array.from(fragment.childNodes).filter((e: any) => (e != null)) as any); }
                return frag;
            }

        // @ts-ignore
        return (fragment?.childNodes?.[0] ?? fragment);
    };
}

//
export const H = (str: any, ...values: any[])=>{
    if (typeof str == "string") {
        if (str?.trim?.()?.startsWith?.("<")) {
            const parser = new DOMParser(), doc = parser.parseFromString(str, "text/html");
            const basis  = doc.querySelector("template")?.content ?? doc.body;
            // Normalize and clean whitespace-only text nodes between tags
            if (basis instanceof HTMLBodyElement) {
                const frag = document.createDocumentFragment();
                frag.append(...Array.from(basis.childNodes));
                cleanupInterTagWhitespace(frag);
                return (Array.from(frag.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0]);
            } else {
                cleanupInterTagWhitespace(basis);
            }
            if (basis instanceof DocumentFragment) { return basis; }
            if (basis?.childNodes?.length > 1) { const frag = document.createDocumentFragment(); frag.append(...Array.from(basis?.childNodes));  return frag; }
            return basis?.childNodes?.[0] ?? new Text(str);
        }
        return new Text(str);
    } else
    if (typeof str == "function") { return H(str?.()); } else
    if (Array.isArray(str) && values) { return html(str, ...values); } else
                if (str instanceof Node) { cleanupInterTagWhitespace(str); return str; }; return null;
}

//
export default H;
