import E from "./Element";
import H from "./HTML";

//
import { loadInlineStyle, hash } from "/externals/lib/dom.js";
import { makeReactive, ref } from "/externals/lib/object.js";

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
                const exists = this[key]; Object.defineProperty(this, key, def); this[key] = exists;
            });
        }
    }
}

//
export function property() {
    return function (target: any, key: string) {
        if (!target[defKeys]) target[defKeys] = {};
        target[defKeys][key] = {
            get() {
                const inRender = this[inRenderKey];
                const stored = propStore.get(this)?.get?.(key);
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
                        store?.set?.(key, typeof newValue === 'object' && newValue !== null ? makeReactive(newValue) : ref(newValue));
                    }
                } else {
                    const exists = store?.get?.(key);
                    if (typeof exists == "object" || typeof exists == "function") {
                        if (typeof newValue === 'object' && newValue !== null) {
                            Object.assign(exists, newValue);
                        } else {
                            exists.value = newValue;
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
const CSM = new WeakMap();

//
export const BLitElement = (derrivate = HTMLElement)=>{
    if (CSM.has(derrivate)) return CSM.get(derrivate);
    @withProperties class EX extends derrivate {
        #initialized: boolean = false;
        #styleElement?: HTMLStyleElement;
        #framework: any;
        styles: string = "";

        // @ts-ignore
        constructor(...args) { super(...args); }

        //
        protected onInitialize() { return this; }
        protected render() { return H`<slot>`; }
        protected connectedCallback() {
            if (!this.#initialized) {
                const shadowRoot = this.attachShadow({ mode: "open" });
                this.#initialized = true; this.onInitialize?.();
                this[inRenderKey] = true;
                this.#framework = E(shadowRoot, {}, [this.render?.(), this.#styleElement = loadInlineStyle(URL.createObjectURL(new Blob([this.styles || ""], {type: "text/css"})))])
                delete this[inRenderKey];
            }
            return this;
        }
    }
    CSM.set(derrivate, EX);
    return EX;
}
