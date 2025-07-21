import { getStyleRule, observeAttribute, observeAttributeBySelector, observeBySelector } from "fest/dom";

//
export const queryExtensions = {
    logAll (ctx) { return ()=> console.log("attributes:", [...ctx?.attributes].map(x => ({ name: x.name, value: x.value })) ); },
    append (ctx) { return (...args)=> ctx?.append?.(...([...args||[]]?.map?.((e)=>e?.element??e) || args)) },
    current(ctx) { return ctx; } // direct getter
}

//
export class UniversalElementHandler {
    direction: "children" | "parent" = "children";
    selector: string | HTMLElement;
    index: number = 0;

    //
    private _eventMap = new WeakMap<object, Map<string, Map<Function, {wrap: Function, option: any}>>>();
    constructor(selector, index = 0, direction: "children" | "parent" = "children") {
        this.index     = index;
        this.selector  = selector;
        this.direction = direction;
    }

    //
    _observeDOMChange(target, selector, cb) {
        // no possible to listen to DOM change for non-string selector
        return (typeof selector == "string" ? observeBySelector(target, selector, cb) : null);
    }

    //
    _observeAttributes(target, attribute, cb)
        { return (typeof this.selector == "string" ? observeAttributeBySelector(target, this.selector, attribute, cb) : observeAttribute(target ?? this.selector, attribute, cb)); }

    //
    _getArray(target) {
        if (typeof target == "function") { target = this.selector || target?.(this.selector); }; if (!this.selector) return [target];
        if (typeof this.selector == "string") {
            const inclusion = target?.matches?.(this.selector) ? [target] : [];
            if (this.direction === "children") {
                const list = target?.querySelectorAll?.(this.selector);
                return list?.length >= 1 ? [...list] : inclusion;
            } else if (this.direction === "parent") {
                // closest возвращает только первый найденный элемент, обернём в массив для совместимости
                const closest = target?.closest?.(this.selector);
                return closest ? [closest] : inclusion;
            }
        }
        return Array.isArray(this.selector) ? this.selector : [this.selector];
    }

    //
    _getSelected(target) {
        if (typeof target == "function") { target = this.selector || target?.(this.selector); }; if (!this.selector) return target;
        if (typeof this.selector == "string") {
            if (this.direction === "children") { return target?.matches?.(this.selector) ? target : target?.querySelector?.(this.selector); } else
            if (this.direction === "parent"  ) { return target?.matches?.(this.selector) ? target : target?.closest?.(this.selector);}
        }
        return this.selector;
    }

    //
    _redirectToBubble(eventName) {
        return {
            ["pointerenter"]: "pointerover",
            ["pointerleave"]: "pointerout",
            ["mouseenter"]: "mouseover",
            ["mouseleave"]: "mouseout",
            ["focus"]: "focusin",
            ["blur"]: "focusout",
        }?.[eventName] || eventName;
    }

    //
    _addEventListener(target, name, cb, option?) {
        const eventName = this._redirectToBubble(name);
        const wrap = (ev) => {
            let tg = (ev?.target ?? ev?.currentTarget) ?? (typeof this.selector != "string" ? this.selector : null) ?? (target);
            if (target?.matches?.(this.selector) || target?.querySelector?.(this.selector)?.contains?.(tg) || tg?.matches?.(this.selector))
                { cb?.call?.(tg, ev); }
        };
        target?.addEventListener?.(eventName, wrap, option);

        // @ts-ignore
        const eventMap = this._eventMap.getOrInsert(target, new Map())!;
        const cbMap = eventMap.getOrInsert(eventName, new WeakMap())!;
        cbMap.set(cb, {wrap, option});
        return wrap;
    }

    //
    _removeEventListener(target, name, cb, option?) {
        const eventName = this._redirectToBubble(name), eventMap = this._eventMap.get(target);
        if (!eventMap) return; const cbMap = eventMap.get(eventName), entry = cbMap?.get?.(cb);
        target?.removeEventListener?.(eventName, entry?.wrap ?? cb, option ?? entry?.option ?? {});
        cbMap?.delete?.(cb); if (cbMap?.size === 0) eventMap?.delete?.(eventName);
        if (eventMap.size === 0) this._eventMap.delete(target);
    }

    //
    get(target, name, ctx) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);

        // Extensions
        if (name in queryExtensions) { return queryExtensions?.[name]?.(selected); }
        if (name === "length" && array?.length) { return array?.length; }

        //
        if (name === "_updateSelector") return (sel)=>(this.selector = sel || this.selector);
        if (["style", "attributeStyleMap"].indexOf(name) >= 0) {
            const basis = (this.selector ? (typeof this.selector == "string" ? getStyleRule(this.selector, null, "ux-query", target) : (selected?.dataset?.id ? getStyleRule(`[data-id="${selected?.dataset?.id}"]`) : selected)) : (selected ?? target)) ?? selected;
            if (basis?.[name] != null) { return basis?.[name]; }
        }

        //
        if (selected?.[name] != null) { return typeof selected[name] === "function" ? selected[name].bind(selected) : selected[name]; }
        if (   array?.[name] != null) { return typeof    array[name] === "function" ?    array[name].bind(array)    :    array[name]; }

        //
        if (name === "self") return target;
        if (name === "selector") return this.selector;;
        if (name === "observeAttr") return (name, cb)=>this._observeAttributes(target, name, cb);
        if (name === "DOMChange") return (cb)=>this._observeDOMChange(target, this.selector, cb);
        if (name === "addEventListener") return (name, cb, opt?)=>this._addEventListener(target, name, cb, opt);
        if (name === "removeEventListener") return (name, cb, opt?)=>this._removeEventListener(target, name, cb, opt);

        // for BLU.E
        if (name === "element") {
            if (array?.length <= 1) return selected?.element ?? selected;
            const fragment = document.createDocumentFragment();
            fragment.append(...array); return fragment;
        }

        //
        if (name === "deref" && (typeof selected == "object" || typeof selected == "function") && selected != null) {
            const wk = new WeakRef(selected);
            return ()=>(wk?.deref?.()?.element ?? wk?.deref?.());
        }

        //
        if (typeof name === "string" && /^\d+$/.test(name)) { return array[parseInt(name)]; }

        //
        return;
    }

    //
    set(target, name, value) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);

        //
        if (typeof name === "string" && /^\d+$/.test(name)) { return false; }
        if (array[name] != null) { return false; }
        if (selected) { selected[name] = value; return true; }
        return false;
    }

    //
    has(target, name) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        return (
            (typeof name === "string" && /^\d+$/.test(name) && array[parseInt(name)] != null) ||
            (array[name] != null) ||
            (selected && name in selected)
        );
    }

    //
    deleteProperty(target, name) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        if (selected && name in selected) { delete selected[name]; return true; }
        return false;
    }

    //
    ownKeys(target) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        const keys = new Set();
        array.forEach((el, i) => keys.add(i.toString()));
        Object.getOwnPropertyNames(array).forEach(k => keys.add(k));
        if (selected) Object.getOwnPropertyNames(selected).forEach(k => keys.add(k));
        return Array.from(keys);
    }

    //
    defineProperty(target, name, desc) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        if (selected) { Object.defineProperty(selected, name, desc); return true; }
        return false;
    }

    //
    apply(target, self, args) {
        args[0] ||= this.selector;
        const result = target?.apply?.(self, args);
        this.selector = result || this.selector;
        return new Proxy(target, this as ProxyHandler<any>);
    }
}

//
const alreadyUsed = new WeakMap();
export const Q = (selector, host = document.documentElement, index = 0, direction: "children" | "parent" = "children") => {
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
    // is selector by host
    return new Proxy(host, new UniversalElementHandler(selector, index, direction) as ProxyHandler<any>);
}

// syntax:
// - [name]: (ctx) => function() {}
export const extendQueryPrototype = (extended: any = {})=>{
    return Object.assign(queryExtensions, extended);
}
