import { autoRef, makeReactive } from "fest/object";
import { addRoot, loadInlineStyle, setAttributesIfNull } from "fest/dom";
import { Q } from "../lure/node/Queried";
import { E } from "../lure/node/Bindings";

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
} from "../lure/core/Refs";

//
const styleCache    = new Map(), styleElementCache = new WeakMap();
const propStore     = new WeakMap<object, Map<string, any>>(), CSM = new WeakMap();
const camelToKebab  = (str ) => { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
const kebabToCamel  = (str ) => { return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase()); }
const whenBoxValid  = (name) => { const cb = camelToKebab(name); if (["border-box", "content-box", "device-pixel-content-box"].indexOf(cb) >= 0) return cb; return null; }
const whenAxisValid = (name) => { const cb = camelToKebab(name); if (cb?.startsWith?.("inline")) { return "inline"; }; if (cb?.startsWith?.("block")) { return "block"; }; return null; }
const characters    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const inRenderKey   = Symbol.for("@render@"), defKeys = Symbol.for("@defKeys@");
const defaultStyle  = document.createElement("style");
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
    return autoRef;
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
defaultStyle.innerHTML = `@layer ux-preload, ux-layer;
@layer ux-preload {
    :where(ui-select-row, ui-button-row),
    :host(ui-select-row, ui-button-row),
    ::slotted(ui-select-row, ui-button-row) {
        display: none;
        content-visibility: hidden;
    }
    :where(
        :host(:not(:defined)),
        :not(:defined),
        ::slotted(:not(:defined))
    ) {
        :where(*:not(ui-icon) {
            content-visibility: hidden;
        }
    }
    :host:not(:has(style[loaded]))::slotted(*) { display: none; }
    :where(
        :host(:not(:defined)),
        ::slotted(:not(:defined))
    ) { display: none;
        ::slotted(ui-icon) { display: none; content-visibility: hidden; }
    }
    :where(
        :host(:not(:defined)),
        ::slotted(:not(:defined))
    ) { content-visibility: hidden; }
    style { display: none !important; }
}`

//
export function withProperties<T extends { new(...args: any[]): {} }>(ctr: T) {
    const $has = (ctr?.prototype ?? ctr)?.$init;
    (ctr?.prototype ?? ctr).$init = function (...args) {
        $has?.call(this, ...args); if (this?.[defKeys]) { Object.entries(this[defKeys]).forEach(([key, def])=>{
            const exists = this[key]; Object.defineProperty(this, key, def as any); if (exists != null) { this[key] = exists; }; return this;
        }); };
    }; return ctr;
}

//
export function generateName (length = 8) { let r = ''; const l = characters.length; for ( let i = 0; i < length; i++ ) { r += characters.charAt(Math.floor(Math.random() * l)); }; return r; }
export function defineElement(name: string, options?: any|null) { return function(target: any, key: string) { customElements.define(name, target, options); return target; }; }
export function property({attribute, source, name, from}: { attribute?: string|boolean, source?: string|any, name?: string|null, from?: any|null } = {}) {
    return function (target: any, key: string) {
        if (!target[defKeys]) target[defKeys] = {};
        if (attribute != null) {
            if (!target.observedAttributes) { target.observedAttributes = []; };
            const atn = typeof attribute == "string" ? attribute : key;
            if (target.observedAttributes.indexOf(atn) < 0) target.observedAttributes.push(atn);
        };
        target[defKeys][key] = {
            get() {
                const ROOT = this;//name?.includes?.("shadow") ? (this?.shadowRoot ?? this) : this;
                const inRender = this[inRenderKey], sourceTarget = from instanceof HTMLElement ? from : (typeof from == "string" ? Q?.(from, ROOT) : ROOT);

                //
                let store = propStore.get(this), stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) { propStore.set(this, store = new Map()); }
                    if (!store?.has?.(key)) {
                        store?.set?.(key, { value: ""});
                        store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(getDef(source)));
                    }
                }
                if (stored?.value != null && !inRender) { return stored.value; }; return stored;
            },
            set(newValue: any) {
                const ROOT = this;//name?.includes?.("shadow") ? (this?.shadowRoot ?? this) : this;
                const sourceTarget = from instanceof HTMLElement ? from : (typeof from == "string" ? Q?.(from, ROOT) : ROOT);

                //
                let store = propStore.get(this);
                if (!store) { propStore.set(this, store = new Map()); }
                if (!store?.has?.(key)) {
                    store?.set?.(key, {});
                    if (newValue?.value != null)
                        { store?.set?.(key, newValue); } else
                        { store?.set?.(key, (typeof newValue === 'object' && newValue !== null) ? makeReactive(newValue) : defineSource(source, sourceTarget, name || key)?.(newValue)); }
                } else {
                    const exists = store?.get?.(key);
                    if (typeof exists == "object" || typeof exists == "function") {
                        if (typeof newValue === 'object' && newValue !== null && (newValue?.value == null || typeof newValue?.value == "object" || typeof newValue?.value == "function"))
                            { Object.assign(exists, newValue?.value ?? newValue); } else
                            { exists.value = newValue?.value ?? newValue; }
                    }
                }
            },
            enumerable: true,
            configurable: true,
        }
    }
}

//
export const loadCachedStyles = (bTo, src)=>{
    const source = ((typeof src == "function" || typeof src == "object") ? styleElementCache : styleCache)
    const cached = source.get(src); let styleElement = cached?.styleElement, vars = cached?.vars;
    if (!cached) {
        const weak = new WeakRef(bTo); let styles = ``, props = [];
        if (typeof src == "string") { styles = src || "" } else
        if (typeof src == "function") { const cs = src?.call?.(bTo, weak); styles = typeof cs == "string" ? cs : (cs?.css ?? cs), props = cs?.props ?? props, vars = cs?.vars ?? vars; };
        source.set(src, { css: styles, props, vars, styleElement: (styleElement = (styles as any) instanceof HTMLStyleElement ? styles : loadInlineStyle(styles, bTo, "ux-layer")) });
    }
    return styleElement;
}

//
export const customElement = defineElement;
export const GLitElement = (derrivate = HTMLElement) => {
    // @ts-ignore // !experimental `getOrInsert` feature!
    return CSM.getOrInsertComputed(derrivate, ()=>withProperties(class EX extends derrivate {
        #framework: any;
        #initialized: boolean = false;
        #styleElement?: HTMLStyleElement;
        #defaultStyle?: HTMLStyleElement;

        //
        styles?: any;
        initialAttributes?: any; // you can set initial attributes

        // TODO: @elementRef()
        styleLibs: HTMLStyleElement[] = [];
        render = (weak?: WeakRef<any>) => { return document.createElement("slot"); }

        // @ts-ignore
        constructor(...args) {
            super(); const shadowRoot = addRoot(this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" }));
            shadowRoot.append(this.#defaultStyle ??= defaultStyle?.cloneNode?.(true) as HTMLStyleElement);
            this.styleLibs = [];
        }

        //
        protected $init() { return this; };
        protected onInitialize(weak?: WeakRef<any>) { return this; }
        protected onRender(weak?: WeakRef<any>) { return this; }
        protected getProperty(key: string) { this[inRenderKey] = true; const cp = this[key]; this[inRenderKey] = false; return cp; }

        //
        public loadStyleLibrary($module) { const root = this.shadowRoot; const module = typeof $module == "function" ? $module?.(root) : $module; this.styleLibs?.push?.(module); if (module) { this.#styleElement?.before?.(module); }; return this; }
        public createShadowRoot() { return addRoot(this.shadowRoot ?? this.attachShadow({ mode: "open" })) as any; }
        public connectedCallback() {
            const weak = new WeakRef(this);
            if (!this.#initialized) { this.#initialized = true;
                const shadowRoot = this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" }); this.$init?.(); this[inRenderKey] = true;
                setAttributesIfNull(this, (typeof this.initialAttributes == "function") ? this.initialAttributes?.call?.(this) : this.initialAttributes); this.onInitialize?.call(this, weak);

                //! currenrly, `this.styleLibs` will not appear when rendering (not supported)
                this.#framework = E(shadowRoot, {}, [this.#defaultStyle, ...(this.styleLibs||[]), this.#styleElement ??= loadCachedStyles(this, this.styles), this.render?.call?.(this, weak)])
                this.onRender?.call?.(this, weak); delete this[inRenderKey];
            }
            return this;
        }
    }));
}
