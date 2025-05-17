// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";

// @ts-ignore /* @vite-ignore */
import { loadInlineStyle, hash } from "/externals/modules/dom.js";

// @ts-ignore /* @vite-ignore */
import { makeReactive, ref, subscribe, observableArray } from "/externals/modules/object.js";

//
import E from "./Element";
import H from "./HTML";
import { attrRef, checkedRef, localStorageRef, sizeRef, matchMediaRef, valueAsNumberRef, valueRef, scrollRef } from "./DOM";

//
const camelToKebab = (str) => { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
const kebabToCamel = (str) => { return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase()); }
const whenBoxValid = (name)=>{ const cb = camelToKebab(name); if (["border-box", "content-box", "device-pixel-content-box"].indexOf(cb) >= 0) return cb; return null; }
const whenAxisValid = (name)=>{ const cb = camelToKebab(name); if (cb?.startsWith?.("inline")) { return "inline"; }; if (cb?.startsWith?.("block")) { return "block"; }; return null; }
const propStore = new WeakMap<object, Map<string, any>>(), CSM = new WeakMap();
const inRenderKey = Symbol.for("@render@"), defKeys = Symbol.for("@defKeys@");
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const defineSource = (source: string|any, holder: any, name?: string|null)=>{
    if (source == "media") { return matchMediaRef; }
    if (source == "localStorage") { return localStorageRef; }
    if (source == "attr") { return attrRef.bind(null, holder, name || ""); }
    if (source == "inline-size") { return sizeRef.bind(null, holder, "inline", whenBoxValid(name) || "border-box"); }
    if (source == "block-size") { return sizeRef.bind(null, holder, "block", whenBoxValid(name) || "border-box"); }
    if (source == "border-box") { return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "border-box"); }
    if (source == "content-box") { return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "content-box"); }
    if (source == "scroll") { return scrollRef.bind(null, holder, whenAxisValid(name) || "inline"); }
    if (source == "device-pixel-content-box") { sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "device-pixel-content-box"); }
    if (source == "checked") { return checkedRef.bind(null, holder); }
    if (source == "value") { return valueRef.bind(null, holder); }
    if (source == "value-as-number") { return valueAsNumberRef.bind(null, holder); }
    return ref;
}
const getDef = (source?: string|any|null): any =>{
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
function withProperties<T extends { new(...args: any[]): {} }>(ctr: T) {
    const $has = (ctr?.prototype ?? ctr)?.$init;
    (ctr?.prototype ?? ctr).$init = function (...args) {
        $has?.call(this, ...args); if (this?.[defKeys]) { Object.entries(this[defKeys]).forEach(([key, def])=>{
            const exists = this[key]; Object.defineProperty(this, key, def as any); if (exists != null) { this[key] = exists; }
            return this;
        }); };
    }
    return ctr;
    /*return class extends constructor {
        constructor(...args) { super(...args); }
        $init(...args: any[]) {
            super.$init?.(...args); if (this[defKeys]) { Object.entries(this[defKeys]).forEach(([key, def])=>{
                const exists = this[key]; Object.defineProperty(this, key, def); if (exists != null) { this[key] = exists; }
                return this;
            }); };
        }
    }*/
}

//
function generateName(length = 8) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//
export const selectedElement = (host, selector: string)=>{ return typeof host == "object" ? new Proxy(host, new SelectedElementHandler(selector) as ProxyHandler<any>) : host; }
export class SelectedElementHandler {
    selector = "";
    constructor(selector?: string) {
        if (selector) { this.selector = selector; };
    }
    get(target, name, rec) {
        const selected = target.querySelector(this.selector);
        const vp = selected?.[name];
        if (name == "self" && !vp) { return target; }
        if (name == "selector" && !vp) { return this.selector; }
        if (name == "current" && !vp) { return selected; }
        return typeof vp == "function" ? vp?.bind?.(selected) : vp;
    }
    set(target, name, val) {
        const selected = target.querySelector(this.selector);
        if (selected) return Reflect.set(selected, name, val);
        return true;
    }
    has(target, name) {
        const selected = target.querySelector(this.selector);
        if (selected) return Reflect.has(selected, name);
        return false;
    }
    deleteProperty(target, name) {
        const selected = target.querySelector(this.selector);
        if (selected) return Reflect.deleteProperty(selected, name);
        return true;
    }
    ownKeys(target) {
        const selected = target.querySelector(this.selector);
        if (selected) return Reflect.ownKeys(selected);
        return [];
    }
    defineProperty(target, a, b) {
        const selected = target.querySelector(this.selector);
        if (selected) return Reflect.defineProperty(selected, a, b);
        return;
    }
}

//
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
                const inRender = this[inRenderKey];
                const sourceTarget = from instanceof HTMLElement ? from : (typeof from == "string" ? selectedElement(this, from) : this);

                //
                let store = propStore.get(this);
                let stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) { propStore.set(this, store = new Map()); }
                    if (!store?.has?.(key))
                        { store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(getDef(source))); }
                }

                //
                if (stored?.value != null && !inRender) { return stored.value; }
                return stored;
            },
            set(newValue: any) {
                const sourceTarget = from instanceof HTMLElement ? from : (typeof from == "string" ? selectedElement(this, from) : this);

                //
                let store = propStore.get(this);
                if (!store) { propStore.set(this, store = new Map()); }
                if (!store?.has?.(key)) {
                    if (newValue?.value != null) {
                        store?.set?.(key, newValue);
                    } else {
                        store?.set?.(key, (typeof newValue === 'object' && newValue !== null) ? makeReactive(newValue) : defineSource(source, sourceTarget, name || key)?.(newValue));
                    }
                } else {
                    const exists = store?.get?.(key);
                    if (typeof exists == "object" || typeof exists == "function") {
                        if (typeof newValue === 'object' && newValue !== null && (newValue?.value == null || typeof newValue?.value == "object" || typeof newValue?.value == "function")) {
                            Object.assign(exists, newValue?.value ?? newValue);
                        } else {
                            exists.value = newValue?.value ?? newValue;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true,
        }
    }
}

//
export const customElement = defineElement;
export const useVars = (holder, vars)=>{ vars?.entries?.()?.forEach?.(([key, vr])=>subscribe([vr,'value'], (val)=>(holder?.style ?? holder)?.setProperty?.(`--${key}`, val, ""))); return holder; }
export const setAttributesIfNull = (element, attrs = {})=>{
    const entries = attrs instanceof Map ? attrs.entries() : Object.entries(attrs || {})
    return Array.from(entries).map(([name, value])=>{
        const old = element.getAttribute(name = camelToKebab(name) || name);
        if (old != value) {
            if (value == null) {
                element.removeAttribute(name);
            } else {
                element.setAttribute(name, old == "" ? (value ?? old) : (old ?? value));
            }
        }
    });
}

//
export const css = (strings, ...values)=>{
    let props: string[] = [];
    let parts: string[] = [], vars: Map<string, any> = new Map();
    for (let i = 0; i < strings.length; i++) {
        parts.push(strings?.[i] || "");
        if (i < values.length) {
            const val = values?.[i];
            if (val?.value != null) {
                const name = generateName();
                if (typeof val?.value == "number") { props.push(`@property --${name} { syntax: "<number>"; initial-value: ${val?.value}; inherits: true; };`); };
                parts.push(`var(--${name}, ${val?.value})`); vars.set(name, val);
            } else
            if (typeof val != "object" && typeof val != "function") { parts.push(`${val}`); }
        }
    }
    return {props, css: parts.join(""), vars};
}


//
const styleCache = new Map();
const styleElementCache = new WeakMap();
const loadCachedStyles = (bTo, src)=>{
    const cached = ((typeof src == "function" || typeof src == "object") ? styleElementCache : styleCache).get(src);
    let styleElement = cached?.styleElement;
    let vars = cached?.vars;

    //
    if (!cached) {
        const weak = new WeakRef(bTo);
        let styles = ``, props = [];
        if (typeof src == "string") { styles = src || "" } else
        if (typeof src == "function") { const cs = src?.call?.(bTo, weak); styles = typeof cs == "string" ? cs : (cs?.css ?? cs), props = cs?.props ?? props, vars = cs?.vars ?? vars; };
        ((typeof src == "function" || typeof src == "object") ? styleElementCache : styleCache).set(src, { css: styles, props, vars, styleElement: (styleElement = loadInlineStyle(styles, bTo, "ux-layer")) });
    }

    //
    if (vars) { useVars(this, vars); };
    return styleElement;
}

//
const defaultStyle = document.createElement("style");
defaultStyle.innerHTML = `@layer ux-preload,ux-layer;@layer ux-preload{:host{display:none;};:host>*,::slotted{content-visibility:hidden;};style{display:none!important;}}`;

//
export const BLitElement = (derrivate = HTMLElement)=>{
    if (CSM.has(derrivate)) return CSM.get(derrivate);
    const EX = withProperties(class EX extends derrivate {
        #initialized: boolean = false;
        #styleElement?: HTMLStyleElement;
        #defaultStyle?: HTMLStyleElement;
        #framework: any;
        styles?: any;
        initialAttributes?: any; // you can set initial attributes
        themeStyle?: HTMLStyleElement;
        render = (weak?: WeakRef<any>) => { return H("<slot/>"); }

        // @ts-ignore
        constructor(...args) {
            super(); this.#styleElement ??= loadCachedStyles(this, this.styles);
            this.#defaultStyle = defaultStyle?.cloneNode?.(true) as HTMLStyleElement;
        }
        protected onInitialize(weak?: WeakRef<any>) { return this; }
        protected onRender(weak?: WeakRef<any>) { return this; }
        protected $init() { return this; };
        protected getProperty(key: string) { this[inRenderKey] = true; const cp = this[key]; this[inRenderKey] = false; return cp; }

        // @ts-ignore
        public loadThemeLibrary() { const root = this.shadowRoot; return Promise.try(importCdn, ["/externals/modules/theme.js"])?.then?.((module)=>{ if (root) { return (this.themeStyle ??= module?.default?.(root)); } }).catch(console.warn.bind(console)); }
        public createShadowRoot() { return (this.shadowRoot ?? this.attachShadow({ mode: "open" })); }
        public connectedCallback() {
            const weak = new WeakRef(this);
            if (!this.#initialized) { this.#initialized = true;
                const shadowRoot = this.createShadowRoot?.() ?? (this.shadowRoot ?? this.attachShadow({ mode: "open" }));
                this.$init?.(); this[inRenderKey] = true;
                setAttributesIfNull(this, (typeof this.initialAttributes == "function") ? this.initialAttributes?.call?.(this) : this.initialAttributes); this.onInitialize?.call(this, weak);
                this.#framework = E(shadowRoot, {}, observableArray([this.#defaultStyle ??= defaultStyle?.cloneNode?.(true) as HTMLStyleElement, this.themeStyle, this.render?.call?.(this, weak), this.#styleElement = loadCachedStyles(this, this.styles)]))
                this.onRender?.call?.(this, weak);
                delete this[inRenderKey];
            }
            return this;
        }
    });
    CSM.set(derrivate, EX); return EX;
}
