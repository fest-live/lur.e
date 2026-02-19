import { ref } from "fest/object";
import { addRoot, isElement, loadAsAdopted, loadInlineStyle, setAttributesIfNull } from "fest/dom";
import { valueAsNumberRef, localStorageRef, matchMediaRef, checkedRef, scrollRef, valueRef, sizeRef, attrRef } from "../../lure/core/Refs";
import { Q } from "../../lure/node/Queried";
import { H } from "../../lure/node/Syntax";
//
const styleCache = new Map();
const styleElementCache = new WeakMap();
const propStore = new WeakMap();
const CSM = new WeakMap();
const camelToKebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const kebabToCamel = (str) => str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
const whenBoxValid = (name) => {
    const cb = camelToKebab(name);
    if (["border-box", "content-box", "device-pixel-content-box"].indexOf(cb) >= 0)
        return cb;
    return null;
};
const whenAxisValid = (name) => {
    const cb = camelToKebab(name);
    if (cb?.startsWith?.("inline"))
        return "inline";
    if (cb?.startsWith?.("block"))
        return "block";
    return null;
};
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const inRenderKey = Symbol.for("@render@");
const defKeys = Symbol.for("@defKeys@");
const defaultStyle = typeof document != "undefined" ? document?.createElement?.("style") : null;
const defineSource = (source, holder, name) => {
    if (source == "attr")
        return attrRef.bind(null, holder, name || "");
    if (source == "media")
        return matchMediaRef;
    if (source == "query")
        return (val) => Q?.(name || val || "", holder);
    if (source == "query-shadow")
        return (val) => Q?.(name || val || "", holder?.shadowRoot ?? holder);
    if (source == "localStorage")
        return localStorageRef;
    if (source == "inline-size")
        return sizeRef.bind(null, holder, "inline", whenBoxValid(name) || "border-box");
    if (source == "content-box")
        return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "content-box");
    if (source == "block-size")
        return sizeRef.bind(null, holder, "block", whenBoxValid(name) || "border-box");
    if (source == "border-box")
        return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "border-box");
    if (source == "scroll")
        return scrollRef.bind(null, holder, whenAxisValid(name) || "inline");
    if (source == "device-pixel-content-box")
        return sizeRef.bind(null, holder, whenAxisValid(name) || "inline", "device-pixel-content-box");
    if (source == "checked")
        return checkedRef.bind(null, holder);
    if (source == "value")
        return valueRef.bind(null, holder);
    if (source == "value-as-number")
        return valueAsNumberRef.bind(null, holder);
    return ref;
};
if (defaultStyle) {
    typeof document != "undefined" ? document.querySelector?.("head")?.appendChild?.(defaultStyle) : null;
}
const getDef = (source) => {
    if (source == "query")
        return "input";
    if (source == "query-shadow")
        return "input";
    if (source == "media")
        return false;
    if (source == "localStorage")
        return null;
    if (source == "attr")
        return null;
    if (source == "inline-size")
        return 0;
    if (source == "block-size")
        return 0;
    if (source == "border-box")
        return 0;
    if (source == "content-box")
        return 0;
    if (source == "scroll")
        return 0;
    if (source == "device-pixel-content-box")
        return 0;
    if (source == "checked")
        return false;
    if (source == "value")
        return "";
    if (source == "value-as-number")
        return 0;
    return null;
};
if (defaultStyle) {
    defaultStyle.innerHTML = `@layer ux-preload {
        :host { display: none; }
    }`;
}
// ============================================
// ДЕКОРАТОРЫ И УТИЛИТЫ
// ============================================
export function withProperties(ctr) {
    const proto = ctr.prototype ?? Object.getPrototypeOf(ctr) ?? ctr;
    const $prev = proto?.$init ?? ctr?.$init;
    proto.$init = function (...args) {
        $prev?.call?.(this, ...args);
        // Collect defKeys from entire prototype chain (child-first, skip duplicates)
        const allDefs = {};
        let p = Object.getPrototypeOf(this) ?? this;
        while (p) {
            if (Object.hasOwn(p, defKeys)) {
                const defs = Object.assign({}, Object.getOwnPropertyDescriptors(p), p[defKeys] ?? {});
                for (const k of Object.keys(defs)) {
                    if (!(k in allDefs)) {
                        allDefs[k] = defs[k];
                    }
                    ;
                }
            }
            p = Object.getPrototypeOf(p);
        }
        for (const [key, def] of Object.entries(allDefs)) {
            const exists = this[key];
            if (def != null) {
                Object.defineProperty(this, key, def);
            }
            try {
                this[key] = exists || this[key];
            }
            catch (e) { }
        }
        return this;
    };
    return ctr;
}
export function generateName(length = 8) {
    let r = '';
    const l = characters.length;
    for (let i = 0; i < length; i++) {
        r += characters.charAt(Math.floor(Math.random() * l));
    }
    return r;
}
export function defineElement(name, options) {
    return function (target, _key) {
        try {
            if (typeof customElements === "undefined" || !name)
                return target;
            const existing = customElements.get(name);
            if (existing)
                return existing;
            customElements.define(name, target, options);
        }
        catch (e) {
            if (e?.name === "NotSupportedError" || /has already been used|already been defined/i.test(e?.message || "")) {
                return (customElements?.get?.(name) ?? target);
            }
            throw e;
        }
        return target;
    };
}
export function property(options = {}) {
    const { attribute, source, name, from } = options;
    return function (target, key) {
        const attrName = typeof attribute == "string" ? attribute : (name ?? key);
        if (attribute !== false && attrName != null) {
            const ctor = target.constructor;
            if (!ctor.observedAttributes) {
                ctor.observedAttributes = [];
            }
            if (ctor.observedAttributes.indexOf(attrName) < 0) {
                ctor.observedAttributes.push(attrName);
            }
        }
        if (!Object.hasOwn(target, defKeys))
            target[defKeys] = {};
        target[defKeys][key] = {
            get() {
                const ROOT = this;
                const inRender = ROOT[inRenderKey];
                const sourceTarget = !from ? ROOT : (from instanceof HTMLElement ? from : (typeof from == "string" ? Q?.(from, ROOT) : ROOT));
                let store = propStore.get(ROOT);
                let stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) {
                        propStore.set(ROOT, store = new Map());
                    }
                    if (!store?.has?.(key)) {
                        store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(getDef(source)));
                    }
                }
                if (inRender)
                    return stored;
                if (stored?.element instanceof HTMLElement)
                    return stored?.element;
                return ((typeof stored == "object" || typeof stored == "function") && (stored?.value != null || "value" in stored)) ? stored?.value : stored;
            },
            set(newValue) {
                const ROOT = this;
                const sourceTarget = !from ? ROOT : (from instanceof HTMLElement ? from : (typeof from == "string" ? Q?.(from, ROOT) : ROOT));
                let store = propStore.get(ROOT);
                let stored = store?.get?.(key);
                if (stored == null && source != null) {
                    if (!store) {
                        propStore.set(ROOT, store = new Map());
                    }
                    if (!store?.has?.(key)) {
                        const initialValue = (((typeof newValue == 'object' || typeof newValue == 'function') ? (newValue?.value) : null) ?? newValue) ?? getDef(source);
                        store?.set?.(key, stored = defineSource(source, sourceTarget, name || key)?.(initialValue));
                    }
                }
                else if (typeof stored == "object" || typeof stored == "function") {
                    try {
                        if (typeof newValue == 'object' && newValue != null && ((newValue?.value == null && !("value" in newValue)) || typeof newValue?.value == "object" || typeof newValue?.value == "function")) {
                            Object.assign(stored, newValue?.value ?? newValue);
                        }
                        else {
                            stored.value = ((typeof newValue == 'object' || typeof newValue == 'function') ? (newValue?.value) : null) ?? newValue;
                        }
                    }
                    catch (e) {
                        console.warn("Error setting property value:", e);
                    }
                }
            },
            enumerable: true,
            configurable: true,
        };
    };
}
// ============================================
// СТИЛИ
// ============================================
const adoptedStyleSheetsCache = new WeakMap();
const addAdoptedSheetToElement = (bTo, sheet) => {
    let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
    if (!adoptedSheets) {
        adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
    }
    if (sheet && adoptedSheets.indexOf(sheet) < 0) {
        adoptedSheets.push(sheet);
    }
    if (bTo.shadowRoot) {
        bTo.shadowRoot.adoptedStyleSheets = [
            ...(bTo.shadowRoot.adoptedStyleSheets || []),
            ...adoptedSheets.filter((s) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))
        ];
    }
};
export const loadCachedStyles = (bTo, src) => {
    if (!src)
        return null;
    let resolvedSrc = src;
    if (typeof src == "function") {
        try {
            const weak = new WeakRef(bTo);
            resolvedSrc = src.call(bTo, weak);
        }
        catch (e) {
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
            }
            else if (result != null) {
                loadCachedStyles(bTo, result);
            }
        }).catch((e) => {
            console.warn("Error loading adopted stylesheet:", e);
        });
        return null;
    }
    if (typeof resolvedSrc == "string" || resolvedSrc instanceof Blob || resolvedSrc instanceof File) {
        const adopted = loadAsAdopted(resolvedSrc, "");
        if (adopted) {
            let adoptedSheets = adoptedStyleSheetsCache.get(bTo);
            if (!adoptedSheets) {
                adoptedStyleSheetsCache.set(bTo, adoptedSheets = []);
            }
            const addAdoptedSheet = (sheet) => {
                if (sheet && adoptedSheets.indexOf(sheet) < 0) {
                    adoptedSheets.push(sheet);
                }
                if (bTo.shadowRoot) {
                    bTo.shadowRoot.adoptedStyleSheets = [
                        ...(bTo.shadowRoot.adoptedStyleSheets || []),
                        ...adoptedSheets.filter((s) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))
                    ];
                }
            };
            if (adopted instanceof Promise) {
                adopted.then(addAdoptedSheet).catch((e) => {
                    console.warn("Error loading adopted stylesheet:", e);
                });
                return null;
            }
            else {
                addAdoptedSheet(adopted);
                return null;
            }
        }
    }
    const source = ((typeof src == "function" || typeof src == "object") ? styleElementCache : styleCache);
    const cached = source.get(src);
    let styleElement = cached?.styleElement;
    let vars = cached?.vars;
    if (!cached) {
        let styles = ``;
        let props = [];
        if (typeof resolvedSrc == "string") {
            styles = resolvedSrc || "";
        }
        else if (typeof resolvedSrc == "object" && resolvedSrc != null) {
            if (resolvedSrc instanceof HTMLStyleElement) {
                styleElement = resolvedSrc;
            }
            else {
                styles = typeof resolvedSrc.css == "string" ? resolvedSrc.css : (typeof resolvedSrc == "string" ? resolvedSrc : String(resolvedSrc));
                props = resolvedSrc?.props ?? props;
                vars = resolvedSrc?.vars ?? vars;
            }
        }
        if (!styleElement && styles) {
            styleElement = loadInlineStyle(styles, bTo, "ux-layer");
        }
        source.set(src, { css: styles, props, vars, styleElement });
    }
    return styleElement;
};
export const isNotExtended = (el) => {
    return !((el instanceof HTMLDivElement) ||
        (el instanceof HTMLImageElement) ||
        (el instanceof HTMLVideoElement) ||
        (el instanceof HTMLCanvasElement)) && !(el?.hasAttribute?.("is") || el?.getAttribute?.("is") != null);
};
export const customElement = defineElement;
// ============================================
// ГЛАВНАЯ ФУНКЦИЯ GLitElement
// ============================================
/**
 * GLitElement: Создаёт базовый класс для кастомных элементов с расширенными возможностями.
 * Поддерживает все lifecycle callbacks Web Components.
 *
 * @param derivate - Базовый класс для расширения (по умолчанию HTMLElement).
 * @returns Конструктор расширенного класса с полной поддержкой lifecycle.
 *
 * @example
 * ```typescript
 * // Базовое использование
 * class MyElement extends GLitElement() {
 *     connectedCallback() {
 *         super.connectedCallback();
 *         console.log('Connected!');
 *     }
 *
 *     render() {
 *         return H`<div>Hello</div>`;
 *     }
 * }
 *
 * // С наследованием от другого элемента
 * class MyButton extends GLitElement(HTMLButtonElement) {
 *     static observedAttributes = ['disabled'];
 *
 *     attributeChangedCallback(name, oldVal, newVal) {
 *         console.log(`${name} changed from ${oldVal} to ${newVal}`);
 *     }
 * }
 *
 * // С декоратором
 * @defineElement('my-element')
 * class MyElement extends GLitElement() {
 *     @property({ source: 'attr', name: 'value' })
 *     value: string = '';
 *
 *     disconnectedCallback() {
 *         console.log('Disconnected!');
 *     }
 * }
 * ```
 */
export function GLitElement(derivate) {
    const Base = (derivate ?? HTMLElement);
    // Проверяем кэш
    const cached = CSM.get(Base);
    if (cached)
        return cached;
    /**
     * Внутренний класс с полной реализацией lifecycle
     */
    class GLitElementImpl extends Base {
        #shadowDOM;
        #styleElement;
        #defaultStyle;
        #initialized = false;
        styleLibs = [];
        adoptedStyleSheets = [];
        // Геттеры для переопределения в подклассах
        get styles() { return undefined; }
        get initialAttributes() { return undefined; }
        styleLayers() { return []; }
        render(_weak) {
            return document.createElement("slot");
        }
        constructor(...args) {
            super(...args);
            if (isNotExtended(this)) {
                const shadowRoot = addRoot(this.shadowRoot ??
                    this.createShadowRoot?.() ??
                    this.attachShadow({ mode: "open" }));
                const defStyle = (this.#defaultStyle ??= defaultStyle?.cloneNode?.(true));
                const layersStyle = shadowRoot.querySelector(`style[data-type="ux-layer"]`);
                if (layersStyle) {
                    layersStyle.after(defStyle);
                }
                else {
                    shadowRoot.prepend(defStyle);
                }
            }
            this.styleLibs ??= [];
        }
        $makeLayers() {
            return `@layer ${["ux-preload", "ux-layer", ...(this.styleLayers?.() ?? [])].join?.(",") ?? ""};`;
        }
        onInitialize(_weak) {
            return this;
        }
        onRender(_weak) {
            return this;
        }
        getProperty(key) {
            const current = this[inRenderKey];
            this[inRenderKey] = true;
            const cp = this[key];
            this[inRenderKey] = current;
            if (!current) {
                delete this[inRenderKey];
            }
            return cp;
        }
        loadStyleLibrary($module) {
            const root = this.shadowRoot;
            const module = typeof $module == "function" ? $module?.(root) : $module;
            if (module instanceof HTMLStyleElement) {
                this.styleLibs?.push?.(module);
                if (this.#styleElement?.isConnected) {
                    this.#styleElement?.before?.(module);
                }
                else {
                    this.shadowRoot?.prepend?.(module);
                }
            }
            else if (module instanceof CSSStyleSheet) {
                let adoptedSheets = adoptedStyleSheetsCache.get(this);
                if (!adoptedSheets) {
                    adoptedStyleSheetsCache.set(this, adoptedSheets = []);
                }
                if (adoptedSheets.indexOf(module) < 0) {
                    adoptedSheets.push(module);
                }
                if (root) {
                    root.adoptedStyleSheets = [
                        ...(root.adoptedStyleSheets || []),
                        ...adoptedSheets.filter((s) => !root.adoptedStyleSheets?.includes(s))
                    ];
                }
            }
            else {
                const adopted = loadAsAdopted(module, "ux-layer");
                let adoptedSheets = adoptedStyleSheetsCache.get(this);
                if (!adoptedSheets) {
                    adoptedStyleSheetsCache.set(this, adoptedSheets = []);
                }
                const addAdoptedSheet = (sheet) => {
                    if (sheet && adoptedSheets.indexOf(sheet) < 0) {
                        adoptedSheets.push(sheet);
                    }
                    if (root) {
                        root.adoptedStyleSheets = [
                            ...(root.adoptedStyleSheets || []),
                            ...adoptedSheets.filter((s) => !root.adoptedStyleSheets?.includes(s))
                        ];
                    }
                };
                if (adopted instanceof Promise) {
                    adopted.then(addAdoptedSheet).catch(() => { });
                }
                else if (adopted) {
                    addAdoptedSheet(adopted);
                }
            }
            return this;
        }
        createShadowRoot() {
            return addRoot(this.shadowRoot ?? this.attachShadow({ mode: "open" }));
        }
        // ============================================
        // LIFECYCLE CALLBACKS
        // ============================================
        /**
         * Вызывается когда элемент добавлен в DOM
         */
        connectedCallback() {
            // Вызываем родительский метод если есть
            if (super.connectedCallback) {
                super.connectedCallback();
            }
            const weak = new WeakRef(this);
            if (!this.#initialized) {
                this.#initialized = true;
                const shadowRoot = isNotExtended(this)
                    ? (this.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" }))
                    : this.shadowRoot;
                // Инициализация свойств
                const ctor = this.constructor;
                const init = this.$init ?? ctor.prototype?.$init;
                if (typeof init === "function")
                    init.call(this);
                // Установка атрибутов
                const attrs = typeof this.initialAttributes == "function"
                    ? this.initialAttributes()
                    : this.initialAttributes;
                setAttributesIfNull(this, attrs);
                this.onInitialize?.call(this, weak);
                this[inRenderKey] = true;
                if (isNotExtended(this) && shadowRoot) {
                    const rendered = this.render?.call?.(this, weak) ?? document.createElement("slot");
                    const styleElement = loadCachedStyles(this, this.styles);
                    if (styleElement instanceof HTMLStyleElement) {
                        this.#styleElement = styleElement;
                    }
                    const elements = [
                        H `<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
                        this.#defaultStyle,
                        ...(this.styleLibs.map(x => x.cloneNode?.(true)) || []),
                        styleElement,
                        rendered
                    ].filter((x) => x != null && isElement(x));
                    shadowRoot.append(...elements);
                    const adoptedSheets = adoptedStyleSheetsCache.get(this) || [];
                    if (adoptedSheets.length > 0) {
                        shadowRoot.adoptedStyleSheets = [
                            ...adoptedSheets.filter((s) => !shadowRoot.adoptedStyleSheets?.includes(s)),
                            ...new Set([...(shadowRoot.adoptedStyleSheets || [])])
                        ];
                    }
                }
                this.onRender?.call?.(this, weak);
                delete this[inRenderKey];
            }
        }
        /**
         * Вызывается когда элемент удалён из DOM
         */
        disconnectedCallback() {
            if (super.disconnectedCallback) {
                super.disconnectedCallback();
            }
        }
        /**
         * Вызывается когда элемент перемещён в новый документ
         */
        adoptedCallback() {
            if (super.adoptedCallback) {
                super.adoptedCallback();
            }
        }
        /**
         * Вызывается когда наблюдаемый атрибут изменился
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (super.attributeChangedCallback) {
                super.attributeChangedCallback(name, oldValue, newValue);
            }
        }
    }
    // Применяем withProperties и кэшируем
    const result = withProperties(GLitElementImpl);
    CSM.set(Base, result);
    console.log("result", result);
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2xpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkdsaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRW5HLE9BQU8sRUFDSCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixVQUFVLEVBQ1YsU0FBUyxFQUNULFFBQVEsRUFDUixPQUFPLEVBQ1AsT0FBTyxFQUNWLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTVDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUUzQyxFQUFFO0FBQ0YsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLGlCQUFpQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxPQUFPLEVBQTRCLENBQUM7QUFDMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQThCLENBQUM7QUFFdEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDNUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDaEcsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUNsQyxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzFGLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUNGLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7SUFDbkMsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUFFLE9BQU8sUUFBUSxDQUFDO0lBQ2hELElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUFFLE9BQU8sT0FBTyxDQUFDO0lBQzlDLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLE1BQU0sVUFBVSxHQUFHLHNEQUFzRCxDQUFDO0FBQzFFLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QyxNQUFNLFlBQVksR0FBRyxPQUFPLFFBQVEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRWhHLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBb0IsRUFBRSxNQUFXLEVBQUUsSUFBb0IsRUFBRSxFQUFFO0lBQzdFLElBQUksTUFBTSxJQUFJLE1BQU07UUFBRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEUsSUFBSSxNQUFNLElBQUksT0FBTztRQUFFLE9BQU8sYUFBYSxDQUFDO0lBQzVDLElBQUksTUFBTSxJQUFJLE9BQU87UUFBRSxPQUFPLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RSxJQUFJLE1BQU0sSUFBSSxjQUFjO1FBQUUsT0FBTyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsSUFBSSxNQUFNLENBQUMsQ0FBQztJQUMzRyxJQUFJLE1BQU0sSUFBSSxjQUFjO1FBQUUsT0FBTyxlQUFlLENBQUM7SUFDckQsSUFBSSxNQUFNLElBQUksYUFBYTtRQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsSUFBSyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUM7SUFDOUcsSUFBSSxNQUFNLElBQUksYUFBYTtRQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFLLENBQUMsSUFBSSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDaEgsSUFBSSxNQUFNLElBQUksWUFBWTtRQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsSUFBSyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUM7SUFDNUcsSUFBSSxNQUFNLElBQUksWUFBWTtRQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFLLENBQUMsSUFBSSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUcsSUFBSSxNQUFNLElBQUksUUFBUTtRQUFFLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFLLENB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QXdCLENBQUMsSUFBWSxFQUFFLFFBQXVCLEVBQUUsUUFBdUI7WUFDbkYsSUFBSSxLQUFLLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztnQkFDakMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDN0QsQ0FBQztRQUNMLENBQUM7S0FDSjtJQUVELHNDQUFzQztJQUN0QyxNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsZUFBNkUsQ0FBQyxDQUFDO0lBQzdHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTlCLE9BQU8sTUFBd0MsQ0FBQztBQUNwRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVmIH0gZnJvbSBcImZlc3Qvb2JqZWN0XCI7XG5pbXBvcnQgeyBhZGRSb290LCBpc0VsZW1lbnQsIGxvYWRBc0Fkb3B0ZWQsIGxvYWRJbmxpbmVTdHlsZSwgc2V0QXR0cmlidXRlc0lmTnVsbCB9IGZyb20gXCJmZXN0L2RvbVwiO1xuXG5pbXBvcnQge1xuICAgIHZhbHVlQXNOdW1iZXJSZWYsXG4gICAgbG9jYWxTdG9yYWdlUmVmLFxuICAgIG1hdGNoTWVkaWFSZWYsXG4gICAgY2hlY2tlZFJlZixcbiAgICBzY3JvbGxSZWYsXG4gICAgdmFsdWVSZWYsXG4gICAgc2l6ZVJlZixcbiAgICBhdHRyUmVmXG59IGZyb20gXCIuLi8uLi9sdXJlL2NvcmUvUmVmc1wiO1xuXG5pbXBvcnQgeyBRIH0gZnJvbSBcIi4uLy4uL2x1cmUvbm9kZS9RdWVyaWVkXCI7XG5pbXBvcnQgeyBFIH0gZnJvbSBcIi4uLy4uL2x1cmUvbm9kZS9CaW5kaW5nc1wiO1xuaW1wb3J0IHsgSCB9IGZyb20gXCIuLi8uLi9sdXJlL25vZGUvU3ludGF4XCI7XG5cbi8vXG5jb25zdCBzdHlsZUNhY2hlID0gbmV3IE1hcCgpO1xuY29uc3Qgc3R5bGVFbGVtZW50Q2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgcHJvcFN0b3JlID0gbmV3IFdlYWtNYXA8b2JqZWN0LCBNYXA8c3RyaW5nLCBhbnk+PigpO1xuY29uc3QgQ1NNID0gbmV3IFdlYWtNYXA8V2Vha0tleSB8IEhUTUxFbGVtZW50LCBhbnk+KCk7XG5cbmNvbnN0IGNhbWVsVG9LZWJhYiA9IChzdHI6IHN0cmluZykgPT4gc3RyLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG5jb25zdCBrZWJhYlRvQ2FtZWwgPSAoc3RyOiBzdHJpbmcpID0+IHN0ci5yZXBsYWNlKC8tKFthLXpdKS9nLCAoXywgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbmNvbnN0IHdoZW5Cb3hWYWxpZCA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBjYiA9IGNhbWVsVG9LZWJhYihuYW1lKTtcbiAgICBpZiAoW1wiYm9yZGVyLWJveFwiLCBcImNvbnRlbnQtYm94XCIsIFwiZGV2aWNlLXBpeGVsLWNvbnRlbnQtYm94XCJdLmluZGV4T2YoY2IpID49IDApIHJldHVybiBjYjtcbiAgICByZXR1cm4gbnVsbDtcbn07XG5jb25zdCB3aGVuQXhpc1ZhbGlkID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGNiID0gY2FtZWxUb0tlYmFiKG5hbWUpO1xuICAgIGlmIChjYj8uc3RhcnRzV2l0aD8uKFwiaW5saW5lXCIpKSByZXR1cm4gXCJpbmxpbmVcIjtcbiAgICBpZiAoY2I/LnN0YXJ0c1dpdGg/LihcImJsb2NrXCIpKSByZXR1cm4gXCJibG9ja1wiO1xuICAgIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgY2hhcmFjdGVycyA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbmNvbnN0IGluUmVuZGVyS2V5ID0gU3ltYm9sLmZvcihcIkByZW5kZXJAXCIpO1xuY29uc3QgZGVmS2V5cyA9IFN5bWJvbC5mb3IoXCJAZGVmS2V5c0BcIik7XG5jb25zdCBkZWZhdWx0U3R5bGUgPSB0eXBlb2YgZG9jdW1lbnQgIT0gXCJ1bmRlZmluZWRcIiA/IGRvY3VtZW50Py5jcmVhdGVFbGVtZW50Py4oXCJzdHlsZVwiKSA6IG51bGw7XG5cbmNvbnN0IGRlZmluZVNvdXJjZSA9IChzb3VyY2U6IHN0cmluZyB8IGFueSwgaG9sZGVyOiBhbnksIG5hbWU/OiBzdHJpbmcgfCBudWxsKSA9PiB7XG4gICAgaWYgKHNvdXJjZSA9PSBcImF0dHJcIikgcmV0dXJuIGF0dHJSZWYuYmluZChudWxsLCBob2xkZXIsIG5hbWUgfHwgXCJcIik7XG4gICAgaWYgKHNvdXJjZSA9PSBcIm1lZGlhXCIpIHJldHVybiBtYXRjaE1lZGlhUmVmO1xuICAgIGlmIChzb3VyY2UgPT0gXCJxdWVyeVwiKSByZXR1cm4gKHZhbDogc3RyaW5nKSA9PiBRPy4obmFtZSB8fCB2YWwgfHwgXCJcIiwgaG9sZGVyKTtcbiAgICBpZiAoc291cmNlID09IFwicXVlcnktc2hhZG93XCIpIHJldHVybiAodmFsOiBzdHJpbmcpID0+IFE/LihuYW1lIHx8IHZhbCB8fCBcIlwiLCBob2xkZXI/LnNoYWRvd1Jvb3QgPz8gaG9sZGVyKTtcbiAgICBpZiAoc291cmNlID09IFwibG9jYWxTdG9yYWdlXCIpIHJldHVybiBsb2NhbFN0b3JhZ2VSZWY7XG4gICAgaWYgKHNvdXJjZSA9PSBcImlubGluZS1zaXplXCIpIHJldHVybiBzaXplUmVmLmJpbmQobnVsbCwgaG9sZGVyLCBcImlubGluZVwiLCB3aGVuQm94VmFsaWQobmFtZSEpIHx8IFwiYm9yZGVyLWJveFwiKTtcbiAgICBpZiAoc291cmNlID09IFwiY29udGVudC1ib3hcIikgcmV0dXJuIHNpemVSZWYuYmluZChudWxsLCBob2xkZXIsIHdoZW5BeGlzVmFsaWQobmFtZSEpIHx8IFwiaW5saW5lXCIsIFwiY29udGVudC1ib3hcIik7XG4gICAgaWYgKHNvdXJjZSA9PSBcImJsb2NrLXNpemVcIikgcmV0dXJuIHNpemVSZWYuYmluZChudWxsLCBob2xkZXIsIFwiYmxvY2tcIiwgd2hlbkJveFZhbGlkKG5hbWUhKSB8fCBcImJvcmRlci1ib3hcIik7XG4gICAgaWYgKHNvdXJjZSA9PSBcImJvcmRlci1ib3hcIikgcmV0dXJuIHNpemVSZWYuYmluZChudWxsLCBob2xkZXIsIHdoZW5BeGlzVmFsaWQobmFtZSEpIHx8IFwiaW5saW5lXCIsIFwiYm9yZGVyLWJveFwiKTtcbiAgICBpZiAoc291cmNlID09IFwic2Nyb2xsXCIpIHJldHVybiBzY3JvbGxSZWYuYmluZChudWxsLCBob2xkZXIsIHdoZW5BeGlzVmFsaWQobmFtZSEpIHx8IFwiaW5saW5lXCIpO1xuICAgIGlmIChzb3VyY2UgPT0gXCJkZXZpY2UtcGl4ZWwtY29udGVudC1ib3hcIikgcmV0dXJuIHNpemVSZWYuYmluZChudWxsLCBob2xkZXIsIHdoZW5BeGlzVmFsaWQobmFtZSEpIHx8IFwiaW5saW5lXCIsIFwiZGV2aWNlLXBpeGVsLWNvbnRlbnQtYm94XCIpO1xuICAgIGlmIChzb3VyY2UgPT0gXCJjaGVja2VkXCIpIHJldHVybiBjaGVja2VkUmVmLmJpbmQobnVsbCwgaG9sZGVyKTtcbiAgICBpZiAoc291cmNlID09IFwidmFsdWVcIikgcmV0dXJuIHZhbHVlUmVmLmJpbmQobnVsbCwgaG9sZGVyKTtcbiAgICBpZiAoc291cmNlID09IFwidmFsdWUtYXMtbnVtYmVyXCIpIHJldHVybiB2YWx1ZUFzTnVtYmVyUmVmLmJpbmQobnVsbCwgaG9sZGVyKTtcbiAgICByZXR1cm4gcmVmO1xufTtcblxuaWYgKGRlZmF1bHRTdHlsZSkge1xuICAgIHR5cGVvZiBkb2N1bWVudCAhPSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcj8uKFwiaGVhZFwiKT8uYXBwZW5kQ2hpbGQ/LihkZWZhdWx0U3R5bGUpIDogbnVsbDtcbn1cblxuY29uc3QgZ2V0RGVmID0gKHNvdXJjZT86IHN0cmluZyB8IGFueSB8IG51bGwpOiBhbnkgPT4ge1xuICAgIGlmIChzb3VyY2UgPT0gXCJxdWVyeVwiKSByZXR1cm4gXCJpbnB1dFwiO1xuICAgIGlmIChzb3VyY2UgPT0gXCJxdWVyeS1zaGFkb3dcIikgcmV0dXJuIFwiaW5wdXRcIjtcbiAgICBpZiAoc291cmNlID09IFwibWVkaWFcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChzb3VyY2UgPT0gXCJsb2NhbFN0b3JhZ2VcIikgcmV0dXJuIG51bGw7XG4gICAgaWYgKHNvdXJjZSA9PSBcImF0dHJcIikgcmV0dXJuIG51bGw7XG4gICAgaWYgKHNvdXJjZSA9PSBcImlubGluZS1zaXplXCIpIHJldHVybiAwO1xuICAgIGlmIChzb3VyY2UgPT0gXCJibG9jay1zaXplXCIpIHJldHVybiAwO1xuICAgIGlmIChzb3VyY2UgPT0gXCJib3JkZXItYm94XCIpIHJldHVybiAwO1xuICAgIGlmIChzb3VyY2UgPT0gXCJjb250ZW50LWJveFwiKSByZXR1cm4gMDtcbiAgICBpZiAoc291cmNlID09IFwic2Nyb2xsXCIpIHJldHVybiAwO1xuICAgIGlmIChzb3VyY2UgPT0gXCJkZXZpY2UtcGl4ZWwtY29udGVudC1ib3hcIikgcmV0dXJuIDA7XG4gICAgaWYgKHNvdXJjZSA9PSBcImNoZWNrZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChzb3VyY2UgPT0gXCJ2YWx1ZVwiKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoc291cmNlID09IFwidmFsdWUtYXMtbnVtYmVyXCIpIHJldHVybiAwO1xuICAgIHJldHVybiBudWxsO1xufTtcblxuaWYgKGRlZmF1bHRTdHlsZSkge1xuICAgIGRlZmF1bHRTdHlsZS5pbm5lckhUTUwgPSBgQGxheWVyIHV4LXByZWxvYWQge1xuICAgICAgICA6aG9zdCB7IGRpc3BsYXk6IG5vbmU7IH1cbiAgICB9YDtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vINCi0JjQn9CrINCU0JvQryBXRUIgQ09NUE9ORU5UUyBMSUZFQ1lDTEVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICog0JjQvdGC0LXRgNGE0LXQudGBIGxpZmVjeWNsZSBjYWxsYmFja3Mg0LTQu9GPIEN1c3RvbSBFbGVtZW50c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRMaWZlY3ljbGUge1xuICAgIGNvbm5lY3RlZENhbGxiYWNrPygpOiB0aGlzfHZvaWR8dW5kZWZpbmVkO1xuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrPygpOiB0aGlzfHZvaWR8dW5kZWZpbmVkO1xuICAgIGFkb3B0ZWRDYWxsYmFjaz8oKTogdGhpc3x2b2lkfHVuZGVmaW5lZDtcbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s/KG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZyB8IG51bGwsIG5ld1ZhbHVlOiBzdHJpbmcgfCBudWxsKTogdGhpc3x2b2lkfHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiDQodGC0LDRgtC40YfQtdGB0LrQuNC1INGB0LLQvtC50YHRgtCy0LAgQ3VzdG9tIEVsZW1lbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50U3RhdGljIHtcbiAgICBvYnNlcnZlZEF0dHJpYnV0ZXM/OiBzdHJpbmdbXTtcbiAgICBmb3JtQXNzb2NpYXRlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICog0JHQsNC30L7QstGL0Lkg0LjQvdGC0LXRgNGE0LXQudGBINC00LvRjyBDdXN0b20gRWxlbWVudCDRgSBsaWZlY3ljbGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50LCBDdXN0b21FbGVtZW50TGlmZWN5Y2xlIHt9XG5cbi8qKlxuICog0JjQvdGC0LXRgNGE0LXQudGBINC00LvRjyDRgNCw0YHRiNC40YDQtdC90L3Ri9GFINGB0LLQvtC50YHRgtCyIEdMaXRFbGVtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR0xpdEVsZW1lbnRJbnN0YW5jZSBleHRlbmRzIEN1c3RvbUVsZW1lbnRMaWZlY3ljbGUge1xuICAgIHN0eWxlcz86IGFueTtcbiAgICBpbml0aWFsQXR0cmlidXRlcz86IFJlY29yZDxzdHJpbmcsIGFueT4gfCAoKCkgPT4gUmVjb3JkPHN0cmluZywgYW55Pik7XG4gICAgc3R5bGVMaWJzOiBIVE1MU3R5bGVFbGVtZW50W107XG4gICAgYWRvcHRlZFN0eWxlU2hlZXRzOiBDU1NTdHlsZVNoZWV0W107XG4gICAgc3R5bGVMYXllcnMoKTogc3RyaW5nW107XG4gICAgcmVuZGVyKHdlYWs/OiBXZWFrUmVmPGFueT4pOiBIVE1MRWxlbWVudCB8IERvY3VtZW50RnJhZ21lbnQgfCBOb2RlO1xuICAgIG9uSW5pdGlhbGl6ZSh3ZWFrPzogV2Vha1JlZjxhbnk+KTogdGhpc3x2b2lkfHVuZGVmaW5lZDtcbiAgICBvblJlbmRlcih3ZWFrPzogV2Vha1JlZjxhbnk+KTogdGhpc3x2b2lkfHVuZGVmaW5lZDtcbiAgICBsb2FkU3R5bGVMaWJyYXJ5KG1vZHVsZTogYW55KTogdGhpc3x2b2lkfHVuZGVmaW5lZDtcbiAgICBjcmVhdGVTaGFkb3dSb290KCk6IFNoYWRvd1Jvb3Q7XG4gICAgJGluaXQ/KCk6IHZvaWQ7XG59XG5cbi8qKlxuICog0KLQuNC/INC60L7QvdGB0YLRgNGD0LrRgtC+0YDQsCDQtNC70Y8gSFRNTEVsZW1lbnQg0Lgg0LXQs9C+INC90LDRgdC70LXQtNC90LjQutC+0LIg0YEg0L/QvtC00LTQtdGA0LbQutC+0LkgbGlmZWN5Y2xlXG4gKi9cbmV4cG9ydCB0eXBlIEhUTUxFbGVtZW50Q29uc3RydWN0b3I8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnlbXSk6IFQgJiBDdXN0b21FbGVtZW50TGlmZWN5Y2xlO1xuICAgIHByb3RvdHlwZTogVCAmIEN1c3RvbUVsZW1lbnRMaWZlY3ljbGU7XG59ICYgQ3VzdG9tRWxlbWVudFN0YXRpYztcblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINGA0LXQt9GD0LvRjNGC0LDRgtCwIEdMaXRFbGVtZW50IC0g0LrQvtC90YHRgtGA0YPQutGC0L7RgCDRgSDQv9C+0LvQvdC+0Lkg0L/QvtC00LTQtdGA0LbQutC+0LkgbGlmZWN5Y2xlXG4gKi9cbmV4cG9ydCB0eXBlIEdMaXRFbGVtZW50Q29uc3RydWN0b3I8VCBleHRlbmRzIEhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQ+ID0ge1xuICAgIG5ldyguLi5hcmdzOiBhbnlbXSk6IFQgJiBHTGl0RWxlbWVudEluc3RhbmNlO1xuICAgIHByb3RvdHlwZTogVCAmIEdMaXRFbGVtZW50SW5zdGFuY2U7XG59ICYgQ3VzdG9tRWxlbWVudFN0YXRpYztcblxuLyoqXG4gKiDQotC40L8g0LTQu9GPINC60LvQsNGB0YHQsCwg0LrQvtGC0L7RgNGL0Lkg0LzQvtC20L3QviDRgNCw0YHRiNC40YDRj9GC0YxcbiAqL1xuZXhwb3J0IHR5cGUgR0xpdEVsZW1lbnRDbGFzczxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4gPSBcbiAgICBHTGl0RWxlbWVudENvbnN0cnVjdG9yPFQ+ICYge1xuICAgICAgICBuZXcoLi4uYXJnczogYW55W10pOiBUICYgR0xpdEVsZW1lbnRJbnN0YW5jZSAmIEN1c3RvbUVsZW1lbnRMaWZlY3ljbGU7XG4gICAgfTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vINCU0JXQmtCe0KDQkNCi0J7QoNCrINCYINCj0KLQmNCb0JjQotCrXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFByb3BlcnRpZXM8VCBleHRlbmRzIEhUTUxFbGVtZW50Q29uc3RydWN0b3I+KGN0cjogVCk6IFQge1xuICAgIGNvbnN0IHByb3RvID0gY3RyLnByb3RvdHlwZSBhcyBhbnkgPz8gT2JqZWN0LmdldFByb3RvdHlwZU9mKGN0cikgPz8gY3RyO1xuICAgIGNvbnN0ICRwcmV2ID0gKHByb3RvIGFzIGFueSk/LiRpbml0ID8/IChjdHIgYXMgYW55KT8uJGluaXQ7XG4gICAgKHByb3RvIGFzIGFueSkuJGluaXQgPSBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAkcHJldj8uY2FsbD8uKHRoaXMsIC4uLmFyZ3MpO1xuXG4gICAgICAgIC8vIENvbGxlY3QgZGVmS2V5cyBmcm9tIGVudGlyZSBwcm90b3R5cGUgY2hhaW4gKGNoaWxkLWZpcnN0LCBza2lwIGR1cGxpY2F0ZXMpXG4gICAgICAgIGNvbnN0IGFsbERlZnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICAgICAgbGV0IHA6IGFueSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSA/PyB0aGlzO1xuICAgICAgICB3aGlsZSAocCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd24ocCwgZGVmS2V5cykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZzID0gT2JqZWN0LmFzc2lnbih7fSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocCksIHBbZGVmS2V5c10gPz8ge30pO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhkZWZzKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShrIGluIGFsbERlZnMpKSB7IGFsbERlZnNba10gPSBkZWZzW2tdOyB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGRlZl0gb2YgT2JqZWN0LmVudHJpZXMoYWxsRGVmcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IHRoaXNba2V5XTtcbiAgICAgICAgICAgIGlmIChkZWYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIGRlZiBhcyBQcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHsgdGhpc1trZXldID0gZXhpc3RzIHx8IHRoaXNba2V5XTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gY3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVOYW1lKGxlbmd0aCA9IDgpIHtcbiAgICBsZXQgciA9ICcnO1xuICAgIGNvbnN0IGwgPSBjaGFyYWN0ZXJzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHIgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUVsZW1lbnQobmFtZTogc3RyaW5nLCBvcHRpb25zPzogRWxlbWVudERlZmluaXRpb25PcHRpb25zKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxUIGV4dGVuZHMgSFRNTEVsZW1lbnRDb25zdHJ1Y3Rvcj4odGFyZ2V0OiBULCBfa2V5Pzogc3RyaW5nKTogVCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1c3RvbUVsZW1lbnRzID09PSBcInVuZGVmaW5lZFwiIHx8ICFuYW1lKSByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBjdXN0b21FbGVtZW50cy5nZXQobmFtZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcpIHJldHVybiBleGlzdGluZyBhcyB1bmtub3duIGFzIFQ7XG4gICAgICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUobmFtZSwgdGFyZ2V0IGFzIHVua25vd24gYXMgQ3VzdG9tRWxlbWVudENvbnN0cnVjdG9yLCBvcHRpb25zKTtcbiAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICBpZiAoZT8ubmFtZSA9PT0gXCJOb3RTdXBwb3J0ZWRFcnJvclwiIHx8IC9oYXMgYWxyZWFkeSBiZWVuIHVzZWR8YWxyZWFkeSBiZWVuIGRlZmluZWQvaS50ZXN0KGU/Lm1lc3NhZ2UgfHwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGN1c3RvbUVsZW1lbnRzPy5nZXQ/LihuYW1lKSA/PyB0YXJnZXQpIGFzIFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eU9wdGlvbnMge1xuICAgIGF0dHJpYnV0ZT86IHN0cmluZyB8IGJvb2xlYW47XG4gICAgc291cmNlPzogc3RyaW5nIHwgYW55O1xuICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgIGZyb20/OiBhbnkgfCBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydHkob3B0aW9uczogUHJvcGVydHlPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGF0dHJpYnV0ZSwgc291cmNlLCBuYW1lLCBmcm9tIH0gPSBvcHRpb25zO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgYXR0ck5hbWUgPSB0eXBlb2YgYXR0cmlidXRlID09IFwic3RyaW5nXCIgPyBhdHRyaWJ1dGUgOiAobmFtZSA/PyBrZXkpO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgIT09IGZhbHNlICYmIGF0dHJOYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0b3IgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBpZiAoIWN0b3Iub2JzZXJ2ZWRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgY3Rvci5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdG9yLm9ic2VydmVkQXR0cmlidXRlcy5pbmRleE9mKGF0dHJOYW1lKSA8IDApIHtcbiAgICAgICAgICAgICAgICBjdG9yLm9ic2VydmVkQXR0cmlidXRlcy5wdXNoKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghT2JqZWN0Lmhhc093bih0YXJnZXQsIGRlZktleXMpKSB0YXJnZXRbZGVmS2V5c10gPSB7fTtcblxuICAgICAgICB0YXJnZXRbZGVmS2V5c11ba2V5XSA9IHtcbiAgICAgICAgICAgIGdldCh0aGlzOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBST09UID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCBpblJlbmRlciA9IFJPT1RbaW5SZW5kZXJLZXldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZVRhcmdldCA9ICFmcm9tID8gUk9PVCA6IChmcm9tIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBmcm9tIDogKHR5cGVvZiBmcm9tID09IFwic3RyaW5nXCIgPyBRPy4oZnJvbSwgUk9PVCkgOiBST09UKSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgc3RvcmUgPSBwcm9wU3RvcmUuZ2V0KFJPT1QpO1xuICAgICAgICAgICAgICAgIGxldCBzdG9yZWQgPSBzdG9yZT8uZ2V0Py4oa2V5KTtcblxuICAgICAgICAgICAgICAgIGlmIChzdG9yZWQgPT0gbnVsbCAmJiBzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0b3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wU3RvcmUuc2V0KFJPT1QsIHN0b3JlID0gbmV3IE1hcCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0b3JlPy5oYXM/LihrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZT8uc2V0Py4oa2V5LCBzdG9yZWQgPSBkZWZpbmVTb3VyY2Uoc291cmNlLCBzb3VyY2VUYXJnZXQsIG5hbWUgfHwga2V5KT8uKGdldERlZihzb3VyY2UpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5SZW5kZXIpIHJldHVybiBzdG9yZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3JlZD8uZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSByZXR1cm4gc3RvcmVkPy5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHJldHVybiAoKHR5cGVvZiBzdG9yZWQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygc3RvcmVkID09IFwiZnVuY3Rpb25cIikgJiYgKHN0b3JlZD8udmFsdWUgIT0gbnVsbCB8fCBcInZhbHVlXCIgaW4gc3RvcmVkKSkgPyBzdG9yZWQ/LnZhbHVlIDogc3RvcmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCh0aGlzOiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBST09UID0gdGhpcztcbiAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VUYXJnZXQgPSAhZnJvbSA/IFJPT1QgOiAoZnJvbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID8gZnJvbSA6ICh0eXBlb2YgZnJvbSA9PSBcInN0cmluZ1wiID8gUT8uKGZyb20sIFJPT1QpIDogUk9PVCkpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlID0gcHJvcFN0b3JlLmdldChST09UKTtcbiAgICAgICAgICAgICAgICBsZXQgc3RvcmVkID0gc3RvcmU/LmdldD8uKGtleSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RvcmVkID09IG51bGwgJiYgc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdG9yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFN0b3JlLnNldChST09ULCBzdG9yZSA9IG5ldyBNYXAoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdG9yZT8uaGFzPy4oa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5pdGlhbFZhbHVlID0gKCgodHlwZW9mIG5ld1ZhbHVlID09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PSAnZnVuY3Rpb24nKSA/IChuZXdWYWx1ZT8udmFsdWUpIDogbnVsbCkgPz8gbmV3VmFsdWUpID8/IGdldERlZihzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmU/LnNldD8uKGtleSwgc3RvcmVkID0gZGVmaW5lU291cmNlKHNvdXJjZSwgc291cmNlVGFyZ2V0LCBuYW1lIHx8IGtleSk/Lihpbml0aWFsVmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0b3JlZCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzdG9yZWQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlID09ICdvYmplY3QnICYmIG5ld1ZhbHVlICE9IG51bGwgJiYgKChuZXdWYWx1ZT8udmFsdWUgPT0gbnVsbCAmJiAhKFwidmFsdWVcIiBpbiBuZXdWYWx1ZSkpIHx8IHR5cGVvZiBuZXdWYWx1ZT8udmFsdWUgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgbmV3VmFsdWU/LnZhbHVlID09IFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHN0b3JlZCwgbmV3VmFsdWU/LnZhbHVlID8/IG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkLnZhbHVlID0gKCh0eXBlb2YgbmV3VmFsdWUgPT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09ICdmdW5jdGlvbicpID8gKG5ld1ZhbHVlPy52YWx1ZSkgOiBudWxsKSA/PyBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRXJyb3Igc2V0dGluZyBwcm9wZXJ0eSB2YWx1ZTpcIiwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8g0KHQotCY0JvQmFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgYWRvcHRlZFN0eWxlU2hlZXRzQ2FjaGUgPSBuZXcgV2Vha01hcDxvYmplY3QsIENTU1N0eWxlU2hlZXRbXT4oKTtcblxuY29uc3QgYWRkQWRvcHRlZFNoZWV0VG9FbGVtZW50ID0gKGJUbzogYW55LCBzaGVldDogQ1NTU3R5bGVTaGVldCkgPT4ge1xuICAgIGxldCBhZG9wdGVkU2hlZXRzID0gYWRvcHRlZFN0eWxlU2hlZXRzQ2FjaGUuZ2V0KGJUbyk7XG4gICAgaWYgKCFhZG9wdGVkU2hlZXRzKSB7XG4gICAgICAgIGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlLnNldChiVG8sIGFkb3B0ZWRTaGVldHMgPSBbXSk7XG4gICAgfVxuICAgIGlmIChzaGVldCAmJiBhZG9wdGVkU2hlZXRzLmluZGV4T2Yoc2hlZXQpIDwgMCkge1xuICAgICAgICBhZG9wdGVkU2hlZXRzLnB1c2goc2hlZXQpO1xuICAgIH1cbiAgICBpZiAoYlRvLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgYlRvLnNoYWRvd1Jvb3QuYWRvcHRlZFN0eWxlU2hlZXRzID0gW1xuICAgICAgICAgICAgLi4uKGJUby5zaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cyB8fCBbXSksXG4gICAgICAgICAgICAuLi5hZG9wdGVkU2hlZXRzLmZpbHRlcigoczogQ1NTU3R5bGVTaGVldCkgPT4gIWJUby5zaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cz8uaW5jbHVkZXMocykpXG4gICAgICAgIF07XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRDYWNoZWRTdHlsZXMgPSAoYlRvOiBhbnksIHNyYzogYW55KTogSFRNTFN0eWxlRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGlmICghc3JjKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCByZXNvbHZlZFNyYyA9IHNyYztcbiAgICBpZiAodHlwZW9mIHNyYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZihiVG8pO1xuICAgICAgICAgICAgcmVzb2x2ZWRTcmMgPSBzcmMuY2FsbChiVG8sIHdlYWspO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJFcnJvciBjYWxsaW5nIHN0eWxlcyBmdW5jdGlvbjpcIiwgZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXNvbHZlZFNyYyAmJiB0eXBlb2YgQ1NTU3R5bGVTaGVldCAhPSBcInVuZGVmaW5lZFwiICYmIHJlc29sdmVkU3JjIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCkge1xuICAgICAgICBhZGRBZG9wdGVkU2hlZXRUb0VsZW1lbnQoYlRvLCByZXNvbHZlZFNyYyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChyZXNvbHZlZFNyYyBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgcmVzb2x2ZWRTcmMudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICAgICAgYWRkQWRvcHRlZFNoZWV0VG9FbGVtZW50KGJUbywgcmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsb2FkQ2FjaGVkU3R5bGVzKGJUbywgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRXJyb3IgbG9hZGluZyBhZG9wdGVkIHN0eWxlc2hlZXQ6XCIsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcInN0cmluZ1wiIHx8IHJlc29sdmVkU3JjIGluc3RhbmNlb2YgQmxvYiB8fCAocmVzb2x2ZWRTcmMgYXMgYW55KSBpbnN0YW5jZW9mIEZpbGUpIHtcbiAgICAgICAgY29uc3QgYWRvcHRlZCA9IGxvYWRBc0Fkb3B0ZWQocmVzb2x2ZWRTcmMsIFwiXCIpO1xuICAgICAgICBpZiAoYWRvcHRlZCkge1xuICAgICAgICAgICAgbGV0IGFkb3B0ZWRTaGVldHMgPSBhZG9wdGVkU3R5bGVTaGVldHNDYWNoZS5nZXQoYlRvKTtcbiAgICAgICAgICAgIGlmICghYWRvcHRlZFNoZWV0cykge1xuICAgICAgICAgICAgICAgIGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlLnNldChiVG8sIGFkb3B0ZWRTaGVldHMgPSBbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBhZGRBZG9wdGVkU2hlZXQgPSAoc2hlZXQ6IENTU1N0eWxlU2hlZXQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2hlZXQgJiYgYWRvcHRlZFNoZWV0cyEuaW5kZXhPZihzaGVldCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkb3B0ZWRTaGVldHMhLnB1c2goc2hlZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYlRvLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYlRvLnNoYWRvd1Jvb3QuYWRvcHRlZFN0eWxlU2hlZXRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uKGJUby5zaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cyB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5hZG9wdGVkU2hlZXRzIS5maWx0ZXIoKHM6IENTU1N0eWxlU2hlZXQpID0+ICFiVG8uc2hhZG93Um9vdC5hZG9wdGVkU3R5bGVTaGVldHM/LmluY2x1ZGVzKHMpKVxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoYWRvcHRlZCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBhZG9wdGVkLnRoZW4oYWRkQWRvcHRlZFNoZWV0KS5jYXRjaCgoZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkVycm9yIGxvYWRpbmcgYWRvcHRlZCBzdHlsZXNoZWV0OlwiLCBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWRkQWRvcHRlZFNoZWV0KGFkb3B0ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlID0gKCh0eXBlb2Ygc3JjID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjID09IFwib2JqZWN0XCIpID8gc3R5bGVFbGVtZW50Q2FjaGUgOiBzdHlsZUNhY2hlKTtcbiAgICBjb25zdCBjYWNoZWQgPSBzb3VyY2UuZ2V0KHNyYyk7XG4gICAgbGV0IHN0eWxlRWxlbWVudCA9IGNhY2hlZD8uc3R5bGVFbGVtZW50O1xuICAgIGxldCB2YXJzID0gY2FjaGVkPy52YXJzO1xuXG4gICAgaWYgKCFjYWNoZWQpIHtcbiAgICAgICAgbGV0IHN0eWxlcyA9IGBgO1xuICAgICAgICBsZXQgcHJvcHM6IGFueVtdID0gW107XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBzdHlsZXMgPSByZXNvbHZlZFNyYyB8fCBcIlwiO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcIm9iamVjdFwiICYmIHJlc29sdmVkU3JjICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChyZXNvbHZlZFNyYyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBzdHlsZUVsZW1lbnQgPSByZXNvbHZlZFNyYztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGVzID0gdHlwZW9mIChyZXNvbHZlZFNyYyBhcyBhbnkpLmNzcyA9PSBcInN0cmluZ1wiID8gKHJlc29sdmVkU3JjIGFzIGFueSkuY3NzIDogKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcInN0cmluZ1wiID8gcmVzb2x2ZWRTcmMgOiBTdHJpbmcocmVzb2x2ZWRTcmMpKTtcbiAgICAgICAgICAgICAgICBwcm9wcyA9IChyZXNvbHZlZFNyYyBhcyBhbnkpPy5wcm9wcyA/PyBwcm9wcztcbiAgICAgICAgICAgICAgICB2YXJzID0gKHJlc29sdmVkU3JjIGFzIGFueSk/LnZhcnMgPz8gdmFycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3R5bGVFbGVtZW50ICYmIHN0eWxlcykge1xuICAgICAgICAgICAgc3R5bGVFbGVtZW50ID0gbG9hZElubGluZVN0eWxlKHN0eWxlcywgYlRvLCBcInV4LWxheWVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlLnNldChzcmMsIHsgY3NzOiBzdHlsZXMsIHByb3BzLCB2YXJzLCBzdHlsZUVsZW1lbnQgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlRWxlbWVudDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc05vdEV4dGVuZGVkID0gKGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiAhKFxuICAgICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkgfHxcbiAgICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkgfHxcbiAgICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkgfHxcbiAgICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpXG4gICAgKSAmJiAhKGVsPy5oYXNBdHRyaWJ1dGU/LihcImlzXCIpIHx8IGVsPy5nZXRBdHRyaWJ1dGU/LihcImlzXCIpICE9IG51bGwpO1xufTtcblxuZXhwb3J0IGNvbnN0IGN1c3RvbUVsZW1lbnQgPSBkZWZpbmVFbGVtZW50O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8g0JPQm9CQ0JLQndCQ0K8g0KTQo9Cd0JrQptCY0K8gR0xpdEVsZW1lbnRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogR0xpdEVsZW1lbnQ6INCh0L7Qt9C00LDRkdGCINCx0LDQt9C+0LLRi9C5INC60LvQsNGB0YEg0LTQu9GPINC60LDRgdGC0L7QvNC90YvRhSDRjdC70LXQvNC10L3RgtC+0LIg0YEg0YDQsNGB0YjQuNGA0LXQvdC90YvQvNC4INCy0L7Qt9C80L7QttC90L7RgdGC0Y/QvNC4LlxuICog0J/QvtC00LTQtdGA0LbQuNCy0LDQtdGCINCy0YHQtSBsaWZlY3ljbGUgY2FsbGJhY2tzIFdlYiBDb21wb25lbnRzLlxuICogXG4gKiBAcGFyYW0gZGVyaXZhdGUgLSDQkdCw0LfQvtCy0YvQuSDQutC70LDRgdGBINC00LvRjyDRgNCw0YHRiNC40YDQtdC90LjRjyAo0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4gSFRNTEVsZW1lbnQpLlxuICogQHJldHVybnMg0JrQvtC90YHRgtGA0YPQutGC0L7RgCDRgNCw0YHRiNC40YDQtdC90L3QvtCz0L4g0LrQu9Cw0YHRgdCwINGBINC/0L7Qu9C90L7QuSDQv9C+0LTQtNC10YDQttC60L7QuSBsaWZlY3ljbGUuXG4gKiBcbiAqIEBleGFtcGxlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyDQkdCw0LfQvtCy0L7QtSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtVxuICogY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgR0xpdEVsZW1lbnQoKSB7XG4gKiAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gKiAgICAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XG4gKiAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQhJyk7XG4gKiAgICAgfVxuICogICAgIFxuICogICAgIHJlbmRlcigpIHtcbiAqICAgICAgICAgcmV0dXJuIEhgPGRpdj5IZWxsbzwvZGl2PmA7XG4gKiAgICAgfVxuICogfVxuICogXG4gKiAvLyDQoSDQvdCw0YHQu9C10LTQvtCy0LDQvdC40LXQvCDQvtGCINC00YDRg9Cz0L7Qs9C+INGN0LvQtdC80LXQvdGC0LBcbiAqIGNsYXNzIE15QnV0dG9uIGV4dGVuZHMgR0xpdEVsZW1lbnQoSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAqICAgICBzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gWydkaXNhYmxlZCddO1xuICogICAgIFxuICogICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuICogICAgICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfSBjaGFuZ2VkIGZyb20gJHtvbGRWYWx9IHRvICR7bmV3VmFsfWApO1xuICogICAgIH1cbiAqIH1cbiAqIFxuICogLy8g0KEg0LTQtdC60L7RgNCw0YLQvtGA0L7QvFxuICogQGRlZmluZUVsZW1lbnQoJ215LWVsZW1lbnQnKVxuICogY2xhc3MgTXlFbGVtZW50IGV4dGVuZHMgR0xpdEVsZW1lbnQoKSB7XG4gKiAgICAgQHByb3BlcnR5KHsgc291cmNlOiAnYXR0cicsIG5hbWU6ICd2YWx1ZScgfSlcbiAqICAgICB2YWx1ZTogc3RyaW5nID0gJyc7XG4gKiAgICAgXG4gKiAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gKiAgICAgICAgIGNvbnNvbGUubG9nKCdEaXNjb25uZWN0ZWQhJyk7XG4gKiAgICAgfVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBHTGl0RWxlbWVudDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudD4oXG4gICAgZGVyaXZhdGU/OiBIVE1MRWxlbWVudENvbnN0cnVjdG9yPFQ+XG4pOiBHTGl0RWxlbWVudENsYXNzPFQ+IHtcbiAgICBjb25zdCBCYXNlID0gKGRlcml2YXRlID8/IEhUTUxFbGVtZW50KSBhcyBIVE1MRWxlbWVudENvbnN0cnVjdG9yPFQ+O1xuXG4gICAgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INC60Y3RiFxuICAgIGNvbnN0IGNhY2hlZCA9IENTTS5nZXQoQmFzZSk7XG4gICAgaWYgKGNhY2hlZCkgcmV0dXJuIGNhY2hlZCBhcyBHTGl0RWxlbWVudENsYXNzPFQ+O1xuXG4gICAgLyoqXG4gICAgICog0JLQvdGD0YLRgNC10L3QvdC40Lkg0LrQu9Cw0YHRgSDRgSDQv9C+0LvQvdC+0Lkg0YDQtdCw0LvQuNC30LDRhtC40LXQuSBsaWZlY3ljbGVcbiAgICAgKi9cbiAgICBhYnN0cmFjdCBjbGFzcyBHTGl0RWxlbWVudEltcGwgZXh0ZW5kcyAoQmFzZSBhcyB1bmtub3duIGFzIG5ldyAoLi4uYXJnczogYW55W10pID0+IEhUTUxFbGVtZW50ICYgQ3VzdG9tRWxlbWVudExpZmVjeWNsZSkgaW1wbGVtZW50cyBHTGl0RWxlbWVudEluc3RhbmNlIHtcbiAgICAgICAgI3NoYWRvd0RPTT86IFNoYWRvd1Jvb3QgfCBudWxsO1xuICAgICAgICAjc3R5bGVFbGVtZW50PzogSFRNTFN0eWxlRWxlbWVudDtcbiAgICAgICAgI2RlZmF1bHRTdHlsZT86IEhUTUxTdHlsZUVsZW1lbnQ7XG4gICAgICAgICNpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHN0eWxlTGliczogSFRNTFN0eWxlRWxlbWVudFtdID0gW107XG4gICAgICAgIGFkb3B0ZWRTdHlsZVNoZWV0czogQ1NTU3R5bGVTaGVldFtdID0gW107XG5cbiAgICAgICAgLy8g0JPQtdGC0YLQtdGA0Ysg0LTQu9GPINC/0LXRgNC10L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQsiDQv9C+0LTQutC70LDRgdGB0LDRhVxuICAgICAgICBnZXQgc3R5bGVzKCk6IGFueSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICAgICAgZ2V0IGluaXRpYWxBdHRyaWJ1dGVzKCk6IFJlY29yZDxzdHJpbmcsIGFueT4gfCAoKCkgPT4gUmVjb3JkPHN0cmluZywgYW55PikgfCB1bmRlZmluZWQgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICAgICAgc3R5bGVMYXllcnMoKTogc3RyaW5nW10geyByZXR1cm4gW107IH1cblxuICAgICAgICByZW5kZXIoX3dlYWs/OiBXZWFrUmVmPGFueT4pOiBIVE1MRWxlbWVudCB8IERvY3VtZW50RnJhZ21lbnQgfCBOb2RlIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2xvdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgICAgIGlmIChpc05vdEV4dGVuZGVkKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGFkZFJvb3QoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhZG93Um9vdCA/PyBcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMgYXMgYW55KS5jcmVhdGVTaGFkb3dSb290Py4oKSA/PyBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVmU3R5bGUgPSAodGhpcy4jZGVmYXVsdFN0eWxlID8/PSBkZWZhdWx0U3R5bGU/LmNsb25lTm9kZT8uKHRydWUpIGFzIEhUTUxTdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxheWVyc1N0eWxlID0gc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKGBzdHlsZVtkYXRhLXR5cGU9XCJ1eC1sYXllclwiXWApO1xuICAgICAgICAgICAgICAgIGlmIChsYXllcnNTdHlsZSkge1xuICAgICAgICAgICAgICAgICAgICBsYXllcnNTdHlsZS5hZnRlcihkZWZTdHlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2hhZG93Um9vdC5wcmVwZW5kKGRlZlN0eWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0eWxlTGlicyA/Pz0gW107XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgJG1ha2VMYXllcnMoKTogc3RyaW5nIHtcbiAgICAgICAgICAgIHJldHVybiBgQGxheWVyICR7W1widXgtcHJlbG9hZFwiLCBcInV4LWxheWVyXCIsIC4uLih0aGlzLnN0eWxlTGF5ZXJzPy4oKSA/PyBbXSldLmpvaW4/LihcIixcIikgPz8gXCJcIn07YDtcbiAgICAgICAgfVxuXG4gICAgICAgICRpbml0PygpOiB2b2lkO1xuXG4gICAgICAgIG9uSW5pdGlhbGl6ZShfd2Vhaz86IFdlYWtSZWY8YW55Pik6IHRoaXMge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvblJlbmRlcihfd2Vhaz86IFdlYWtSZWY8YW55Pik6IHRoaXMge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UHJvcGVydHkoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9ICh0aGlzIGFzIGFueSlbaW5SZW5kZXJLZXldO1xuICAgICAgICAgICAgKHRoaXMgYXMgYW55KVtpblJlbmRlcktleV0gPSB0cnVlO1xuICAgICAgICAgICAgY29uc3QgY3AgPSAodGhpcyBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpW2luUmVuZGVyS2V5XSA9IGN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAoIWN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgKHRoaXMgYXMgYW55KVtpblJlbmRlcktleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3A7XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkU3R5bGVMaWJyYXJ5KCRtb2R1bGU6IGFueSk6IHRoaXMge1xuICAgICAgICAgICAgY29uc3Qgcm9vdCA9IHRoaXMuc2hhZG93Um9vdDtcbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHR5cGVvZiAkbW9kdWxlID09IFwiZnVuY3Rpb25cIiA/ICRtb2R1bGU/Lihyb290KSA6ICRtb2R1bGU7XG5cbiAgICAgICAgICAgIGlmIChtb2R1bGUgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZUxpYnM/LnB1c2g/Lihtb2R1bGUpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLiNzdHlsZUVsZW1lbnQ/LmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI3N0eWxlRWxlbWVudD8uYmVmb3JlPy4obW9kdWxlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYWRvd1Jvb3Q/LnByZXBlbmQ/Lihtb2R1bGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kdWxlIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldCkge1xuICAgICAgICAgICAgICAgIGxldCBhZG9wdGVkU2hlZXRzID0gYWRvcHRlZFN0eWxlU2hlZXRzQ2FjaGUuZ2V0KHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICghYWRvcHRlZFNoZWV0cykge1xuICAgICAgICAgICAgICAgICAgICBhZG9wdGVkU3R5bGVTaGVldHNDYWNoZS5zZXQodGhpcywgYWRvcHRlZFNoZWV0cyA9IFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFkb3B0ZWRTaGVldHMuaW5kZXhPZihtb2R1bGUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBhZG9wdGVkU2hlZXRzLnB1c2gobW9kdWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4ocm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgfHwgW10pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uYWRvcHRlZFNoZWV0cy5maWx0ZXIoKHM6IENTU1N0eWxlU2hlZXQpID0+ICFyb290LmFkb3B0ZWRTdHlsZVNoZWV0cz8uaW5jbHVkZXMocykpXG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZG9wdGVkID0gbG9hZEFzQWRvcHRlZChtb2R1bGUsIFwidXgtbGF5ZXJcIik7XG4gICAgICAgICAgICAgICAgbGV0IGFkb3B0ZWRTaGVldHMgPSBhZG9wdGVkU3R5bGVTaGVldHNDYWNoZS5nZXQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFhZG9wdGVkU2hlZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlLnNldCh0aGlzLCBhZG9wdGVkU2hlZXRzID0gW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBhZGRBZG9wdGVkU2hlZXQgPSAoc2hlZXQ6IENTU1N0eWxlU2hlZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoZWV0ICYmIGFkb3B0ZWRTaGVldHMhLmluZGV4T2Yoc2hlZXQpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRvcHRlZFNoZWV0cyEucHVzaChzaGVldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QuYWRvcHRlZFN0eWxlU2hlZXRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLihyb290LmFkb3B0ZWRTdHlsZVNoZWV0cyB8fCBbXSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uYWRvcHRlZFNoZWV0cyEuZmlsdGVyKChzOiBDU1NTdHlsZVNoZWV0KSA9PiAhcm9vdC5hZG9wdGVkU3R5bGVTaGVldHM/LmluY2x1ZGVzKHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGFkb3B0ZWQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkb3B0ZWQudGhlbihhZGRBZG9wdGVkU2hlZXQpLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhZG9wdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZEFkb3B0ZWRTaGVldChhZG9wdGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZVNoYWRvd1Jvb3QoKTogU2hhZG93Um9vdCB7XG4gICAgICAgICAgICByZXR1cm4gYWRkUm9vdCh0aGlzLnNoYWRvd1Jvb3QgPz8gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KSkgYXMgU2hhZG93Um9vdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIExJRkVDWUNMRSBDQUxMQkFDS1NcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICAvKipcbiAgICAgICAgICog0JLRi9C30YvQstCw0LXRgtGB0Y8g0LrQvtCz0LTQsCDRjdC70LXQvNC10L3RgiDQtNC+0LHQsNCy0LvQtdC9INCyIERPTVxuICAgICAgICAgKi9cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XG4gICAgICAgICAgICAvLyDQktGL0LfRi9Cy0LDQtdC8INGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDQvNC10YLQvtC0INC10YHQu9C4INC10YHRgtGMXG4gICAgICAgICAgICBpZiAoc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB3ZWFrID0gbmV3IFdlYWtSZWYodGhpcyk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy4jaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhZG93Um9vdCA9IGlzTm90RXh0ZW5kZWQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgPyAodGhpcy5jcmVhdGVTaGFkb3dSb290Py4oKSA/PyB0aGlzLnNoYWRvd1Jvb3QgPz8gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiBcIm9wZW5cIiB9KSlcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnNoYWRvd1Jvb3Q7XG5cbiAgICAgICAgICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdCy0L7QudGB0YLQslxuICAgICAgICAgICAgICAgIGNvbnN0IGN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yIGFzIGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbml0ID0gKHRoaXMgYXMgYW55KS4kaW5pdCA/PyAoY3RvciBhcyBhbnkpLnByb3RvdHlwZT8uJGluaXQ7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbml0ID09PSBcImZ1bmN0aW9uXCIpIGluaXQuY2FsbCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDQsNGC0YDQuNCx0YPRgtC+0LJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRycyA9IHR5cGVvZiB0aGlzLmluaXRpYWxBdHRyaWJ1dGVzID09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgICAgICA/ICh0aGlzLmluaXRpYWxBdHRyaWJ1dGVzIGFzICgpID0+IFJlY29yZDxzdHJpbmcsIGFueT4pKClcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmluaXRpYWxBdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgIHNldEF0dHJpYnV0ZXNJZk51bGwodGhpcywgYXR0cnMpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbkluaXRpYWxpemU/LmNhbGwodGhpcywgd2Vhayk7XG5cbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpW2luUmVuZGVyS2V5XSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNOb3RFeHRlbmRlZCh0aGlzKSAmJiBzaGFkb3dSb290KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVkID0gdGhpcy5yZW5kZXI/LmNhbGw/Lih0aGlzLCB3ZWFrKSA/PyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2xvdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R5bGVFbGVtZW50ID0gbG9hZENhY2hlZFN0eWxlcyh0aGlzLCB0aGlzLnN0eWxlcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3N0eWxlRWxlbWVudCA9IHN0eWxlRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgSGA8c3R5bGUgZGF0YS10eXBlPVwidXgtbGF5ZXJcIiBwcm9wOmlubmVySFRNTD0ke3RoaXMuJG1ha2VMYXllcnMoKX0+PC9zdHlsZT5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jZGVmYXVsdFN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uKHRoaXMuc3R5bGVMaWJzLm1hcCh4ID0+IHguY2xvbmVOb2RlPy4odHJ1ZSkpIHx8IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkXG4gICAgICAgICAgICAgICAgICAgIF0uZmlsdGVyKCh4KTogeCBpcyBOb2RlID0+IHggIT0gbnVsbCAmJiAoaXNFbGVtZW50KHgpIGFzIHVua25vd24gYXMgYm9vbGVhbikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1Jvb3QuYXBwZW5kKC4uLmVsZW1lbnRzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhZG9wdGVkU2hlZXRzID0gYWRvcHRlZFN0eWxlU2hlZXRzQ2FjaGUuZ2V0KHRoaXMpIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRvcHRlZFNoZWV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5hZG9wdGVkU2hlZXRzLmZpbHRlcigoczogQ1NTU3R5bGVTaGVldCkgPT4gIXNoYWRvd1Jvb3QuYWRvcHRlZFN0eWxlU2hlZXRzPy5pbmNsdWRlcyhzKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubmV3IFNldChbLi4uKHNoYWRvd1Jvb3QuYWRvcHRlZFN0eWxlU2hlZXRzIHx8IFtdKV0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlbmRlcj8uY2FsbD8uKHRoaXMsIHdlYWspO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAodGhpcyBhcyBhbnkpW2luUmVuZGVyS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQktGL0LfRi9Cy0LDQtdGC0YHRjyDQutC+0LPQtNCwINGN0LvQtdC80LXQvdGCINGD0LTQsNC70ZHQvSDQuNC3IERPTVxuICAgICAgICAgKi9cbiAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAoc3VwZXIuZGlzY29ubmVjdGVkQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzdXBlci5kaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCS0YvQt9GL0LLQsNC10YLRgdGPINC60L7Qs9C00LAg0Y3Qu9C10LzQtdC90YIg0L/QtdGA0LXQvNC10YnRkdC9INCyINC90L7QstGL0Lkg0LTQvtC60YPQvNC10L3RglxuICAgICAgICAgKi9cbiAgICAgICAgYWRvcHRlZENhbGxiYWNrKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHN1cGVyLmFkb3B0ZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHN1cGVyLmFkb3B0ZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINCS0YvQt9GL0LLQsNC10YLRgdGPINC60L7Qs9C00LAg0L3QsNCx0LvRjtC00LDQtdC80YvQuSDQsNGC0YDQuNCx0YPRgiDQuNC30LzQtdC90LjQu9GB0Y9cbiAgICAgICAgICovXG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCBuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHN1cGVyLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g0J/RgNC40LzQtdC90Y/QtdC8IHdpdGhQcm9wZXJ0aWVzINC4INC60Y3RiNC40YDRg9C10LxcbiAgICBjb25zdCByZXN1bHQgPSB3aXRoUHJvcGVydGllcyhHTGl0RWxlbWVudEltcGwgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudENvbnN0cnVjdG9yPFQgJiBHTGl0RWxlbWVudEluc3RhbmNlPik7XG4gICAgQ1NNLnNldChCYXNlLCByZXN1bHQpO1xuICAgIGNvbnNvbGUubG9nKFwicmVzdWx0XCIsIHJlc3VsdCk7XG5cbiAgICByZXR1cm4gcmVzdWx0IGFzIHVua25vd24gYXMgR0xpdEVsZW1lbnRDbGFzczxUPjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vINCU0J7Qn9Ce0JvQndCY0KLQldCb0KzQndCr0JUg0KLQmNCf0Ksg0JTQm9CvINCj0JTQntCR0KHQotCS0JBcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICog0KLQuNC/INC00LvRjyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjRjyDQsiDQtNC10LrQvtGA0LDRgtC+0YDQsNGFINC60LvQsNGB0YHQvtCyXG4gKi9cbmV4cG9ydCB0eXBlIEdMaXRFbGVtZW50RGVjb3JhdGVkPFQgZXh0ZW5kcyBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50PiA9IFxuICAgIEluc3RhbmNlVHlwZTxHTGl0RWxlbWVudENsYXNzPFQ+PjtcblxuLyoqXG4gKiDQpdC10LvQv9C10YAg0LTQu9GPINGC0LjQv9C40LfQsNGG0LjQuCBvYnNlcnZlZEF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IHR5cGUgT2JzZXJ2ZWRBdHRyaWJ1dGVzPFQgZXh0ZW5kcyBzdHJpbmdbXT4gPSB7XG4gICAgb2JzZXJ2ZWRBdHRyaWJ1dGVzOiBUO1xuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBUW251bWJlcl0sIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCBuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCk6IHZvaWQ7XG59O1xuIl19