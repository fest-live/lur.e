import E from "./Element";
import H from "./HTML";

//
import { loadInlineStyle, hash } from "/externals/lib/dom.js";
import { attrRef, checkedRef, localStorageRef, makeReactive, matchMediaRef, ref, sizeRef, subscribe, valueAsNumberRef, valueRef, scrollRef } from "/externals/lib/object.js";

//
const propStore = new WeakMap<object, Map<string, any>>();

//
export function defineElement(name: string, options?: any|null) {
    return function(target: any, key: string) {
        @withProperties class el extends target {};
        customElements.define(name, el, options);
    }
}

//
const inRenderKey = Symbol.for("@render@");
const defKeys = Symbol.for("@defKeys@");

//
function withProperties<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args); Object.entries(this[defKeys]).forEach(([key, def])=>{
                const exists = this[key]; Object.defineProperty(this, key, def); if (exists != null) { this[key] = exists; }
            });
        }
    }
}

//
function camelToKebab(str) { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
function kebabToCamel(str) { return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase()); }

//
const whenBoxValid = (name)=>{
    const cb = camelToKebab(name);
    if (["border-box", "content-box", "device-pixel-content-box"].indexOf(cb) >= 0) return cb;
    return null;
}

//
const whenAxisValid = (name)=>{
    const cb = camelToKebab(name);
    if (cb?.startsWith?.("inline")) { return "inline"; };
    if (cb?.startsWith?.("block")) { return "block"; };
    return null;
}

//
const defineSource = (source: string|any, holder: any, name?: string|null)=>{
    if (source == "media") { return matchMediaRef; }
    if (source == "localStorage") { return localStorageRef; }
    if (source == "attr") { return attrRef.bind(null, holder, name); }
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

//
export function property({attribute, source, name}: { attribute?: string|boolean, source?: string|any, name?: string|null } = {}) {
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

                //
                let store = propStore.get(this);
                let stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) { propStore.set(this, store = new Map()); }
                    if (!store?.has?.(key))
                        { store?.set?.(key, stored = defineSource(source, this, name || key)?.(0)); }
                }

                //
                if (stored?.value != null && !inRender) { return stored.value; }
                return stored;
            },
            set(newValue: any) {
                let store = propStore.get(this);
                if (!store) { propStore.set(this, store = new Map()); }
                if (!store?.has?.(key)) {
                    if (newValue?.value != null) {
                        store?.set?.(key, newValue);
                    } else {
                        store?.set?.(key, typeof newValue === 'object' && newValue !== null ? makeReactive(newValue) : defineSource(source, this, name || key)?.(newValue));
                    }
                } else {
                    const exists = store?.get?.(key);
                    if (typeof exists == "object" || typeof exists == "function") {
                        if (typeof newValue === 'object' && newValue !== null) {
                            Object.assign(exists, newValue);
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

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

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
export const useVars = (holder, vars)=>{
    vars?.entries?.()?.forEach?.(([key, vr])=>subscribe([vr,'value'], (val)=>(holder?.style ?? holder)?.setProperty?.(`--${key}`, val, "")));
    return holder;
}

//
const CSM = new WeakMap();

//
export const BLitElement = (derrivate = HTMLElement)=>{
    if (CSM.has(derrivate)) return CSM.get(derrivate);
    @withProperties class EX extends derrivate {
        #initialized: boolean = false;
        #styleElement?: HTMLStyleElement;
        #framework: any;
        styles?: any;

        // @ts-ignore
        constructor(...args) { super(...args); }

        //
        protected onInitialize() { return this; }
        protected render() { return H`<slot>`; }
        public connectedCallback() {
            if (!this.#initialized) {
                const shadowRoot = this.attachShadow({ mode: "open" });
                this.#initialized = true; this.onInitialize?.();
                this[inRenderKey] = true;
                let styles = ``, props = [], vars: any = null;
                if (typeof this.styles == "string") { styles = this.styles || "" } else
                if (typeof this.styles == "function") { const cs = this.styles?.call?.(this); styles = cs.css, props = cs.props, vars = cs.vars; console.log(styles); };
                if (vars) { useVars(this, vars); };
                this.#framework = E(shadowRoot, {}, [this.render?.(), this.#styleElement = loadInlineStyle(URL.createObjectURL(new Blob([styles], {type: "text/css"})))])
                delete this[inRenderKey];
            }
            return this;
        }
    }
    CSM.set(derrivate, EX);
    return EX;
}
