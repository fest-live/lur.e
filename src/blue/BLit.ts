import E from "./Element";
import H from "./HTML";

//
import { loadInlineStyle, hash } from "/externals/lib/dom.js";
import { makeReactive, ref } from "/externals/lib/object.js";

//
const propStore = new WeakMap<object, Map<string, any>>();
export function property(target: any, key: string) {
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
                if (typeof newValue === 'object' && newValue !== null) {
                    store?.set?.(key, makeReactive(newValue));
                } else {
                    store?.set?.(key, ref(newValue));
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

//
export class BLitElement extends HTMLElement {
    #initialized: boolean = false;
    #styleElement?: HTMLStyleElement;
    #framework: any;
    styles: string = "";

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" })
    }

    onInitialize() {

    }

    render() { return H`<div></div>`; }
    connectedCallback() {
        if (!this.#initialized) {
            this.#initialized = true; this.onInitialize?.();
            this.#framework = E(this.shadowRoot, {}, [this.render?.(), this.#styleElement = loadInlineStyle(URL.createObjectURL(new Blob([this.styles || ""], {type: "text/css"})), null, hash(this.styles || ""))])
        }
    }

}
