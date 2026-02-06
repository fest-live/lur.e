import { ref } from "fest/object";
import { addRoot, isElement, loadAsAdopted, loadInlineStyle, setAttributesIfNull } from "fest/dom";

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

import { Q } from "../../lure/node/Queried";
import { E } from "../../lure/node/Bindings";
import { H } from "../../lure/node/Syntax";

//
const styleCache = new Map();
const styleElementCache = new WeakMap();
const propStore = new WeakMap<object, Map<string, any>>();
const CSM = new WeakMap<WeakKey | HTMLElement, any>();

const camelToKebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const kebabToCamel = (str: string) => str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
const whenBoxValid = (name: string) => {
    const cb = camelToKebab(name);
    if (["border-box", "content-box", "device-pixel-content-box"].indexOf(cb) >= 0) return cb;
    return null;
};
const whenAxisValid = (name: string) => {
    const cb = camelToKebab(name);
    if (cb?.startsWith?.("inline")) return "inline";
    if (cb?.startsWith?.("block")) return "block";
    return null;
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const inRenderKey = Symbol.for("@render@");
const defKeys = Symbol.for("@defKeys@");
const defaultStyle = typeof document != "undefined" ? document?.createElement?.("style") : null;

const defineSource = (source: string | any, holder: any, name?: string | null) => {
    if (source == "attr") return attrRef.bind(null, holder, name || "");
    if (source == "media") return matchMediaRef;
    if (source == "query") return (val: string) => Q?.(name || val || "", holder);
    if (source == "query-shadow") return (val: string) => Q?.(name || val || "", holder?.shadowRoot ?? holder);
    if (source == "localStorage") return localStorageRef;
    if (source == "inline-size") return sizeRef.bind(null, holder, "inline", whenBoxValid(name!) || "border-box");
    if (source == "content-box") return sizeRef.bind(null, holder, whenAxisValid(name!) || "inline", "content-box");
    if (source == "block-size") return sizeRef.bind(null, holder, "block", whenBoxValid(name!) || "border-box");
    if (source == "border-box") return sizeRef.bind(null, holder, whenAxisValid(name!) || "inline", "border-box");
    if (source == "scroll") return scrollRef.bind(null, holder, whenAxisValid(name!) || "inline");
    if (source == "device-pixel-content-box") return sizeRef.bind(null, holder, whenAxisValid(name!) || "inline", "device-pixel-content-box");
    if (source == "checked") return checkedRef.bind(null, holder);
    if (source == "value") return valueRef.bind(null, holder);
    if (source == "value-as-number") return valueAsNumberRef.bind(null, holder);
    return ref;
};

if (defaultStyle) {
    typeof document != "undefined" ? document.querySelector?.("head")?.appendChild?.(defaultStyle) : null;
}

const getDef = (source?: string | any | null): any => {
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
};

if (defaultStyle) {
    defaultStyle.innerHTML = `@layer ux-preload {
        :host { display: none; }
    }`;
}

// ============================================
// ТИПЫ ДЛЯ WEB COMPONENTS LIFECYCLE
// ============================================

/**
 * Интерфейс lifecycle callbacks для Custom Elements
 */
export interface CustomElementLifecycle {
    connectedCallback?(): this|void|undefined;
    disconnectedCallback?(): this|void|undefined;
    adoptedCallback?(): this|void|undefined;
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): this|void|undefined;
}

/**
 * Статические свойства Custom Element
 */
export interface CustomElementStatic {
    observedAttributes?: string[];
    formAssociated?: boolean;
}

/**
 * Базовый интерфейс для Custom Element с lifecycle
 */
export interface CustomElementBase extends HTMLElement, CustomElementLifecycle {}

/**
 * Интерфейс для расширенных свойств GLitElement
 */
export interface GLitElementInstance extends CustomElementLifecycle {
    styles?: any;
    initialAttributes?: Record<string, any> | (() => Record<string, any>);
    styleLibs: HTMLStyleElement[];
    adoptedStyleSheets: CSSStyleSheet[];
    styleLayers(): string[];
    render(weak?: WeakRef<any>): HTMLElement | DocumentFragment | Node;
    onInitialize(weak?: WeakRef<any>): this|void|undefined;
    onRender(weak?: WeakRef<any>): this|void|undefined;
    loadStyleLibrary(module: any): this|void|undefined;
    createShadowRoot(): ShadowRoot;
    $init?(): void;
}

/**
 * Тип конструктора для HTMLElement и его наследников с поддержкой lifecycle
 */
export type HTMLElementConstructor<T extends HTMLElement = HTMLElement> = {
    new(...args: any[]): T & CustomElementLifecycle;
    prototype: T & CustomElementLifecycle;
} & CustomElementStatic;

/**
 * Тип для результата GLitElement - конструктор с полной поддержкой lifecycle
 */
export type GLitElementConstructor<T extends HTMLElement = HTMLElement> = {
    new(...args: any[]): T & GLitElementInstance;
    prototype: T & GLitElementInstance;
} & CustomElementStatic;

/**
 * Тип для класса, который можно расширять
 */
export type GLitElementClass<T extends HTMLElement = HTMLElement> = 
    GLitElementConstructor<T> & {
        new(...args: any[]): T & GLitElementInstance & CustomElementLifecycle;
    };

// ============================================
// ДЕКОРАТОРЫ И УТИЛИТЫ
// ============================================

export function withProperties<T extends HTMLElementConstructor>(ctr: T): T {
    const proto = ctr.prototype as any;
    const $init = proto.$init;

    proto.$init = function (this: any, ...args: any[]) {
        $init?.call?.(this, ...args);

        // Collect defKeys from entire prototype chain (child-first, skip duplicates)
        const allDefs: Record<string, any> = {};
        let p: any = Object.getPrototypeOf(this);
        while (p) {
            if (Object.hasOwn(p, defKeys)) {
                const defs = p[defKeys];
                for (const k of Object.keys(defs)) {
                    if (!(k in allDefs)) allDefs[k] = defs[k];
                }
            }
            p = Object.getPrototypeOf(p);
        }

        for (const [key, def] of Object.entries(allDefs)) {
            const exists = this[key];
            if (def != null) {
                Object.defineProperty(this, key, def as PropertyDescriptor);
            }
            this[key] = exists || this[key];
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

export function defineElement(name: string, options?: ElementDefinitionOptions) {
    return function <T extends HTMLElementConstructor>(target: T, _key?: string): T {
        try {
            if (typeof customElements === "undefined" || !name) return target;
            const existing = customElements.get(name);
            if (existing) return existing as unknown as T;
            customElements.define(name, target as unknown as CustomElementConstructor, options);
        } catch (e: any) {
            if (e?.name === "NotSupportedError" || /has already been used|already been defined/i.test(e?.message || "")) {
                return (customElements?.get?.(name) ?? target) as T;
            }
            throw e;
        }
        return target;
    };
}

export interface PropertyOptions {
    attribute?: string | boolean;
    source?: string | any;
    name?: string | null;
    from?: any | null;
}

export function property(options: PropertyOptions = {}) {
    const { attribute, source, name, from } = options;

    return function (target: any, key: string) {
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

        if (!Object.hasOwn(target, defKeys)) target[defKeys] = {};

        target[defKeys][key] = {
            get(this: any) {
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

                if (inRender) return stored;
                if (stored?.element instanceof HTMLElement) return stored?.element;
                return ((typeof stored == "object" || typeof stored == "function") && (stored?.value != null || "value" in stored)) ? stored?.value : stored;
            },
            set(this: any, newValue: any) {
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
                } else if (typeof stored == "object" || typeof stored == "function") {
                    try {
                        if (typeof newValue == 'object' && newValue != null && ((newValue?.value == null && !("value" in newValue)) || typeof newValue?.value == "object" || typeof newValue?.value == "function")) {
                            Object.assign(stored, newValue?.value ?? newValue);
                        } else {
                            stored.value = ((typeof newValue == 'object' || typeof newValue == 'function') ? (newValue?.value) : null) ?? newValue;
                        }
                    } catch (e) {
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
        bTo.shadowRoot.adoptedStyleSheets = [
            ...(bTo.shadowRoot.adoptedStyleSheets || []),
            ...adoptedSheets.filter((s: CSSStyleSheet) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))
        ];
    }
};

export const loadCachedStyles = (bTo: any, src: any): HTMLStyleElement | null => {
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
        resolvedSrc.then((result: any) => {
            if (result instanceof CSSStyleSheet) {
                addAdoptedSheetToElement(bTo, result);
            } else if (result != null) {
                loadCachedStyles(bTo, result);
            }
        }).catch((e: any) => {
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
                if (sheet && adoptedSheets!.indexOf(sheet) < 0) {
                    adoptedSheets!.push(sheet);
                }
                if (bTo.shadowRoot) {
                    bTo.shadowRoot.adoptedStyleSheets = [
                        ...(bTo.shadowRoot.adoptedStyleSheets || []),
                        ...adoptedSheets!.filter((s: CSSStyleSheet) => !bTo.shadowRoot.adoptedStyleSheets?.includes(s))
                    ];
                }
            };
            if (adopted instanceof Promise) {
                adopted.then(addAdoptedSheet).catch((e: any) => {
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
    const cached = source.get(src);
    let styleElement = cached?.styleElement;
    let vars = cached?.vars;

    if (!cached) {
        let styles = ``;
        let props: any[] = [];

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
};

export const isNotExtended = (el: HTMLElement): boolean => {
    return !(
        (el instanceof HTMLDivElement) ||
        (el instanceof HTMLImageElement) ||
        (el instanceof HTMLVideoElement) ||
        (el instanceof HTMLCanvasElement)
    ) && !(el?.hasAttribute?.("is") || el?.getAttribute?.("is") != null);
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
export function GLitElement<T extends HTMLElement = HTMLElement>(
    derivate?: HTMLElementConstructor<T>
): GLitElementClass<T> {
    const Base = (derivate ?? HTMLElement) as HTMLElementConstructor<T>;

    // Проверяем кэш
    const cached = CSM.get(Base);
    if (cached) return cached as GLitElementClass<T>;

    /**
     * Внутренний класс с полной реализацией lifecycle
     */
    abstract class GLitElementImpl extends (Base as unknown as new (...args: any[]) => HTMLElement & CustomElementLifecycle) implements GLitElementInstance {
        #shadowDOM?: ShadowRoot | null;
        #styleElement?: HTMLStyleElement;
        #defaultStyle?: HTMLStyleElement;
        #initialized: boolean = false;

        styleLibs: HTMLStyleElement[] = [];
        adoptedStyleSheets: CSSStyleSheet[] = [];

        // Геттеры для переопределения в подклассах
        get styles(): any { return undefined; }
        get initialAttributes(): Record<string, any> | (() => Record<string, any>) | undefined { return undefined; }

        styleLayers(): string[] { return []; }

        render(_weak?: WeakRef<any>): HTMLElement | DocumentFragment | Node {
            return document.createElement("slot");
        }

        constructor(...args: any[]) {
            super(...args);
            if (isNotExtended(this)) {
                const shadowRoot = addRoot(
                    this.shadowRoot ?? 
                    (this as any).createShadowRoot?.() ?? 
                    this.attachShadow({ mode: "open" })
                );
                const defStyle = (this.#defaultStyle ??= defaultStyle?.cloneNode?.(true) as HTMLStyleElement);
                const layersStyle = shadowRoot.querySelector(`style[data-type="ux-layer"]`);
                if (layersStyle) {
                    layersStyle.after(defStyle);
                } else {
                    shadowRoot.prepend(defStyle);
                }
            }
            this.styleLibs ??= [];
        }

        protected $makeLayers(): string {
            return `@layer ${["ux-preload", "ux-layer", ...(this.styleLayers?.() ?? [])].join?.(",") ?? ""};`;
        }

        $init?(): void;

        onInitialize(_weak?: WeakRef<any>): this {
            return this;
        }

        onRender(_weak?: WeakRef<any>): this {
            return this;
        }

        protected getProperty(key: string): any {
            const current = (this as any)[inRenderKey];
            (this as any)[inRenderKey] = true;
            const cp = (this as any)[key];
            (this as any)[inRenderKey] = current;
            if (!current) {
                delete (this as any)[inRenderKey];
            }
            return cp;
        }

        loadStyleLibrary($module: any): this {
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
                    root.adoptedStyleSheets = [
                        ...(root.adoptedStyleSheets || []),
                        ...adoptedSheets.filter((s: CSSStyleSheet) => !root.adoptedStyleSheets?.includes(s))
                    ];
                }
            } else {
                const adopted = loadAsAdopted(module, "ux-layer");
                let adoptedSheets = adoptedStyleSheetsCache.get(this);
                if (!adoptedSheets) {
                    adoptedStyleSheetsCache.set(this, adoptedSheets = []);
                }
                const addAdoptedSheet = (sheet: CSSStyleSheet) => {
                    if (sheet && adoptedSheets!.indexOf(sheet) < 0) {
                        adoptedSheets!.push(sheet);
                    }
                    if (root) {
                        root.adoptedStyleSheets = [
                            ...(root.adoptedStyleSheets || []),
                            ...adoptedSheets!.filter((s: CSSStyleSheet) => !root.adoptedStyleSheets?.includes(s))
                        ];
                    }
                };
                if (adopted instanceof Promise) {
                    adopted.then(addAdoptedSheet).catch(() => { });
                } else if (adopted) {
                    addAdoptedSheet(adopted);
                }
            }
            return this;
        }

        createShadowRoot(): ShadowRoot {
            return addRoot(this.shadowRoot ?? this.attachShadow({ mode: "open" })) as ShadowRoot;
        }

        // ============================================
        // LIFECYCLE CALLBACKS
        // ============================================

        /**
         * Вызывается когда элемент добавлен в DOM
         */
        connectedCallback(): void {
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
                const ctor = this.constructor as any;
                if (typeof ctor.$init === 'function') {
                    ctor.$init.call(this);
                } else if (typeof (this as any).$init === 'function') {
                    (this as any).$init();
                }

                // Установка атрибутов
                const attrs = typeof this.initialAttributes == "function"
                    ? (this.initialAttributes as () => Record<string, any>)()
                    : this.initialAttributes;
                setAttributesIfNull(this, attrs);

                this.onInitialize?.call(this, weak);

                (this as any)[inRenderKey] = true;

                if (isNotExtended(this) && shadowRoot) {
                    const rendered = this.render?.call?.(this, weak) ?? document.createElement("slot");
                    const styleElement = loadCachedStyles(this, this.styles);

                    if (styleElement instanceof HTMLStyleElement) {
                        this.#styleElement = styleElement;
                    }

                    const elements = [
                        H`<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
                        this.#defaultStyle,
                        ...(this.styleLibs.map(x => x.cloneNode?.(true)) || []),
                        styleElement,
                        rendered
                    ].filter((x): x is Node => x != null && (isElement(x) as unknown as boolean));

                    shadowRoot.append(...elements);

                    const adoptedSheets = adoptedStyleSheetsCache.get(this) || [];
                    if (adoptedSheets.length > 0) {
                        shadowRoot.adoptedStyleSheets = [
                            ...adoptedSheets.filter((s: CSSStyleSheet) => !shadowRoot.adoptedStyleSheets?.includes(s)),
                            ...new Set([...(shadowRoot.adoptedStyleSheets || [])])
                        ];
                    }
                }

                this.onRender?.call?.(this, weak);
                delete (this as any)[inRenderKey];
            }
        }

        /**
         * Вызывается когда элемент удалён из DOM
         */
        disconnectedCallback(): void {
            if (super.disconnectedCallback) {
                super.disconnectedCallback();
            }
        }

        /**
         * Вызывается когда элемент перемещён в новый документ
         */
        adoptedCallback(): void {
            if (super.adoptedCallback) {
                super.adoptedCallback();
            }
        }

        /**
         * Вызывается когда наблюдаемый атрибут изменился
         */
        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
            if (super.attributeChangedCallback) {
                super.attributeChangedCallback(name, oldValue, newValue);
            }
        }
    }

    // Применяем withProperties и кэшируем
    const result = withProperties(GLitElementImpl as unknown as HTMLElementConstructor<T & GLitElementInstance>);
    CSM.set(Base, result);

    return result as unknown as GLitElementClass<T>;
}

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ ТИПЫ ДЛЯ УДОБСТВА
// ============================================

/**
 * Тип для использования в декораторах классов
 */
export type GLitElementDecorated<T extends HTMLElement = HTMLElement> = 
    InstanceType<GLitElementClass<T>>;

/**
 * Хелпер для типизации observedAttributes
 */
export type ObservedAttributes<T extends string[]> = {
    observedAttributes: T;
    attributeChangedCallback(name: T[number], oldValue: string | null, newValue: string | null): void;
};
