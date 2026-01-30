import { ref } from "fest/object";
import { addRoot, isElement, loadAsAdopted, loadInlineStyle, setAttributesIfNull } from "fest/dom";

//
import {
    valueAsNumberRef,
    localStorageRef,
    matchMediaRef,
    checkedRef,
    scrollRef,
    valueRef,
    sizeRef,
    attrRef
} from "../../lure/core/Refs";

//
import { Q } from "../../lure/node/Queried";
import { E } from "../../lure/node/Bindings";
import { H } from "../../lure/node/Syntax";

//
const styleCache    = new Map(), styleElementCache = new WeakMap();
const propStore     = new WeakMap<object, Map<string, any>>(), CSM = new WeakMap();
const camelToKebab  = (str ) => { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
const kebabToCamel  = (str ) => { return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase()); }
const whenBoxValid  = (name) => { const cb = camelToKebab(name); if (["border-box", "content-box", "device-pixel-content-box"].indexOf(cb) >= 0) return cb; return null; }
const whenAxisValid = (name) => { const cb = camelToKebab(name); if (cb?.startsWith?.("inline")) { return "inline"; }; if (cb?.startsWith?.("block")) { return "block"; }; return null; }
const characters    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const inRenderKey   = Symbol.for("@render@"), defKeys = Symbol.for("@defKeys@");
const defaultStyle = typeof document != "undefined" ? document?.createElement?.("style") : null;
const defineSource  = (source: string|any, holder: any, name?: string|null)=>{
    if (source == "attr")  { return attrRef.bind(null, holder, name || ""); }
    if (source == "media") { return matchMediaRef; }
    if (source == "query")        { return (val)=>Q?.(name || val || "", holder); }
    if (source == "query-shadow") { return (val)=>Q?.(name || val || "", holder?.shadowRoot ?? holder); }
    if (source == "localStorage") { return localStorageRef; }
    if (source == "inline-size") { return sizeRef.bind(null, holder, "inline", whenBoxValid(name) || "border-box"); }
    if (source == "content-box") { return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "content-box"); }
    if (source == "block-size") { return sizeRef.bind(null, holder, "block", whenBoxValid(name) || "border-box"); }
    if (source == "border-box") { return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "border-box"); }
    if (source == "scroll") { return scrollRef.bind(null, holder, whenAxisValid(name) || "inline"); }
    if (source == "device-pixel-content-box") { sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "device-pixel-content-box"); }
    if (source == "checked") { return checkedRef.bind(null, holder); }
    if (source == "value") { return valueRef.bind(null, holder); }
    if (source == "value-as-number") { return valueAsNumberRef.bind(null, holder); }
    return ref;
}

//
if (defaultStyle) {
    typeof document != "undefined" ? document.querySelector?.("head")?.appendChild?.(defaultStyle) : null;
}

//
const getDef = (source?: string|any|null): any =>{
    if (source == "query") return "input";
    if (source == "query-shadow") return "input";
    if (source == "media") return false;
    if (source == "localStorage") return null;
    if (source == "attr") return null;
    if (source == "inline-size") return 0;
    if (source == "block-size") return 0;
    if (source == "border-box") return 0;
    if (source == "content-box") return 0;
    if (source == "scroll") return 0;
    if (source == "device-pixel-content-box") return 0;
    if (source == "checked") return false;
    if (source == "value") return "";
    if (source == "value-as-number") return 0;
    return null;
}

//
if (defaultStyle) {
    defaultStyle.innerHTML = `@layer ux-preload {
        :host { display: none; }
    }`
}

//
export function withProperties<T extends { new(...args: any[]): {} }>(ctr: T) {
    const $init = (ctr?.prototype ?? ctr)?.$init ?? (ctr as any)?.$init;

    //
    (ctr?.prototype ?? ctr).$init ??= function (...args) {
        const self = this; $init?.call?.(self, ...args);

        //
        const defs = self?.[defKeys] ?? ctr?.prototype?.[defKeys] ?? ctr?.[defKeys];
        if (defs != null) {
            Object.entries(defs).forEach(([key, def]) => {
                const exists = self[key];
                if (def != null) { Object.defineProperty(self, key, def as any); };
                self[key] = exists || self[key];
            });
        };

        //
        return self;
    }; return ctr;
}

//
export function generateName (length = 8) { let r = ''; const l = characters.length; for ( let i = 0; i < length; i++ ) { r += characters.charAt(Math.floor(Math.random() * l)); }; return r; }
export function defineElement(name: string, options: any|null|undefined = null) {
    return function(target: any, _key?: string) {
        try {
            if (typeof customElements === "undefined" || !name) { return target; }
            const existing = customElements.get(name);
            if (existing) { return existing; }
            customElements.define(name, target, options);
        } catch (e: any) {
            // If the tag already exists, keep the existing definition.
            if (e?.name === "NotSupportedError" || /has already been used|already been defined/i.test(e?.message || "")) {
                return customElements?.get?.(name) ?? target;
            }
            throw e;
        }
        return target;
    };
}

//
export function property({attribute, source, name, from}: { attribute?: string|boolean, source?: string|any, name?: string|null, from?: any|null } = {}) {
    return function (target: any, key: string) {

        //
        if ((attribute ??= name ?? key) != null) {
            if (!target.observedAttributes) { target.observedAttributes = []; };
            const atn = typeof attribute == "string" ? attribute : (name ?? key);
            if (target.observedAttributes.indexOf(atn) < 0) target.observedAttributes.push(atn);
        };

        //
        if (!target[defKeys]) target[defKeys] = {};
        target[defKeys][key] = {
            get() {
                const ROOT = this;
                const inRender = ROOT[inRenderKey], sourceTarget = !from ? ROOT :(from instanceof HTMLElement ? from : (typeof from == "string" ? Q?.(from, ROOT) : ROOT));

                //
                let store = propStore.get(ROOT), stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) { propStore.set(ROOT, store = new Map()); }
                    if (!store?.has?.(key)) {
                        //if (source == "attr" && !inRender) store?.set?.(key, autoRef(getDef(source)));
                        store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(getDef(source)));
                    }
                }

                //
                if (inRender) return stored;
                if (stored?.element instanceof HTMLElement) { return stored?.element; };
                return ((typeof stored == "object" || typeof stored == "function") && (stored?.value != null || "value" in stored)) ? stored?.value : stored;
            },
            set(newValue: any) {
                const ROOT = this;
                const sourceTarget = !from ? ROOT : (from instanceof HTMLElement ? from : (typeof from == "string" ? Q?.(from, ROOT) : ROOT));

                //
                let store = propStore.get(ROOT), stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) { propStore.set(ROOT, store = new Map()); }
                    if (!store?.has?.(key)) {
                        store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.((((typeof newValue == 'object' || typeof newValue == 'function') ? (newValue?.value) : null) ?? newValue) ?? getDef(source)));
                    }
                } else
                if (typeof stored == "object" || typeof stored == "function") {
                    if (typeof newValue == 'object' && newValue != null && ((newValue?.value == null && !("value" in newValue)) || typeof newValue?.value == "object" || typeof newValue?.value == "function"))
                        { Object.assign(stored, newValue?.value ?? newValue); } else
                        { stored.value = ((typeof newValue == 'object' || typeof newValue == 'function') ? (newValue?.value) : null) ?? newValue; }
                }
            },
            enumerable: true,
            configurable: true,
        }
    }
}

//
const adoptedStyleSheetsCache = new WeakMap<object, CSSStyleSheet[]>();
const addAdoptedSheetToElement = (bTo: any, sheet: CSSStyleSheet) => {
    let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
    if (!adoptedSheets) {
        adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
    }
    if (sheet && adoptedSheets.indexOf(sheet) < 0) {
        adoptedSheets.push(sheet);
    }
    if (bTo.shadowRoot) {
        bTo.shadowRoot.adoptedStyleSheets = [...(bTo.shadowRoot.adoptedStyleSheets || []), ...adoptedSheets.filter(s => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))];
    }
};

export const loadCachedStyles = (bTo, src) => {
    if (!src) return null;

    let resolvedSrc = src;
    if (typeof src == "function") {
        try {
            const weak = new WeakRef(bTo);
            resolvedSrc = src.call(bTo, weak);
        } catch (e) {
            console.warn("Error calling styles function:", e);
            return null;
        }
    }

    if (resolvedSrc && typeof CSSStyleSheet != "undefined" && resolvedSrc instanceof CSSStyleSheet) {
        addAdoptedSheetToElement(bTo, resolvedSrc);
        return null;
    }

    if (resolvedSrc instanceof Promise) {
        resolvedSrc.then((result) => {
            if (result instanceof CSSStyleSheet) {
                addAdoptedSheetToElement(bTo, result);
            } else if (result != null) {
                loadCachedStyles(bTo, result);
            }
        }).catch((e) => {
            console.warn("Error loading adopted stylesheet:", e);
        });
        return null;
    }

    if (typeof resolvedSrc == "string" || resolvedSrc instanceof Blob || (resolvedSrc as any) instanceof File) {
        const adopted = loadAsAdopted(resolvedSrc, "ux-layer");
        if (adopted) {
            let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
            if (!adoptedSheets) {
                adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
            }
            const addAdoptedSheet = (sheet: CSSStyleSheet) => {
                if (sheet && adoptedSheets.indexOf(sheet) < 0) {
                    adoptedSheets.push(sheet);
                }
                if (bTo.shadowRoot) {
                    bTo.shadowRoot.adoptedStyleSheets = [...(bTo.shadowRoot.adoptedStyleSheets || []), ...adoptedSheets.filter(s => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))];
                }
            };
            if (adopted instanceof Promise) {
                adopted.then(addAdoptedSheet).catch((e) => {
                    console.warn("Error loading adopted stylesheet:", e);
                });
                return null;
            } else {
                addAdoptedSheet(adopted);
                return null;
            }
        }
    }

    const source = ((typeof src == "function" || typeof src == "object") ? styleElementCache : styleCache);
    const cached = source.get(src); let styleElement = cached?.styleElement, vars = cached?.vars;
    if (!cached) {
        const weak = new WeakRef(bTo); let styles = ``, props = [];
        if (typeof resolvedSrc == "string") {
            styles = resolvedSrc || "";
        } else if (typeof resolvedSrc == "object" && resolvedSrc != null) {
            if (resolvedSrc instanceof HTMLStyleElement) {
                styleElement = resolvedSrc;
            } else {
                styles = typeof (resolvedSrc as any).css == "string" ? (resolvedSrc as any).css : (typeof resolvedSrc == "string" ? resolvedSrc : String(resolvedSrc));
                props = (resolvedSrc as any)?.props ?? props;
                vars = (resolvedSrc as any)?.vars ?? vars;
            }
        }
        if (!styleElement && styles) {
            styleElement = loadInlineStyle(styles, bTo, "ux-layer");
        }
        source.set(src, { css: styles, props, vars, styleElement });
    }
    return styleElement;
}

//
export const isNotExtended = (el: HTMLElement)=>{
    return !(
        (el instanceof HTMLDivElement) ||
        (el instanceof HTMLImageElement) ||
        (el instanceof HTMLVideoElement) ||
        (el instanceof HTMLCanvasElement)) &&
        !(el?.hasAttribute?.("is") || el?.getAttribute?.("is") != null);
}

//
export const customElement = defineElement;
export const GLitElement = <T extends typeof HTMLElement = typeof HTMLElement>(derivate: (any extends T ? any : T) = HTMLElement) => {
    // @ts-ignore // !experimental `getOrInsert` feature!
    return CSM.getOrInsertComputed(derivate, ()=>withProperties(class EX extends derivate {
        #shadowDOM?: any|null;
        #styleElement?: HTMLStyleElement;
        #defaultStyle?: HTMLStyleElement;
        #initialized: boolean = false;

        //
        // IMPORTANT:
        // Do NOT declare `styles` / `initialAttributes` as class fields here.
        // In JS, class fields create OWN properties on the instance (initialized in base class),
        // which would shadow subclass prototype methods like:
        //   styles() { ... } / get styles() { ... }
        //   initialAttributes() { ... } / get initialAttributes() { ... }
        //
        // Keeping these as prototype getters preserves the old "undefined by default" behavior
        // and allows subclass "classic method syntax" overrides to work.
        get styles(): any { return undefined; }
        get initialAttributes(): any { return undefined; }

        // TODO: @elementRef()
        styleLibs: HTMLStyleElement[] = [];
        adoptedStyleSheets: CSSStyleSheet[] = [];
        styleLayers: ()=>string[] = ()=>[];
        render(weak?: WeakRef<any>) { return document.createElement("slot"); }

        // @ts-ignore
        constructor(...args) {
            super();
            if (isNotExtended(this)) {
                const shadowRoot  = addRoot(this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" }));
                const defStyle    = (this.#defaultStyle ??= defaultStyle?.cloneNode?.(true) as HTMLStyleElement);
                const layersStyle = shadowRoot.querySelector(`style[data-type="ux-layer"]`);
                if (layersStyle) { layersStyle.after(defStyle); } else { shadowRoot.prepend(defStyle); }
            }
            this.styleLibs ??= [];
        }

        //
        protected $makeLayers() { return `@layer ${["ux-preload", "ux-layer", ...(this.styleLayers?.call?.(this) ?? [])].join?.(",") ?? ""};`; }
        protected $init?: ()=>void;

        //
        protected onInitialize(weak?: WeakRef<any>) { return this; }
        protected onRender(weak?: WeakRef<any>) { return this; }
        protected getProperty(key: string) { const current = this[inRenderKey]; this[inRenderKey] = true; const cp = this[key]; this[inRenderKey] = current; if (!current) { delete this[inRenderKey]; } return cp; }

        //
        public loadStyleLibrary($module) {
            const root = this.shadowRoot;
            const module = typeof $module == "function" ? $module?.(root) : $module;
            if (module instanceof HTMLStyleElement) {
                this.styleLibs?.push?.(module);
                if (this.#styleElement?.isConnected) {
                    this.#styleElement?.before?.(module);
                } else {
                    this.shadowRoot?.prepend?.(module);
                }
            } else if (module instanceof CSSStyleSheet) {
                let adoptedSheets = adoptedStyleSheetsCache.get(this);
                if (!adoptedSheets) {
                    adoptedStyleSheetsCache.set(this, adoptedSheets = []);
                }
                if (adoptedSheets.indexOf(module) < 0) {
                    adoptedSheets.push(module);
                }
                if (root) {
                    root.adoptedStyleSheets = [...(root.adoptedStyleSheets || []), ...adoptedSheets.filter(s => !root.adoptedStyleSheets?.includes(s))];
                }
            } else {
                const adopted = loadAsAdopted(module, "ux-layer");
                let adoptedSheets = adoptedStyleSheetsCache.get(this);
                if (!adoptedSheets) {
                    adoptedStyleSheetsCache.set(this, adoptedSheets = []);
                }
                const addAdoptedSheet = (sheet: CSSStyleSheet) => {
                    if (sheet && adoptedSheets.indexOf(sheet) < 0) {
                        adoptedSheets.push(sheet);
                    }
                    if (root) {
                        root.adoptedStyleSheets = [...(root.adoptedStyleSheets || []), ...adoptedSheets.filter(s => !root.adoptedStyleSheets?.includes(s))];
                    }
                };
                if (adopted instanceof Promise) {
                    adopted.then(addAdoptedSheet).catch(() => {});
                } else if (adopted) {
                    addAdoptedSheet(adopted);
                }
            }
            return this;
        }
        public createShadowRoot() { return addRoot(this.shadowRoot ?? this.attachShadow({ mode: "open" })) as any; }
        public connectedCallback() {
            const weak = new WeakRef(this);
            if (!this.#initialized) {
                this.#initialized = true;
                const shadowRoot = isNotExtended(this) ? (this.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" })) : this.shadowRoot;

                //
                withProperties<any>(this).$init?.call?.(this);
                setAttributesIfNull(this, (typeof this.initialAttributes == "function") ? this.initialAttributes?.call?.(this) : this.initialAttributes);
                this.onInitialize?.call(this, weak);

                //! currenrly, `this.styleLibs` will not appear when rendering (not supported)
                this[inRenderKey] = true;
                if (isNotExtended(this) && shadowRoot) {
                    const rendered = this.render?.call?.(this, weak) ?? document.createElement("slot");
                    const styleElement = loadCachedStyles(this, this.styles);
                    if (styleElement instanceof HTMLStyleElement) {
                        this.#styleElement = styleElement;
                    }

                    shadowRoot.append(...[
                        H`<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
                        this.#defaultStyle,
                        ...(this.styleLibs.map(x => x.cloneNode?.(true)) || []),
                        styleElement,
                        rendered
                    ]?.filter?.(x => (x != null && isElement(x))));

                    const adoptedSheets = adoptedStyleSheetsCache.get(this) || [];
                    if (adoptedSheets.length > 0) {
                        shadowRoot.adoptedStyleSheets = [...adoptedSheets.filter(s => !shadowRoot.adoptedStyleSheets?.includes(s)), ...new Set([...(shadowRoot.adoptedStyleSheets || [])])];
                    }
                }

                //
                this.onRender?.call?.(this, weak);
                delete this[inRenderKey];
            }
            return this;
        }
    }));
}
