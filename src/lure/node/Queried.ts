import { observeAttributeBySelector, getAdoptedStyleRule, handleAttribute, containsOrSelf, MOCElement, observeBySelector, observeAttribute } from "@fest-lib/dom";
import { bindWith, elMap } from "../core/Binding";
import { $affected, observe } from "@fest-lib/object";
import { appendChild, removeChild, replaceOrSwap } from "../context/Utils";

//
const existsQueriesSymbol = Symbol.for("lure.existsQueries");
globalThis[existsQueriesSymbol] ??= new WeakMap<any, Map<string|HTMLElement, any>>();
const existsQueries = globalThis[existsQueriesSymbol];

//
const alreadyUsedSymbol = Symbol.for("lure.alreadyUsed");
globalThis[alreadyUsedSymbol] ??= new WeakMap();
const alreadyUsed = globalThis[alreadyUsedSymbol];

//
const queryExtensions = {
    logAll (ctx) { return ()=> console.log("attributes:", [...ctx?.attributes].map(x => ({ name: x.name, value: x.value })) ); },
    append (ctx) { return (...args)=> args?.forEach?.((e)=>appendChild(ctx, e, null, -1)) },
    appendChildren (ctx) { return (...args)=> args?.forEach?.((e)=>appendChild(ctx, e, null, -1)) },
    removeChildren (ctx) { return (...args)=> args?.forEach?.((e)=>removeChild(ctx, e, null, -1)) },
    removeChild (ctx) { return (e)=> removeChild(ctx, e, null, -1) },
    replaceChild (ctx) { return (e, n)=> replaceOrSwap(ctx, e, n) },
    remove(ctx) { return ()=>removeChild(ctx?.parentNode, ctx, null, -1) },
    replace(ctx) { return (newEl)=>replaceOrSwap(ctx?.parentNode, ctx, newEl) },
    current(ctx) { return ctx; } // direct getter
}

type PseudoElementProxy = {
    readonly type: string;
    readonly element: Element | null;
    readonly parent: Element | PseudoElementProxy | null;
    readonly native: any | null;
    readonly selector: string | null;

    readonly style: CSSStyleDeclaration | undefined;
    readonly attributeStyleMap: any;
    readonly computedStyle: CSSStyleDeclaration | undefined;

    getComputedStyle(): CSSStyleDeclaration | undefined;
    pseudo(type: string): PseudoElementProxy;
};

let pseudoUID = 0;

/**
 * Нам нельзя разрешать произвольную строку, потому что она позже
 * добавляется в CSS selector.
 *
 * Поддерживаются:
 *   ::before
 *   ::after
 *   ::marker
 *   ::highlight(name)
 *   ::view-transition-group(root)
 *
 * Вложенные скобки намеренно не поддерживаются.
 */
function normalizePseudoType(value: unknown): string {
    if (typeof value !== "string") {
        throw new TypeError("Pseudo-element type must be a string");
    }

    let type = value.trim();

    // Необязательная совместимость со старой записью :before/:after.
    if (type === ":before" || type === ":after") {
        type = `:${type}`;
    }

    const valid =
        /^::[-_a-zA-Z][-\w]*(?:\((?:[^()"']|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')*\))?$/u;

    if (!valid.test(type)) {
        throw new TypeError(`Invalid pseudo-element selector: ${type}`);
    }

    return type;
}

//
function pseudoStyleRoot(element: Element): Document | ShadowRoot | Element {
    const root = element.getRootNode?.();

    if (
        typeof ShadowRoot !== "undefined" &&
        root instanceof ShadowRoot
    ) {
        return root;
    }

    return element.ownerDocument?.documentElement ?? document.documentElement;
}

//
function createPseudoElementProxy(
    resolveElement: () => Element | null,
    types: string[],
    parent: Element | PseudoElementProxy | null = null,
): PseudoElementProxy {
    const handler = new UniversalPseudoElementHandler(
        resolveElement,
        types,
        parent,
    );

    const proxy = new Proxy(
        Object.create(null),
        handler as ProxyHandler<object>,
    ) as PseudoElementProxy;

    handler.self = proxy;

    return proxy;
}

//
const isWeakCompatible = (element: any) => {
    return (typeof element == "object" || typeof element == "function") && element != null;
}

//
class UniversalPseudoElementHandler implements ProxyHandler<object> {
    self!: PseudoElementProxy;

    private readonly token = `ux-pseudo-${(++pseudoUID).toString(36)}`;
    private readonly children = new Map<string, PseudoElementProxy>();

    private attachedElement: Element | null = null;
    private styleActivated = false;

    constructor(
        private readonly resolveOrigin: () => Element | null,
        private readonly types: string[],
        private readonly pseudoParent: Element | PseudoElementProxy | null,
    ) {}

    private get suffix(): string {
        return this.types.join("");
    }

    private get localType(): string {
        return this.types[this.types.length - 1];
    }

    /**
     * Переносит служебный класс на актуальный selected element.
     *
     * Это важно, если элемент, подходящий под Q(selector),
     * был удалён и заменён другим.
     */
    private resolveElement(): Element | null {
        const element = this.resolveOrigin();

        if (this.styleActivated && element !== this.attachedElement) {
            this.attachedElement?.classList?.remove?.(this.token);
            element?.classList?.add?.(this.token);
            this.attachedElement = element;
        } else if (
            this.styleActivated &&
            element &&
            !element.classList.contains(this.token)
        ) {
            // Восстанавливаем класс, если его удалили внешним кодом.
            element.classList.add(this.token);
        }

        return element;
    }

    private activateStyleTarget(): Element | null {
        this.styleActivated = true;
        return this.resolveElement();
    }

    private getSelector(): string | null {
        const element = this.activateStyleTarget();
        if (!element) return null;

        return `.${this.token}${this.suffix}`;
    }

    private getRule(): any {
        const element = this.activateStyleTarget();
        if (!element) return undefined;

        const selector = `.${this.token}${this.suffix}`;
        const root = pseudoStyleRoot(element);

        return getAdoptedStyleRule(
            selector,
            "ux-query-pseudo",
            root as any,
        );
    }

    private getStyle(): CSSStyleDeclaration | undefined {
        return this.getRule()?.style;
    }

    private getComputedStyle(): CSSStyleDeclaration | undefined {
        const element = this.resolveElement();
        if (!element) return undefined;

        const win = element.ownerDocument?.defaultView ?? window;

        /*
         * getComputedStyle() может выбросить TypeError для некоторых
         * pseudo-elements, например ::part() и ::slotted().
         * Ошибку намеренно не скрываем.
         */
        return win.getComputedStyle(element, this.suffix);
    }

    private getNativePseudo(): any | null {
        let current: any = this.resolveElement();

        if (!current) return null;

        for (const type of this.types) {
            if (typeof current?.pseudo !== "function") {
                return null;
            }

            current = current.pseudo(type);

            if (!current) {
                return null;
            }
        }

        return current;
    }

    private getChild(type: unknown): PseudoElementProxy {
        const normalized = normalizePseudoType(type);

        const cached = this.children.get(normalized);
        if (cached) return cached;

        const child = createPseudoElementProxy(
            this.resolveOrigin,
            [...this.types, normalized],
            this.self,
        );

        if (isWeakCompatible(normalized)) {
            this.children.set(normalized, child);
        }
        return child;
    }

    get(_target: object, name: PropertyKey): any {
        switch (name) {
            case "type":
                return this.localType;

            /**
             * Ultimate originating element.
             */
            case "element":
                return this.resolveElement();

            /**
             * Для первого pseudo это Element,
             * для вложенного — предыдущий pseudo proxy.
             */
            case "parent":
                return this.pseudoParent ?? this.resolveElement();

            case "native":
                return this.getNativePseudo();

            case "selector":
                return this.getSelector();

            /**
             * Это CSSStyleDeclaration созданного CSSStyleRule,
             * а не inline style — у pseudo-elements его быть не может.
             */
            case "style":
                return this.getStyle();

            case "attributeStyleMap": {
                const rule = this.getRule();
                return rule?.styleMap ?? rule?.attributeStyleMap;
            }

            case "computedStyle":
                return this.getComputedStyle();

            case "getComputedStyle":
                return () => this.getComputedStyle();

            case "pseudo":
                return (type: string) => this.getChild(type);

            case "addEventListener":
                return (...args: any[]) => {
                    const native = this.getNativePseudo();

                    if (typeof native?.addEventListener !== "function") {
                        throw new DOMException(
                            "CSSPseudoElement events are not supported by this browser",
                            "NotSupportedError",
                        );
                    }

                    return native.addEventListener(...args);
                };

            case "removeEventListener":
                return (...args: any[]) => {
                    const native = this.getNativePseudo();

                    if (typeof native?.removeEventListener !== "function") {
                        return;
                    }

                    return native.removeEventListener(...args);
                };

            case "dispose":
                return () => {
                    this.attachedElement?.classList?.remove?.(this.token);
                    this.attachedElement = null;
                    this.styleActivated = false;
                };

            case Symbol.toStringTag:
                return "CSSPseudoElement";

            case Symbol.toPrimitive:
                return () => this.getSelector() ?? this.suffix;
        }

        /*
         * Fallback к нативному CSSPseudoElement.
         */
        const native = this.getNativePseudo();

        if (native && name in native) {
            const value = native[name];

            return typeof value === "function"
                ? value.bind(native)
                : value;
        }

        /*
         * Сокращённая запись:
         *
         * pseudo.color
         * pseudo.backgroundColor
         * pseudo["--custom-property"]
         */
        if (typeof name === "string") {
            const style: any = this.getStyle();

            if (style && (name.startsWith("--") || name in style)) {
                return style[name];
            }
        }

        return undefined;
    }

    set(_target: object, name: PropertyKey, value: any): boolean {
        if (typeof name !== "string") {
            return false;
        }

        const style: any = this.getStyle();
        if (!style) return false;

        if (name === "cssText") {
            style.cssText = String(value ?? "");
            return true;
        }

        if (name.startsWith("--")) {
            style.setProperty(name, String(value ?? ""));
            return true;
        }

        if (name in style) {
            style[name] = value == null ? "" : String(value);
            return true;
        }

        return false;
    }

    has(_target: object, name: PropertyKey): boolean {
        if (
            name === "type" ||
            name === "element" ||
            name === "parent" ||
            name === "native" ||
            name === "selector" ||
            name === "style" ||
            name === "computedStyle" ||
            name === "attributeStyleMap" ||
            name === "getComputedStyle" ||
            name === "pseudo"
        ) {
            return true;
        }

        const native = this.getNativePseudo();

        if (native && name in native) {
            return true;
        }

        if (typeof name === "string") {
            const style: any = this.getStyle();
            return !!style && (name.startsWith("--") || name in style);
        }

        return false;
    }

    deleteProperty(_target: object, name: PropertyKey): boolean {
        if (typeof name !== "string") {
            return false;
        }

        const style: any = this.getStyle();
        if (!style) return false;

        if (name.startsWith("--")) {
            style.removeProperty(name);
            return true;
        }

        if (name in style) {
            style[name] = "";
            return true;
        }

        return false;
    }
}

//
export class EventHandler implements ProxyHandler<object> {
    constructor(private readonly target: any, private readonly currentTarget: any, private readonly selector: string | HTMLElement, private readonly eventName: string, private readonly callback: (event: Event) => void) {
    }

    get(_target: object, name: PropertyKey, ctx: any): any {
        if (name === "currentTarget" && typeof this.selector == "string") {
            return MOCElement(this.target, this.selector);
        }

        if (name === "currentTarget" && typeof this.selector != "string") {
            return this.currentTarget ?? this.selector;
        }

        if (typeof _target?.[name] == "function") {
            return _target?.[name]?.bind?.(_target);
        }
        return Reflect.get(_target, name, ctx);
    }

    set(_target: object, name: PropertyKey, value: any): boolean {
        return Reflect.set(_target, name, value);
    }

    has(_target: object, name: PropertyKey): boolean {
        return Reflect.has(_target, name);
    }

    deleteProperty(_target: object, name: PropertyKey): boolean {
        return Reflect.deleteProperty(_target, name);
    }

    ownKeys(_target: object): (string | symbol)[] {
        return Reflect.ownKeys(_target);
    }

    defineProperty(_target: object, name: PropertyKey, desc: PropertyDescriptor): boolean {
        return Reflect.defineProperty(_target, name, desc);
    }

    apply(_target: object, thisArg: any, args: any[]): any {
        return Reflect.apply(_target as any, thisArg, args);
    }

    construct(_target: object, args: any[]): any {
        return Reflect.construct(_target as any, args);
    }

    getPrototypeOf(_target: object): any {
        return Reflect.getPrototypeOf(_target);
    }

    setPrototypeOf(_target: object, proto: any): boolean {
        return Reflect.setPrototypeOf(_target, proto);
    }

    isExtensible(_target: object): boolean {
        return Reflect.isExtensible(_target);
    }

    preventExtensions(_target: object): boolean {
        return Reflect.preventExtensions(_target);
    }

    getOwnPropertyDescriptor(_target: object, name: PropertyKey): PropertyDescriptor | undefined {
        return Reflect.getOwnPropertyDescriptor(_target, name);
    }
}

//
class UniversalElementHandler implements ProxyHandler<object> {
    direction: "children" | "parent" = "children";
    selector: string | HTMLElement | null;
    index: number = 0;

    //
    private _pseudoMap = new Map<string, PseudoElementProxy>();
    private _observeMap = new WeakMap<HTMLElement, any[]>();

    //
    private _callbackMap = new WeakMap<Function, {wrap: Function, option: any}>();
    private _eventMap = new WeakMap<object, Map<string, WeakMap<Function, {wrap: Function, option: any}>>>();

    //
    constructor(selector: string | HTMLElement, index = 0, direction: "children" | "parent" = "children") {
        this.index     = index;
        this.selector  = typeof selector == "string" ? selector : null;
        this.direction = direction;
    }

    get selectorElement(): HTMLElement | null {
        return typeof this.selector == "string" ? null : this.selector;
    }

    _resolveSelectedElement(target: any): Element | null {
        const array = this._getArray(target);
    
        const selected =
            array.length > 0
                ? array[this.index]
                : this._getSelected(target);
    
        const element = selected?.element ?? selected;
    
        return element instanceof Element ? element : null;
    }
    
    _getPseudo(target: any, type: unknown): PseudoElementProxy {
        const normalized = normalizePseudoType(type);
    
        const cached = this._pseudoMap.get(normalized);
        if (cached) return cached;
    
        const pseudo = createPseudoElementProxy(
            () => this._resolveSelectedElement(target),
            [normalized],
            null,
        );
    
        this._pseudoMap.set(normalized, pseudo);
        return pseudo;
    }

    //
    _observeDOMChange(target: any, selector: any, cb: any) {
        // no possible to listen to DOM change for non-string selector
        return (typeof selector == "string" ? observeBySelector(target, selector, cb) : null);
    }

    //
    _observeAttributes(target: any, attribute: any, cb: any)
        { return (typeof this.selector == "string" ? observeAttributeBySelector(target, this.selector, attribute, cb) : observeAttribute(target ?? this.selector, attribute, cb)); }

    //
    _getArrayPrimary(target: any) {
        if (typeof target == "function") { target = this.selector || target?.(this.selector); }; if (!this.selector) return [target];
        if (typeof this.selector == "string") {
            const inclusion = ((typeof target?.matches == "function" && target?.element != null) && target?.matches?.(this.selector)) ? [target] : [];
            if (this.direction == "children") {
                const list = (typeof target?.querySelectorAll == "function" && target?.element != null) ? [...target?.querySelectorAll?.(this.selector)] : [];
                return list?.length >= 1 ? [...list] : inclusion;
            } else if (this.direction == "parent") {
                const closest = target?.closest?.(this.selector);
                return closest ? [closest] : inclusion;
            }
            return inclusion;
        }
        return Array.isArray(this.selector) ? this.selector : [this.selector];
    }

    //
    _getArray(target: any) {
        const tg = target?.self ?? target;
        return this._observeMap.getOrInsertComputed(tg, ()=>{
            const array = this._getArrayPrimary(tg);

            //
            let forReactive = observe(Array.isArray(array) ? array : [this._getSelected(tg)]);
    
            // TODO: support for parent direction
            if (this.direction == "children") {
                observeBySelector(tg, typeof this.selector == "string" ? this.selector : undefined, (mut, obs)=>{
                    if (mut?.addedNodes?.length > 0 || mut?.removedNodes?.length > 0) {
                        mut?.addedNodes?.forEach((node: any)=>{
                            if ((node?.element ?? node) && !forReactive?.includes?.(node?.element ?? node)) {
                                forReactive?.push?.(node?.element ?? node);
                            }
                        });
                        mut?.removedNodes?.forEach((node: any)=>{
                            const index = forReactive.indexOf(node?.element ?? node);
                            if (index > -1) {
                                forReactive.splice(index, 1);
                            }
                        });
                    }
                });
            }
    
            //
            return forReactive;
        });
    }

    //
    _getSelected(target: any) {
        const tg = target?.self ?? target;
        const sel = this._selector(target);
        if (typeof sel == "string") {
            if (this.direction == "children") { return tg?.matches?.(sel) ? tg : tg?.querySelector?.(sel); }
            if (this.direction == "parent"  ) { return tg?.matches?.(sel) ? tg : tg?.closest?.(sel); }
        }
        return tg == ((sel as any)?.element ?? sel) ? ((sel as any)?.element ?? sel) : null;
    }

    // if selector isn't string, can't be redirected
    _redirectToBubble(eventName: any) {
        const sel: any = this._selector();
        if (typeof sel == "string") {
            return {
                ["pointerenter"]: "pointerover",
                ["pointerleave"]: "pointerout",
                ["mouseenter"]: "mouseover",
                ["mouseleave"]: "mouseout",
                ["focus"]: "focusin",
                ["blur"]: "focusout",
            }?.[eventName] || eventName;
        }
        return eventName;
    }

    //
    _addEventListener(target: any, name: any, $cb: (event: Event) => any, option?: any) {
        const selector = this._selector(target);
        const cb = (ev: any): any => { 
            const evp = new Proxy(ev, new EventHandler(ev?.target ?? target, ev?.currentTarget ?? target, typeof selector == "string" ? selector : "", name, $cb));
            $cb?.call?.(ev?.target ?? target, evp); return evp;
        }
        this._callbackMap.set($cb, {wrap: cb, option: option});

        //
        if (typeof selector != "string") { selector?.addEventListener?.(name, cb, option); return cb; }

        //
        const eventName = this._redirectToBubble(name);
        const parent = target?.self ?? target;
        const wrap = (ev) => {
            const sel: any = this._selector(target);
            const rot = ev?.currentTarget ?? parent;

            // Use composedPath() for shadow DOM compatibility
            let tg: any = null;
            if (ev?.composedPath && typeof ev.composedPath === 'function') {
                const path = ev.composedPath();
                // Find the first element in the composed path that matches our selector or is within our target
                for (const node of path) {
                    if (node instanceof HTMLElement || node instanceof Element) {
                        const nodeEl = (node as any)?.element ?? node;
                        if (typeof sel == "string") {
                            if (MOCElement(nodeEl, sel, ev)) {
                                tg = nodeEl;
                                break;
                            }
                        } else {
                            if (containsOrSelf(sel, nodeEl, ev)) {
                                tg = nodeEl;
                                break;
                            }
                        }
                    }
                }
            }

            // Fallback to original logic if composedPath didn't find a match
            if (!tg) {
                tg = (ev?.target ?? this._getSelected(target)) ?? rot;
                tg = tg?.element ?? tg;
            }

            if (typeof sel == "string")
                { if (containsOrSelf(rot, MOCElement(tg, sel, ev), ev)) { this._callbackMap.get($cb)?.wrap?.call?.(tg, ev); } } else
                { if (containsOrSelf(rot, sel, ev) && containsOrSelf(sel, tg, ev)) { this._callbackMap.get($cb)?.wrap?.call?.(tg, ev); }
            }
        };
        parent?.addEventListener?.(eventName, wrap, option);

        // @ts-ignore
        const eventMap = this._eventMap.getOrInsert(parent, new Map())!;
        const cbMap = eventMap.getOrInsert(eventName, new WeakMap())!;
        cbMap.set($cb, {wrap, option});
        cbMap.set(cb, {wrap, option});
        return wrap;
    }

    //
    _removeEventListener(target: any, name: any, cb: any, option?: any) {
        cb = this._callbackMap.get(cb)?.wrap ?? cb;
        option = this._callbackMap.get(cb)?.option ?? option;

        //
        const selector = this._selector(target);
        if (typeof selector != "string") {
            selector?.removeEventListener?.(name, cb, option);
            return cb;
        }

        //
        const parent = target?.self ?? target;
        const eventName = this._redirectToBubble(name), eventMap = this._eventMap.get(parent);
        if (!eventMap) return; const cbMap = eventMap.get(eventName), entry = cbMap?.get?.(cb);
        parent?.removeEventListener?.(eventName, entry?.wrap ?? cb, option ?? entry?.option ?? {});
        if ((entry as any)?.size != null && (entry as any)?.size == 0) eventMap?.delete?.(eventName);
        if (eventMap?.size == 0) this._eventMap.delete(parent);
    }

    //
    _selector(tg?: any): string | HTMLElement | null {
        if (typeof this.selector == "string" && typeof tg?.selector == "string") { return ((tg?.selector || "") + " " + this.selector)?.trim?.(); }
        return this.selector;
    }

    //
    get(target: any, name: any, ctx: any) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);

        //
        if (name === "pseudo") {
            return (type: string) => this._getPseudo(target, type);
        }

        // Extensions
        if (name in queryExtensions) { return queryExtensions?.[name]?.(selected); }
        if (name == "length" && array?.length != null) { return array?.length; }

        //
        if (name == "_updateSelector") return (sel)=>(this.selector = sel || this.selector);
        if (["style", "attributeStyleMap"].indexOf(name) >= 0) {
            const tg = target?.self ?? target;
            const selector = this._selector(target);
            const basis = (typeof selector == "string" ?
                getAdoptedStyleRule(selector, "ux-query", tg) :
                selected
            );
            if (name == "attributeStyleMap") {
                return basis?.styleMap ?? basis?.attributeStyleMap;
            }
            return basis?.[name];
        }

        //
        if (name == "querySelectorAll") {
            return (selector?: string) => {
                const prefix = this._selector(target);
                // WHY: `undefined + " " + sel` becomes `"undefined .foo"` — only join real string parts.
                const combined = [typeof prefix == "string" ? prefix : "", typeof selector == "string" ? selector : ""]
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                let list: any[] = observe([]);
                if (typeof prefix == "string") {
                    list = observe([...((target?.querySelectorAll?.(combined) ?? []))].map((node: any)=>node?.element ?? node));
                } else {
                    const sel = (typeof selector == "string" ? selector : "").trim();
                    list = observe([...((prefix ?? target)?.querySelectorAll?.(sel) ?? [])].map((node: any)=>node?.element ?? node));
                }

                if (combined) {
                    observeBySelector(target, combined, (mut, obs)=>{
                        if (mut?.addedNodes?.length > 0 || mut?.removedNodes?.length > 0) {
                            mut?.addedNodes?.forEach((node: any)=>{
                                if ((node?.element ?? node) && !list?.includes?.(node?.element ?? node))
                                    { list?.push?.(node?.element ?? node); }
                            });
                            mut?.removedNodes?.forEach((node: any)=>{
                                const index = list?.findIndex?.(x => (x?.element ?? x) == (node?.element ?? node));
                                if (index > -1) { list?.splice?.(index, 1); }
                            });
                        }
                    });
                }
                // INVARIANT: callers expect a live NodeList-like array, not undefined.
                return list;
            }
        }

        //
        if (name == "querySelector") {
            return (selector?: string) => {
                const prefix = this._selector(target);
                if (typeof prefix == "string") {
                    return Q(((prefix ?? "") + " " + (selector ?? ""))?.trim?.(), target, 0, this.direction == "children" ? "children" : "parent");
                } else {
                    return Q((selector ?? "")?.trim?.(), target, 0, this.direction == "children" ? "children" : "parent");
                }
            }
        }

        //
        if (name == "self") return (target?.self ?? target);
        if (name == "selector") return this._selector(target);

        //
        if (name == "observeAttr") return (name, cb)=>this._observeAttributes(target, name, cb);
        if (name == "DOMChange") return (cb)=>this._observeDOMChange(target, this.selector, cb);
        if (name == "addEventListener") return (name, cb, opt?)=>this._addEventListener(target, name, cb, opt);
        if (name == "removeEventListener") return (name, cb, opt?)=>this._removeEventListener(target, name, cb, opt);

        // get compatible reactive value, if bound
        if (name == "getAttribute") {
            return (key)=>{
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                const query: any = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
                // COMPAT: Binding bank is DoubleWeakMap([el, handler] → Record), not nested WeakMaps.
                const bank = elMap?.get?.([query, handleAttribute]);
                if (bank?.[key]) {
                    return bank[key]?.[0];
                }
                return selected?.getAttribute?.(key);
            }
        }

        // set attribute
        if (name == "setAttribute") {
            return (key, value)=>{
                // TODO:
                // - support for multiple elements
                // - support for newer elements by DOM Observer
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                if (typeof value == "object" && (value?.value != null || "value" in value)) {
                    return bindWith(selected, key, value, handleAttribute, null, true);
                }
                return selected?.setAttribute?.(key, value);
            }
        }

        //
        if (name == "removeAttribute") {
            return (key)=>{
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                const query: any = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
                const bank = elMap?.get?.([query, handleAttribute]);
                if (bank?.[key]) {
                    return bank[key]?.[1]?.();
                }
                return selected?.removeAttribute?.(key);
            }
        }

        //
        if (name == "hasAttribute") {
            return (key)=>{
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                const query: any = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
                const bank = elMap?.get?.([query, handleAttribute]);
                if (bank?.[key]) {
                    return true;
                }
                return selected?.hasAttribute?.(key);
            }
        }

        // for BLU.E
        if (name == "element") {
            if (array?.length <= 1) return selected?.element ?? selected;
            const fragment = document.createDocumentFragment();
            fragment.append(...array); return fragment;
        }

        //
        if (name == Symbol.toPrimitive) {
            if ((this.selector as any)?.includes?.("input") || (this.selector as any)?.matches?.("input")) {
                return (hint)=>{
                    if (hint == "number") return (selected?.element ?? selected)?.valueAsNumber ?? parseFloat((selected?.element ?? selected)?.value);
                    if (hint == "string") return String((selected?.element ?? selected)?.value ?? (selected?.element ?? selected));
                    if (hint == "boolean") return (selected?.element ?? selected)?.checked;
                    return (selected?.element ?? selected)?.checked ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected);
                }
            }
        }

        //
        if (name == "checked") {
            if ((this.selector as any)?.includes?.("input") || (this.selector as any)?.matches?.("input")) {
                return (selected?.element ?? selected)?.checked;
            }
        }

        //
        if (name == "value") {
            if ((this.selector as any)?.includes?.("input") || (this.selector as any)?.matches?.("input")) {
                return (selected?.element ?? selected)?.valueAsNumber ?? (selected?.element ?? selected)?.valueAsDate ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected)?.checked;
            }
        }

        // can be subscribed
        if (name == $affected) {
            if ((this.selector as any)?.includes?.("input") || (this.selector as any)?.matches?.("input")) {
                return (cb) => {
                    let oldValue = selected?.value;
                    const evt: [any, any] = [
                        (ev)=>{
                            const input = this._getSelected(ev?.target);
                            cb?.(input?.value, "value", oldValue);
                            oldValue = input?.value;
                        }, {passive: true}
                    ];
                    this._addEventListener(target, "change", ...evt)
                    return ()=>this._removeEventListener(target, "change", ...evt)
                }
            }
        }

        //
        if (name == "deref" && (typeof selected == "object" || typeof selected == "function") && selected != null) {
            const wk = new WeakRef(selected);
            return ()=>(wk?.deref?.()?.element ?? wk?.deref?.());
        }

        //
        if (typeof name == "string" && /^\d+$/.test(name)) { return array[parseInt(name)]; };

        //
        const origin = selected; //selected?.element ?? selected;
        if (origin?.[name] != null) { return typeof origin[name] == "function" ? origin[name].bind(origin) : origin[name]; }
        if ( array?.[name] != null) { return typeof  array[name] == "function" ?  array[name].bind(array)  :  array[name]; }

        // remains possible getters
        //return Reflect.get(target, name, ctx);
        return typeof target?.[name] == "function" ? target?.[name].bind(origin) : target?.[name];
    }

    //
    set(target: any, name: any, value: any) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);

        //
        if (typeof name == "string" && /^\d+$/.test(name)) { return false; }
        if (array[name] != null) { return false; }
        if (selected) { selected[name] = value; return true; }
        return true;
    }

    //
    has(target: any, name: any) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        return (
            (typeof name == "string" && /^\d+$/.test(name) && array[parseInt(name)] != null) ||
            (array[name] != null) ||
            (selected && name in selected)
        );
    }

    //
    deleteProperty(target: any, name: any) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        if (selected && name in selected) { delete selected[name]; return true; }
        return false;
    }

    //
    ownKeys(_target: object): (string | symbol)[] {
        const array = this._getArray(_target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(_target);
        const keys = new Set<string | symbol>();
        array.forEach((el, i) => keys.add(i.toString() as string | symbol));
        Object.getOwnPropertyNames(array).forEach(k => keys.add(k as string | symbol));
        if (selected) Object.getOwnPropertyNames(selected).forEach(k => keys.add(k as string | symbol));
        return Array.from(keys);
    }

    //
    defineProperty(_target: object, name: any, desc: any) {
        return Reflect.defineProperty(_target, name, desc);
    }
}

//
export const Q = (selector: any, host = document.documentElement, index = 0, direction: "children" | "parent" = "children") => {
    // is wrapped element or element itself
    if ((selector?.element ?? selector) instanceof HTMLElement) {
        const el = selector?.element ?? selector; // @ts-ignore
        return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction) as ProxyHandler<any>));
    }

    // is "ref" hook!
    if (typeof selector == "function") {
        const el = selector; // @ts-ignore
        return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction) as ProxyHandler<any>));
    }

    //
    if (host == null || typeof host == "string" || typeof host == "number" || typeof host == "boolean" || typeof host == "symbol" || typeof host == "undefined") { return null; }
    if (existsQueries?.get?.(host)?.has?.(selector)) { return existsQueries?.get?.(host)?.get?.(selector); }

    // @ts-ignore // is selector by host
    return existsQueries?.getOrInsert?.(host, new Map())?.getOrInsertComputed?.(selector, ()=>{
        return new Proxy(host, new UniversalElementHandler(selector, index, direction) as ProxyHandler<any>);
    });
}

// syntax:
// - [name]: (ctx) => function() {}
export const extendQueryPrototype = (extended: any = {})=>{ // @ts-ignore
    return Object.assign(queryExtensions, extended);
}

//
export default Q;
