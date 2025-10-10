import { makeReactive, unwrap } from "fest/object";

//
import { getNode } from "../context/Utils";
import E from "./Bindings";
import M from "./Mapped";
import { reflectChildren } from "../context/ReflectChildren";
import { $mapped } from "../core/Binding";

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
const bindEvent = (on, key, value)=>{
    if (on?.[key]) {
        const exists = on[key];
        if (Array.isArray(value)) { exists.add(...value); } else if (typeof value == "function") { exists.add(value); }
        return on;
    }
    on[key] ??= Array.isArray(value) ? new Set(value) : (typeof value == "function" ? new Set([value]) : value);
    return on;
}


//
const connectElement = (el: HTMLElement | null, atb: any[], psh: any[], mapped: WeakMap<HTMLElement, any>) => {
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
        let
            style = atb[styleIndex],
            dataset = atb[datasetIndex],
            properties: any = atb[propIndex] ?? {},
            on = atb[onIndex],
            aria = atb[ariaIndex] ?? {},
            doAction: any = null,
            ctrls = new Map(),
            classList: any = atb[classListIndex],
            visible: any = atb[visibleIndex];

        //
        for (const attr of Array.from(el?.attributes || [])) {
            const isCustom = attr.value?.includes?.("#{");
            const value = isCustom ? atb[parseInt(((attr?.value || "") as string)?.match?.(/^#\{(.+)\}$/)?.[1] ?? "0")] : attr.value;
            if (attr.name == "classList" || attr.name == "classlist") { classList = value ?? classList; } else
            if (attr.name == "ref") { doAction = value; } else
            if (attr.name == "value") { properties.value = value; } else
            if (attr.name?.trim?.()?.startsWith?.("@")) { if (!on) on = {}; bindEvent(on, attr.name.trim().replace("@", "").trim(), value); } else
            if (attr.name?.trim?.()?.startsWith?.("on:")) { if (!on) on = {}; bindEvent(on, attr.name.trim().replace("on:", "").trim(), value); } else
            if (attr.name?.trim?.()?.startsWith?.("prop:")) { properties[attr.name.trim().replace("prop:", "").trim()] = value; } else
            if (attr.name?.trim?.()?.startsWith?.("ctrl:")) { ctrls.set(attr.name.trim().replace("ctrl:", "").trim(), value); } else
            { attributes[attr.name.trim()] = value; }
            if (isCustom) { el.removeAttribute(attr.name); };
        }

        //
        if (!EMap.has(el)) {
            const ex = E(el, {aria, dataset, attributes, classList, style, properties, on, ctrls, visible});
            if (typeof doAction == "function") { doAction?.(el); } else if (doAction != null && typeof doAction == "object") { doAction.value = el; }
            if (el != ex) { EMap.set(el, ex); }; return ex;
        };
    }; return el;
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
const isValidParent = (parent: Node) => {
    return (parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || (parent instanceof HTMLBodyElement && parent != document.body)));
}

//
const IS_PRIMITIVE = (value: any) => {
    return value == null || typeof value == "string" || typeof value == "number" || typeof value == "boolean";
}

//
const replaceNode = (parent: Node, node: Node, el: any) => {
    if (el != null) { el.boundParent = parent; }

    //
    let newNode = getNode(el, null, -1, parent);
    if (newNode instanceof Node) {
        if (newNode?.parentNode != parent && !newNode?.contains?.(parent)) {
            (node as any)?.replaceWith?.(newNode);
        }
    } else {
        (node as any)?.remove?.();
    }
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
                        parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? (($needsToQuoteWrap ? `"#{${ati}}"` : `#{${ati}}`)) : "");
                        atb.push(values?.[i]);
                    } else
                    if (!$inTagOpen) {
                        const psi = psh.length;
                        parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? (IS_PRIMITIVE(values?.[i]) ? String(values?.[i])?.trim?.() : `<!--o:${psi}-->`) : "");
                        psh.push(values?.[i]);
                    }
                }
            }
        }

        //
        const mapped = new WeakMap();
        const parser = new DOMParser(), doc: any = parser.parseFromString(parts.join("").trim(), "text/html");

        //
        const isTemplate = doc instanceof HTMLTemplateElement || doc?.matches?.("template");
        let sources: any = (isTemplate ? doc : doc.querySelector("template"))?.content ?? (doc.body ?? doc);

        // Clean up whitespace-only text nodes between tags before further processing
        cleanupInterTagWhitespace(sources);

        //
        const frag = document.createDocumentFragment();
        const bucket = Array.from(sources.childNodes)?.filter((e: any) => {
            return e instanceof Node;
        }).map((node: any)=>{
            cleanupInterTagWhitespace(node);
            if (!isValidParent(node?.parentNode) && node?.parentNode != frag) {
                node?.remove?.();
                frag?.append?.(node);
            }
            return node;
        });

        //
        let walkedNodes: any[] = [];
        bucket.forEach((nodeSet: any)=>{
            cleanupInterTagWhitespace(nodeSet);
            const walker: any = nodeSet ? document.createTreeWalker(nodeSet, NodeFilter.SHOW_ALL, null) : null;
            do {
                const node: any = walker?.currentNode;
                walkedNodes.push(node);
            } while (walker?.nextNode?.());
        });

        //
        walkedNodes?.filter((node: any)=>node.nodeType == Node.COMMENT_NODE)?.forEach((node: any)=>{
            if (node.nodeValue.includes("o:")) {
                let el: any = psh[Number(node.nodeValue.slice(2))];

                // make iteratable array and set
                if (el == null || el === undefined || el?.trim?.() == "") {
                    node?.remove?.();
                } else {
                    const $parent = node?.parentNode;
                    if (Array.isArray(el)) {
                        replaceNode?.($parent, node, el = M(el, null, $parent));
                    } else {
                        replaceNode?.($parent, node, el);
                    }
                }
            }
        });

        //
        walkedNodes?.filter((node: any)=>node.nodeType == Node.ELEMENT_NODE)?.map?.((node)=>{
            connectElement(node as HTMLElement, atb, psh, mapped);
        });

        // Final whitespace cleanup to ensure :empty works even after dynamic insertions
        cleanupInterTagWhitespace(frag); // @ts-ignore
        return Array.from(frag?.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
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
