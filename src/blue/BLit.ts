import E from "./Element";
import H from "./HTML";

//
import { loadInlineStyle, hash } from "/externals/lib/dom.js";
import { makeReactive, ref } from "/externals/lib/object.js";

//
const propStore = new WeakMap<object, Map<string, any>>();

//
export function defineElement(name: string, options?: any) {
    return function(target: any, key: string) {
        customElements.define(name, target, options);
    }
}

//
export function property() {
    return function (target: any, key: string) {
        Object.defineProperty(target, key, {
            get: function () {
                // Определяем, вызывается ли из render
                const stack = new Error().stack;
                const inRender = stack && stack.includes('render');
                const stored = propStore.get(this)?.get?.(key);
                if (stored?.value != null) {
                    return inRender ? stored : stored.value;
                }
                return stored;
            },
            set: function (newValue: any) {
                const store = propStore.get(this);
                if (!store?.has?.(key)) {
                    if (newValue?.value != null) {
                        store?.set?.(key, newValue);
                    } else {
                        store?.set?.(key, typeof newValue === 'object' && newValue !== null ? makeReactive(newValue) : ref(newValue));
                    }
                } else {
                    const exists = store?.get?.(key);
                    if (typeof newValue === 'object' && newValue !== null) {
                        Object.assign(exists, newValue);
                    } else {
                        exists.value = newValue;
                    }
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}

//
export class BLitElement extends HTMLElement {
    #initialized: boolean = false;
    #styleElement?: HTMLStyleElement;
    #framework: any;
    styles: string = "";

    //
    constructor() { super(); }

    //
    protected onInitialize() { return this; }
    protected render() { return H`<slot>`; }
    protected connectedCallback() {
        if (!this.#initialized) {
            const shadowRoot = this.attachShadow({ mode: "open" });
            this.#initialized = true; this.onInitialize?.();
            this.#framework = E(shadowRoot, {}, [this.render?.(), this.#styleElement = loadInlineStyle(URL.createObjectURL(new Blob([this.styles || ""], {type: "text/css"})))])
        }
        return this;
    }
}
