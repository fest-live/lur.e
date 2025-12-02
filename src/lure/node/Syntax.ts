import { bindEvent, hasValue, isPrimitive } from "fest/core";
import { getNode } from "../context/Utils";
import { E } from "./Bindings";
import { M } from "./Mapped";
import { isElement } from "fest/dom";
import { checkInsideTagBlock, cleanupInterTagWhitespaceAndIndent } from "./Normalizer";

//
const EMap = new WeakMap(), parseTag = (str) => { const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/); if (!match) return { tag: str, id: null, className: null }; const [, tag = 'div', id, classStr] = match; const className = classStr ? classStr.replace(/\./g, ' ').trim() : null; return { tag, id, className }; }
const preserveWhitespaceTags = new Set(["PRE", "TEXTAREA", "SCRIPT", "STYLE"]);

//
const parseIndex = (value: string | any | null): number => {
    if (typeof value != "string" || !value?.trim?.()) return -1;
    const match = value.match(/^#{(\d+)}$/);
    return match ? parseInt(match?.[1] ?? "-1") : -1;
}

//
const connectElement = (el: HTMLElement | null, atb: any[], psh: any[], mapped: WeakMap<HTMLElement, any>) => {
    if (!el) return el;
    if (el != null) {
        const entriesIdc: [string, number][] = [];
        const addEntryIfExists = (name: string): [string, any] => {
            const attr = Array.from(el?.attributes || []).find((attr) => (attr.name == name && attr.value?.includes?.("#{")));
            if (attr) {
                const pair: [string, any] = [name, parseIndex(attr?.value) ?? -1];
                entriesIdc.push(pair); return pair;
            }
            return [name, -1];
        }

        //
        const specialEntryNames = ["dataset", "style", "classList", "visible", "aria", "value", "ref"];
        specialEntryNames.forEach((name) => addEntryIfExists(name));

        //
        const makeEntries = (startsWith: string[] | string, except: string[] | string): [string, any][] => {
            const entries: [string, any][] = [];
            for (const attr of Array.from(el?.attributes || [])) {
                // needs review startsWith with "" i.e. attributes itself, just #{}
                const allowedNoPrefix: boolean = (Array.isArray(startsWith) ? startsWith?.some?.((str: string)=>str=="") : (startsWith == ""));
                const prefix: string = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : (startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") as string) ?? "";
                const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
                const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
                const atbIndex = parseIndex(attr?.value);
                const excepted: boolean = (Array.isArray(except) ? except?.some?.((str: string)=>trueAttributeName?.startsWith?.(str)) : (except == trueAttributeName));

                if (isPlaceholder && ((prefix == "" && allowedNoPrefix) || prefix != "") && atbIndex >= 0 && !excepted) {
                    entries.push([trueAttributeName, atbIndex]);
                }
            }
            return entries;
        }

        //
        const makeCumulativeEntries = (startsWith: string[] | string, except: string[] | string, specific: string[] | string = "") => {
            const entriesMap = new Map<string, any[]>();
            for (const attr of Array.from(el?.attributes || [])) {
                const allowedNoPrefix: boolean = (Array.isArray(startsWith) ? startsWith?.some?.((str: string)=>str=="") : (startsWith == ""));
                const prefix: string = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : (startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") as string) ?? "";
                const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
                const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
                const atbIndex = parseIndex(attr?.value) ?? -1;

                const excepted: boolean = (Array.isArray(except) ? except?.some?.((str: string)=>trueAttributeName?.startsWith?.(str)) : (except == trueAttributeName));
                const isSpecific: boolean = (Array.isArray(specific) ? specific?.some?.((str: string)=>attr.name === str) : (attr.name === specific)) && specific !== "";

                if (isPlaceholder && (((prefix == "" && allowedNoPrefix) || prefix != "") || isSpecific) && atbIndex >= 0 && !excepted) {
                    const key = isSpecific ? attr.name : trueAttributeName;
                    if (!entriesMap.has(key)) {
                        entriesMap.set(key, []);
                    }
                    entriesMap.get(key)?.push(atbIndex);
                }
            }
            return Array.from(entriesMap.entries());
        }

        //
        let attributesEntries: [string, any][] = makeEntries(["attr:", ""], ["ref"]);
        let propertiesEntries: [string, any][] = makeEntries(["prop:"], []);
        let onEntries: [string, any[]][] = makeCumulativeEntries(["on:", "@"], [], "");
        let refEntries: [string, any[]][] = makeCumulativeEntries(["ref:"], [], ["ref"]);

        // remove entries that are already in properties or on
        //attributesEntries = attributesEntries?.filter?.((pair) => !(propertiesEntries?.some?.((p) => p[0] == pair[0]) || onEntries?.some?.((p) => p[0] == pair[0]) || refEntries?.some?.((p) => p[0] == pair[0]))) ?? [];

        //
        const bindings: any = Object.fromEntries(entriesIdc?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
        bindings.attributes = Object.fromEntries(attributesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
        bindings.properties = Object.fromEntries(propertiesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
        bindings.on = Object.fromEntries(onEntries?.filter?.((pair) => pair[1]?.some?.((idx: number) => idx >= 0))?.map?.((pair) => [pair[0], pair[1]?.map?.((idx: number) => atb?.[idx]).filter((v: any) => v != null)]) ?? []);

        //
        const refIndex = entriesIdc?.find?.((pair) => (pair[0] == "ref" && pair[1] >= 0))?.[1];
        if (refIndex != null && refIndex >= 0) {
            const ref = atb?.[refIndex];
            if (typeof ref == "function") { ref?.(el); } else if (ref != null && typeof ref == "object") { ref.value = el; }
        }

        //
        refEntries?.forEach?.((pair: [string, number[]]) => {
            const handlers: any[] = pair?.[1]
                ?.filter?.((idx: number) => idx != null && idx >= 0)
                ?.map?.((idx: number) => atb?.[idx])
                ?.filter?.((v: any) => v != null);

            //
            handlers?.forEach?.((ref: any) => {
                if (typeof ref == "function") { ref?.(el); } else if (ref != null && typeof ref == "object") { ref.value = el; }
            });
        });

        //
        const clearPlaceholdersFromAttributesOfElement = (el: HTMLElement | null)=>{
            if (el == null) return;

            //
            const attributeIsInRegistry = (name: string) => {
                return attributesEntries?.some?.((pair) => pair[0] == name) || name?.startsWith?.("ref:") || name == "ref";
            }

            // needs by splice or remove, DOM element.attributes is a live collection
            for (const attr of Array.from(el?.attributes || [])) {
                if ( // relaxed syntax for placeholder, if in registry
                    (attr.value?.includes?.("#{") && attr.value?.includes?.("}") && attributeIsInRegistry(attr.name as string)) ||

                    // stricter check of placeholder, if none in registry
                    attr.value?.startsWith?.("#{") && attr.value?.endsWith?.("}") ||

                    // if attribute name contains colon, it is a property
                    attr.name?.includes?.(":") || attr.name?.includes?.("ref:") || attr.name == "ref"
                ) { el?.removeAttribute?.(attr.name as string); }
            };
        }

        //
        clearPlaceholdersFromAttributesOfElement(el);
        if (!EMap?.has?.(el)) { EMap?.set?.(el, E(el, bindings)); };
    };
    return EMap?.get?.(el) ?? el;
}

//
const linearBuilder = (strings, ...values) => {
    const nodes: any[] = [];
    for (let i = 0; i < strings?.length; i++) {
        const str = strings?.[i];
        const val = values?.[i];
        nodes.push(H(str));
        nodes.push(val);
    }
    if (nodes?.length <= 1) return getNode(nodes?.[0], null, 0);

    // TODO! fix parent node bound support
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes?.filter?.((nd) => (nd != null))?.map?.((en, i: number) => getNode(en, null, i))?.filter?.((nd) => (nd != null)));
    return fragment;
}

//
export function html(strings, ...values) {
    if (strings?.at?.(0)?.trim?.()?.startsWith?.("<") && strings?.at?.(-1)?.trim?.()?.endsWith?.(">")) {
        return htmlBuilder({ createElement: null })(strings, ...values);
    }
    return linearBuilder(strings, ...values);
};

//
const isValidParent = (parent: Node) => {
    return (parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || (parent instanceof HTMLBodyElement && parent != document.body)));
}

//
const replaceNode = (parent: Node, node: Node, el: any) => {
    if (el != null) { el.boundParent = parent; }

    //
    let newNode = getNode(el, null, -1, parent);
    if (isElement(newNode)) {
        if (newNode?.parentNode != parent && !newNode?.contains?.(parent) && newNode != null) {
            (node as any)?.replaceWith?.((hasValue(newNode) && (typeof newNode?.value == "object" || typeof newNode?.value == "function") && isElement(newNode?.value)) ? newNode?.value : newNode);
        }
    } else
    { (node as any)?.remove?.(); }
}

//
export function htmlBuilder({ createElement = null } = {}) {
    return function (strings, ...values) {
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
                        parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? (isPrimitive(values?.[i]) ? String(values?.[i])?.trim?.() : `<!--o:${psi}-->`) : "");
                        psh.push(values?.[i]);
                    }
                }
            }
        }

        //
        const sourceCode = cleanupInterTagWhitespaceAndIndent(parts.join("").trim());
        const mapped = new WeakMap(), parser = new DOMParser(), doc: any = parser.parseFromString(sourceCode, "text/html");

        //
        const isTemplate = doc instanceof HTMLTemplateElement || doc?.matches?.("template");
        const sources: any = (isTemplate ? doc : doc.querySelector("template"))?.content ?? (doc.body ?? doc);

        //
        const frag = document.createDocumentFragment();
        const bucket = Array.from(sources.childNodes)?.filter((e: any) => { return e instanceof Node; }).map((node: any) => {
            if (!isValidParent(node?.parentNode) && node?.parentNode != frag) {
                node?.remove?.();
                if (node != null) { frag?.append?.(node); };
            }
            return node;
        });

        //
        let walkedNodes: any[] = [];

        //
        bucket.forEach((nodeSet: any) => {
            const walker: any = nodeSet ? document.createTreeWalker(nodeSet, NodeFilter.SHOW_ALL, null) : null;
            do {
                const node: any = walker?.currentNode;
                walkedNodes.push(node);
            } while (walker?.nextNode?.());
        });

        //
        walkedNodes?.filter?.((node: any) => node?.nodeType == Node.COMMENT_NODE)?.forEach?.((node: any) => {
            if (node?.nodeValue?.trim?.()?.includes?.("o:") && Number.isInteger(parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1"))) {
                let el: any = psh?.[parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1") ?? -1];

                // make iteratable array and set
                if (el == null || el === undefined || (typeof el == "string" ? el : null)?.trim?.() == "") {
                    node?.remove?.();
                } else {
                    const $parent = node?.parentNode;
                    if (Array.isArray(el) || el instanceof Map || el instanceof Set) {
                        replaceNode?.($parent, node, el = M(el, null, $parent));
                    } else
                    if (el != null) {
                        replaceNode?.($parent, node, el);
                    }
                }
            }

            // remove comment node if it is connected
            if (node?.isConnected) {
                node?.remove?.();
            }
        });

        //
        walkedNodes?.filter((node: any) => node.nodeType == Node.ELEMENT_NODE)?.map?.((node) => {
            connectElement(node as HTMLElement, atb, psh, mapped);
        });

        // Final whitespace cleanup to ensure :empty works even after dynamic insertions
        return Array.from(frag?.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
    };
}

//
export const H = (str: any, ...values: any[]) => {
    //if (typeof str == "object" && hasValue(str)) return C(str);
    if (typeof str == "string") {
        if (str?.trim?.()?.startsWith?.("<") && str?.trim?.()?.endsWith?.(">")) {
            const parser = new DOMParser(), doc = parser.parseFromString(cleanupInterTagWhitespaceAndIndent(str?.trim?.()), "text/html");
            const basis = doc.querySelector("template")?.content ?? doc.body;
            // Normalize and clean whitespace-only text nodes between tags
            if (basis instanceof HTMLBodyElement) {
                const frag = document.createDocumentFragment();
                frag.append(...Array.from(basis.childNodes ?? []));
                return (Array.from(frag.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0]);
            }
            if (basis instanceof DocumentFragment) { return basis; }
            if (basis?.childNodes?.length > 1) { const frag = document.createDocumentFragment(); frag.append(...Array.from(basis?.childNodes ?? [])); return frag; }
            return basis?.childNodes?.[0] ?? (new Text(str));
        }
        return new Text(str);
    } else
    if (typeof str == "function") { return H(str?.()); } else
    if (Array.isArray(str) && values) { return html(str, ...values); } else
    if (str instanceof Node) { return str; };
    return getNode(str);
}

//
export default H;
