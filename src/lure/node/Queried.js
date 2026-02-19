import { observeAttributeBySelector, getAdoptedStyleRule, handleAttribute, containsOrSelf, MOCElement, observeBySelector, observeAttribute } from "fest/dom";
import { bindWith, elMap } from "../core/Binding";
import { $affected } from "fest/object";
//
const existsQueries = new WeakMap();
const alreadyUsed = new WeakMap();
const queryExtensions = {
    logAll(ctx) { return () => console.log("attributes:", [...ctx?.attributes].map(x => ({ name: x.name, value: x.value }))); },
    append(ctx) { return (...args) => ctx?.append?.(...([...args || []]?.map?.((e) => e?.element ?? e) || args)); },
    current(ctx) { return ctx; } // direct getter
};
//
class UniversalElementHandler {
    direction = "children";
    selector;
    index = 0;
    //
    _eventMap = new WeakMap();
    constructor(selector, index = 0, direction = "children") {
        this.index = index;
        this.selector = selector;
        this.direction = direction;
    }
    //
    _observeDOMChange(target, selector, cb) {
        // no possible to listen to DOM change for non-string selector
        return (typeof selector == "string" ? observeBySelector(target, selector, cb) : null);
    }
    //
    _observeAttributes(target, attribute, cb) { return (typeof this.selector == "string" ? observeAttributeBySelector(target, this.selector, attribute, cb) : observeAttribute(target ?? this.selector, attribute, cb)); }
    //
    _getArray(target) {
        if (typeof target == "function") {
            target = this.selector || target?.(this.selector);
        }
        ;
        if (!this.selector)
            return [target];
        if (typeof this.selector == "string") {
            const inclusion = ((typeof target?.matches == "function" && target?.element != null) && target?.matches?.(this.selector)) ? [target] : [];
            if (this.direction == "children") {
                const list = (typeof target?.querySelectorAll == "function" && target?.element != null) ? [...target?.querySelectorAll?.(this.selector)] : [];
                return list?.length >= 1 ? [...list] : inclusion;
            }
            else if (this.direction == "parent") {
                const closest = target?.closest?.(this.selector);
                return closest ? [closest] : inclusion;
            }
            return inclusion;
        }
        return Array.isArray(this.selector) ? this.selector : [this.selector];
    }
    //
    _getSelected(target) {
        const tg = target?.self ?? target;
        const sel = this._selector(target);
        if (typeof sel == "string") {
            if (this.direction == "children") {
                return tg?.matches?.(sel) ? tg : tg?.querySelector?.(sel);
            }
            if (this.direction == "parent") {
                return tg?.matches?.(sel) ? tg : tg?.closest?.(sel);
            }
        }
        return tg == (sel?.element ?? sel) ? (sel?.element ?? sel) : null;
    }
    // if selector isn't string, can't be redirected
    _redirectToBubble(eventName) {
        const sel = this._selector();
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
    _addEventListener(target, name, cb, option) {
        const selector = this._selector(target);
        if (typeof selector != "string") {
            selector?.addEventListener?.(name, cb, option);
            return cb;
        }
        //
        const eventName = this._redirectToBubble(name);
        const parent = target?.self ?? target;
        const wrap = (ev) => {
            const sel = this._selector(target);
            const rot = ev?.currentTarget ?? parent;
            // Use composedPath() for shadow DOM compatibility
            let tg = null;
            if (ev?.composedPath && typeof ev.composedPath === 'function') {
                const path = ev.composedPath();
                // Find the first element in the composed path that matches our selector or is within our target
                for (const node of path) {
                    if (node instanceof HTMLElement || node instanceof Element) {
                        const nodeEl = node?.element ?? node;
                        if (typeof sel == "string") {
                            if (MOCElement(nodeEl, sel, ev)) {
                                tg = nodeEl;
                                break;
                            }
                        }
                        else {
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
            if (typeof sel == "string") {
                if (containsOrSelf(rot, MOCElement(tg, sel, ev), ev)) {
                    cb?.call?.(tg, ev);
                }
            }
            else {
                if (containsOrSelf(rot, sel, ev) && containsOrSelf(sel, tg, ev)) {
                    cb?.call?.(tg, ev);
                }
            }
        };
        parent?.addEventListener?.(eventName, wrap, option);
        // @ts-ignore
        const eventMap = this._eventMap.getOrInsert(parent, new Map());
        const cbMap = eventMap.getOrInsert(eventName, new WeakMap());
        cbMap.set(cb, { wrap, option });
        return wrap;
    }
    //
    _removeEventListener(target, name, cb, option) {
        const selector = this._selector(target);
        if (typeof selector != "string") {
            selector?.removeEventListener?.(name, cb, option);
            return cb;
        }
        //
        const parent = target?.self ?? target;
        const eventName = this._redirectToBubble(name), eventMap = this._eventMap.get(parent);
        if (!eventMap)
            return;
        const cbMap = eventMap.get(eventName), entry = cbMap?.get?.(cb);
        parent?.removeEventListener?.(eventName, entry?.wrap ?? cb, option ?? entry?.option ?? {});
        cbMap?.delete?.(cb);
        if (cbMap?.size == 0)
            eventMap?.delete?.(eventName);
        if (eventMap.size == 0)
            this._eventMap.delete(parent);
    }
    //
    _selector(tg) {
        if (typeof this.selector == "string" && typeof tg?.selector == "string") {
            return ((tg?.selector || "") + " " + this.selector)?.trim?.();
        }
        return this.selector;
    }
    //
    get(target, name, ctx) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        // Extensions
        if (name in queryExtensions) {
            return queryExtensions?.[name]?.(selected);
        }
        if (name == "length" && array?.length != null) {
            return array?.length;
        }
        //
        if (name == "_updateSelector")
            return (sel) => (this.selector = sel || this.selector);
        if (["style", "attributeStyleMap"].indexOf(name) >= 0) {
            const tg = target?.self ?? target;
            const selector = this._selector(target);
            const basis = (typeof selector == "string" ?
                getAdoptedStyleRule(selector, "ux-query", tg) :
                selected);
            if (name == "attributeStyleMap") {
                return basis?.styleMap ?? basis?.attributeStyleMap;
            }
            return basis?.[name];
        }
        //
        if (name == "self")
            return (target?.self ?? target);
        if (name == "selector")
            return this._selector(target);
        //
        if (name == "observeAttr")
            return (name, cb) => this._observeAttributes(target, name, cb);
        if (name == "DOMChange")
            return (cb) => this._observeDOMChange(target, this.selector, cb);
        if (name == "addEventListener")
            return (name, cb, opt) => this._addEventListener(target, name, cb, opt);
        if (name == "removeEventListener")
            return (name, cb, opt) => this._removeEventListener(target, name, cb, opt);
        // get compatible reactive value, if bound
        if (name == "getAttribute") {
            return (key) => {
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
                if (elMap?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) {
                    return elMap?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[0];
                }
                return selected?.getAttribute?.(key);
            };
        }
        // set attribute
        if (name == "setAttribute") {
            return (key, value) => {
                // TODO:
                // - support for multiple elements
                // - support for newer elements by DOM Observer
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                if (typeof value == "object" && (value?.value != null || "value" in value)) {
                    return bindWith(selected, key, value, handleAttribute, null, true);
                }
                return selected?.setAttribute?.(key, value);
            };
        }
        //
        if (name == "removeAttribute") {
            return (key) => {
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
                if (elMap?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) {
                    return elMap?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[1]?.();
                }
                return selected?.removeAttribute?.(key);
            };
        }
        //
        if (name == "hasAttribute") {
            return (key) => {
                const array = this._getArray(target);
                const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
                const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
                if (elMap?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) {
                    return true;
                }
                return selected?.hasAttribute?.(key);
            };
        }
        // for BLU.E
        if (name == "element") {
            if (array?.length <= 1)
                return selected?.element ?? selected;
            const fragment = document.createDocumentFragment();
            fragment.append(...array);
            return fragment;
        }
        //
        if (name == Symbol.toPrimitive) {
            if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) {
                return (hint) => {
                    if (hint == "number")
                        return (selected?.element ?? selected)?.valueAsNumber ?? parseFloat((selected?.element ?? selected)?.value);
                    if (hint == "string")
                        return String((selected?.element ?? selected)?.value ?? (selected?.element ?? selected));
                    if (hint == "boolean")
                        return (selected?.element ?? selected)?.checked;
                    return (selected?.element ?? selected)?.checked ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected);
                };
            }
        }
        //
        if (name == "checked") {
            if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) {
                return (selected?.element ?? selected)?.checked;
            }
        }
        //
        if (name == "value") {
            if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) {
                return (selected?.element ?? selected)?.valueAsNumber ?? (selected?.element ?? selected)?.valueAsDate ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected)?.checked;
            }
        }
        // can be subscribed
        if (name == $affected) {
            if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) {
                return (cb) => {
                    let oldValue = selected?.value;
                    const evt = [
                        (ev) => {
                            const input = this._getSelected(ev?.target);
                            cb?.(input?.value, "value", oldValue);
                            oldValue = input?.value;
                        }, { passive: true }
                    ];
                    this._addEventListener(target, "change", ...evt);
                    return () => this._removeEventListener(target, "change", ...evt);
                };
            }
        }
        //
        if (name == "deref" && (typeof selected == "object" || typeof selected == "function") && selected != null) {
            const wk = new WeakRef(selected);
            return () => (wk?.deref?.()?.element ?? wk?.deref?.());
        }
        //
        if (typeof name == "string" && /^\d+$/.test(name)) {
            return array[parseInt(name)];
        }
        ;
        //
        const origin = selected; //selected?.element ?? selected;
        if (origin?.[name] != null) {
            return typeof origin[name] == "function" ? origin[name].bind(origin) : origin[name];
        }
        if (array?.[name] != null) {
            return typeof array[name] == "function" ? array[name].bind(array) : array[name];
        }
        // remains possible getters
        //return Reflect.get(target, name, ctx);
        return typeof target?.[name] == "function" ? target?.[name].bind(origin) : target?.[name];
    }
    //
    set(target, name, value) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        //
        if (typeof name == "string" && /^\d+$/.test(name)) {
            return false;
        }
        if (array[name] != null) {
            return false;
        }
        if (selected) {
            selected[name] = value;
            return true;
        }
        return true;
    }
    //
    has(target, name) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        return ((typeof name == "string" && /^\d+$/.test(name) && array[parseInt(name)] != null) ||
            (array[name] != null) ||
            (selected && name in selected));
    }
    //
    deleteProperty(target, name) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        if (selected && name in selected) {
            delete selected[name];
            return true;
        }
        return false;
    }
    //
    ownKeys(target) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        const keys = new Set();
        array.forEach((el, i) => keys.add(i.toString()));
        Object.getOwnPropertyNames(array).forEach(k => keys.add(k));
        if (selected)
            Object.getOwnPropertyNames(selected).forEach(k => keys.add(k));
        return Array.from(keys);
    }
    //
    defineProperty(target, name, desc) {
        const array = this._getArray(target);
        const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
        if (selected) {
            Object.defineProperty(selected, name, desc);
            return true;
        }
        return false;
    }
    //
    apply(target, self, args) {
        args[0] ||= this.selector;
        const result = target?.apply?.(self, args);
        this.selector = result || this.selector;
        return new Proxy(target, this);
    }
}
//
export const Q = (selector, host = document.documentElement, index = 0, direction = "children") => {
    // is wrapped element or element itself
    if ((selector?.element ?? selector) instanceof HTMLElement) {
        const el = selector?.element ?? selector; // @ts-ignore
        return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
    }
    // is "ref" hook!
    if (typeof selector == "function") {
        const el = selector; // @ts-ignore
        return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
    }
    //
    if (host == null || typeof host == "string" || typeof host == "number" || typeof host == "boolean" || typeof host == "symbol" || typeof host == "undefined") {
        return null;
    }
    if (existsQueries?.get?.(host)?.has?.(selector)) {
        return existsQueries?.get?.(host)?.get?.(selector);
    }
    // @ts-ignore // is selector by host
    return existsQueries?.getOrInsert?.(host, new Map())?.getOrInsertComputed?.(selector, () => {
        return new Proxy(host, new UniversalElementHandler(selector, index, direction));
    });
};
// syntax:
// - [name]: (ctx) => function() {}
export const extendQueryPrototype = (extended = {}) => {
    return Object.assign(queryExtensions, extended);
};
//
export default Q;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVlcmllZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlF1ZXJpZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzdKLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV4QyxFQUFFO0FBQ0YsTUFBTSxhQUFhLEdBQUcsSUFBSSxPQUFPLEVBQXFDLENBQUM7QUFDdkUsTUFBTSxXQUFXLEdBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNwQyxNQUFNLGVBQWUsR0FBRztJQUNwQixNQUFNLENBQUUsR0FBRyxJQUFJLE9BQU8sR0FBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUgsTUFBTSxDQUFFLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUEsQ0FBQyxFQUFFLE9BQU8sSUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUN4RyxPQUFPLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtDQUNoRCxDQUFBO0FBRUQsRUFBRTtBQUNGLE1BQU0sdUJBQXVCO0lBQ3pCLFNBQVMsR0FBMEIsVUFBVSxDQUFDO0lBQzlDLFFBQVEsQ0FBdUI7SUFDL0IsS0FBSyxHQUFXLENBQUMsQ0FBQztJQUVsQixFQUFFO0lBQ00sU0FBUyxHQUFHLElBQUksT0FBTyxFQUFxRSxDQUFDO0lBQ3JHLFlBQVksUUFBUSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsWUFBbUMsVUFBVTtRQUMxRSxJQUFJLENBQUMsS0FBSyxHQUFPLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFJLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBRUQsRUFBRTtJQUNGLGlCQUFpQixDQUFDLE1BQVcsRUFBRSxRQUFhLEVBQUUsRUFBTztRQUNqRCw4REFBOEQ7UUFDOUQsT0FBTyxDQUFDLE9BQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVELEVBQUU7SUFDRixrQkFBa0IsQ0FBQyxNQUFXLEVBQUUsU0FBYyxFQUFFLEVBQU8sSUFDakQsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhMLEVBQUU7SUFDRixTQUFTLENBQUMsTUFBVztRQUNqQixJQUFJLE9BQU8sTUFBTSxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUFBLENBQUM7UUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0gsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxFQUFFLENBQUM7WUFDbkMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sTUFBTSxFQUFFLE9BQU8sSUFBSSxVQUFVLElBQUksTUFBTSxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxNQUFNLEVBQUUsZ0JBQWdCLElBQUksVUFBVSxJQUFJLE1BQU0sRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM5SSxPQUFPLElBQUksRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNyRCxDQUFDO2lCQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDcEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FB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LFNBQVMsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLElBQUksT0FBTyxJQUFJLElBQUksV0FBVyxFQUFFLENBQUM7UUFBQyxPQUFPLElBQUksQ0FBQztJQUFDLENBQUM7SUFDN0ssSUFBSSxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUFDLE9BQU8sYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUV4RyxvQ0FBb0M7SUFDcEMsT0FBTyxhQUFhLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFFLEVBQUU7UUFDdEYsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBc0IsQ0FBQyxDQUFDO0lBQ3pHLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBRUQsVUFBVTtBQUNWLG1DQUFtQztBQUNuQyxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFdBQWdCLEVBQUUsRUFBQyxFQUFFO0lBQ3RELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFBO0FBRUQsRUFBRTtBQUNGLGVBQWUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgb2JzZXJ2ZUF0dHJpYnV0ZUJ5U2VsZWN0b3IsIGdldEFkb3B0ZWRTdHlsZVJ1bGUsIGhhbmRsZUF0dHJpYnV0ZSwgY29udGFpbnNPclNlbGYsIE1PQ0VsZW1lbnQsIG9ic2VydmVCeVNlbGVjdG9yLCBvYnNlcnZlQXR0cmlidXRlIH0gZnJvbSBcImZlc3QvZG9tXCI7XG5pbXBvcnQgeyBiaW5kV2l0aCwgZWxNYXAgfSBmcm9tIFwiLi4vY29yZS9CaW5kaW5nXCI7XG5pbXBvcnQgeyAkYWZmZWN0ZWQgfSBmcm9tIFwiZmVzdC9vYmplY3RcIjtcblxuLy9cbmNvbnN0IGV4aXN0c1F1ZXJpZXMgPSBuZXcgV2Vha01hcDxhbnksIE1hcDxzdHJpbmd8SFRNTEVsZW1lbnQsIGFueT4+KCk7XG5jb25zdCBhbHJlYWR5VXNlZCAgID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHF1ZXJ5RXh0ZW5zaW9ucyA9IHtcbiAgICBsb2dBbGwgKGN0eCkgeyByZXR1cm4gKCk9PiBjb25zb2xlLmxvZyhcImF0dHJpYnV0ZXM6XCIsIFsuLi5jdHg/LmF0dHJpYnV0ZXNdLm1hcCh4ID0+ICh7IG5hbWU6IHgubmFtZSwgdmFsdWU6IHgudmFsdWUgfSkpICk7IH0sXG4gICAgYXBwZW5kIChjdHgpIHsgcmV0dXJuICguLi5hcmdzKT0+IGN0eD8uYXBwZW5kPy4oLi4uKFsuLi5hcmdzfHxbXV0/Lm1hcD8uKChlKT0+ZT8uZWxlbWVudD8/ZSkgfHwgYXJncykpIH0sXG4gICAgY3VycmVudChjdHgpIHsgcmV0dXJuIGN0eDsgfSAvLyBkaXJlY3QgZ2V0dGVyXG59XG5cbi8vXG5jbGFzcyBVbml2ZXJzYWxFbGVtZW50SGFuZGxlciB7XG4gICAgZGlyZWN0aW9uOiBcImNoaWxkcmVuXCIgfCBcInBhcmVudFwiID0gXCJjaGlsZHJlblwiO1xuICAgIHNlbGVjdG9yOiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcbiAgICBpbmRleDogbnVtYmVyID0gMDtcblxuICAgIC8vXG4gICAgcHJpdmF0ZSBfZXZlbnRNYXAgPSBuZXcgV2Vha01hcDxvYmplY3QsIE1hcDxzdHJpbmcsIE1hcDxGdW5jdGlvbiwge3dyYXA6IEZ1bmN0aW9uLCBvcHRpb246IGFueX0+Pj4oKTtcbiAgICBjb25zdHJ1Y3RvcihzZWxlY3RvciwgaW5kZXggPSAwLCBkaXJlY3Rpb246IFwiY2hpbGRyZW5cIiB8IFwicGFyZW50XCIgPSBcImNoaWxkcmVuXCIpIHtcbiAgICAgICAgdGhpcy5pbmRleCAgICAgPSBpbmRleDtcbiAgICAgICAgdGhpcy5zZWxlY3RvciAgPSBzZWxlY3RvcjtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgfVxuXG4gICAgLy9cbiAgICBfb2JzZXJ2ZURPTUNoYW5nZSh0YXJnZXQ6IGFueSwgc2VsZWN0b3I6IGFueSwgY2I6IGFueSkge1xuICAgICAgICAvLyBubyBwb3NzaWJsZSB0byBsaXN0ZW4gdG8gRE9NIGNoYW5nZSBmb3Igbm9uLXN0cmluZyBzZWxlY3RvclxuICAgICAgICByZXR1cm4gKHR5cGVvZiBzZWxlY3RvciA9PSBcInN0cmluZ1wiID8gb2JzZXJ2ZUJ5U2VsZWN0b3IodGFyZ2V0LCBzZWxlY3RvciwgY2IpIDogbnVsbCk7XG4gICAgfVxuXG4gICAgLy9cbiAgICBfb2JzZXJ2ZUF0dHJpYnV0ZXModGFyZ2V0OiBhbnksIGF0dHJpYnV0ZTogYW55LCBjYjogYW55KVxuICAgICAgICB7IHJldHVybiAodHlwZW9mIHRoaXMuc2VsZWN0b3IgPT0gXCJzdHJpbmdcIiA/IG9ic2VydmVBdHRyaWJ1dGVCeVNlbGVjdG9yKHRhcmdldCwgdGhpcy5zZWxlY3RvciwgYXR0cmlidXRlLCBjYikgOiBvYnNlcnZlQXR0cmlidXRlKHRhcmdldCA/PyB0aGlzLnNlbGVjdG9yLCBhdHRyaWJ1dGUsIGNiKSk7IH1cblxuICAgIC8vXG4gICAgX2dldEFycmF5KHRhcmdldDogYW55KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgeyB0YXJnZXQgPSB0aGlzLnNlbGVjdG9yIHx8IHRhcmdldD8uKHRoaXMuc2VsZWN0b3IpOyB9OyBpZiAoIXRoaXMuc2VsZWN0b3IpIHJldHVybiBbdGFyZ2V0XTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnNlbGVjdG9yID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGluY2x1c2lvbiA9ICgodHlwZW9mIHRhcmdldD8ubWF0Y2hlcyA9PSBcImZ1bmN0aW9uXCIgJiYgdGFyZ2V0Py5lbGVtZW50ICE9IG51bGwpICYmIHRhcmdldD8ubWF0Y2hlcz8uKHRoaXMuc2VsZWN0b3IpKSA/IFt0YXJnZXRdIDogW107XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gXCJjaGlsZHJlblwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9ICh0eXBlb2YgdGFyZ2V0Py5xdWVyeVNlbGVjdG9yQWxsID09IFwiZnVuY3Rpb25cIiAmJiB0YXJnZXQ/LmVsZW1lbnQgIT0gbnVsbCkgPyBbLi4udGFyZ2V0Py5xdWVyeVNlbGVjdG9yQWxsPy4odGhpcy5zZWxlY3RvcildIDogW107XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3Q/Lmxlbmd0aCA+PSAxID8gWy4uLmxpc3RdIDogaW5jbHVzaW9uO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PSBcInBhcmVudFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2VzdCA9IHRhcmdldD8uY2xvc2VzdD8uKHRoaXMuc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbG9zZXN0ID8gW2Nsb3Nlc3RdIDogaW5jbHVzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluY2x1c2lvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGlzLnNlbGVjdG9yKSA/IHRoaXMuc2VsZWN0b3IgOiBbdGhpcy5zZWxlY3Rvcl07XG4gICAgfVxuXG4gICAgLy9cbiAgICBfZ2V0U2VsZWN0ZWQodGFyZ2V0OiBhbnkpIHtcbiAgICAgICAgY29uc3QgdGcgPSB0YXJnZXQ/LnNlbGYgPz8gdGFyZ2V0O1xuICAgICAgICBjb25zdCBzZWwgPSB0aGlzLl9zZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICBpZiAodHlwZW9mIHNlbCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT0gXCJjaGlsZHJlblwiKSB7IHJldHVybiB0Zz8ubWF0Y2hlcz8uKHNlbCkgPyB0ZyA6IHRnPy5xdWVyeVNlbGVjdG9yPy4oc2VsKTsgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09IFwicGFyZW50XCIgICkgeyByZXR1cm4gdGc/Lm1hdGNoZXM/LihzZWwpID8gdGcgOiB0Zz8uY2xvc2VzdD8uKHNlbCk7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGcgPT0gKChzZWwgYXMgYW55KT8uZWxlbWVudCA/PyBzZWwpID8gKChzZWwgYXMgYW55KT8uZWxlbWVudCA/PyBzZWwpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyBpZiBzZWxlY3RvciBpc24ndCBzdHJpbmcsIGNhbid0IGJlIHJlZGlyZWN0ZWRcbiAgICBfcmVkaXJlY3RUb0J1YmJsZShldmVudE5hbWU6IGFueSkge1xuICAgICAgICBjb25zdCBzZWw6IGFueSA9IHRoaXMuX3NlbGVjdG9yKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgW1wicG9pbnRlcmVudGVyXCJdOiBcInBvaW50ZXJvdmVyXCIsXG4gICAgICAgICAgICAgICAgW1wicG9pbnRlcmxlYXZlXCJdOiBcInBvaW50ZXJvdXRcIixcbiAgICAgICAgICAgICAgICBbXCJtb3VzZWVudGVyXCJdOiBcIm1vdXNlb3ZlclwiLFxuICAgICAgICAgICAgICAgIFtcIm1vdXNlbGVhdmVcIl06IFwibW91c2VvdXRcIixcbiAgICAgICAgICAgICAgICBbXCJmb2N1c1wiXTogXCJmb2N1c2luXCIsXG4gICAgICAgICAgICAgICAgW1wiYmx1clwiXTogXCJmb2N1c291dFwiLFxuICAgICAgICAgICAgfT8uW2V2ZW50TmFtZV0gfHwgZXZlbnROYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudE5hbWU7XG4gICAgfVxuXG4gICAgLy9cbiAgICBfYWRkRXZlbnRMaXN0ZW5lcih0YXJnZXQ6IGFueSwgbmFtZTogYW55LCBjYjogYW55LCBvcHRpb24/OiBhbnkpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSB0aGlzLl9zZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdG9yPy5hZGRFdmVudExpc3RlbmVyPy4obmFtZSwgY2IsIG9wdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gY2I7XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSB0aGlzLl9yZWRpcmVjdFRvQnViYmxlKG5hbWUpO1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0YXJnZXQ/LnNlbGYgPz8gdGFyZ2V0O1xuICAgICAgICBjb25zdCB3cmFwID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWw6IGFueSA9IHRoaXMuX3NlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCByb3QgPSBldj8uY3VycmVudFRhcmdldCA/PyBwYXJlbnQ7XG5cbiAgICAgICAgICAgIC8vIFVzZSBjb21wb3NlZFBhdGgoKSBmb3Igc2hhZG93IERPTSBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICBsZXQgdGc6IGFueSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoZXY/LmNvbXBvc2VkUGF0aCAmJiB0eXBlb2YgZXYuY29tcG9zZWRQYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGV2LmNvbXBvc2VkUGF0aCgpO1xuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbXBvc2VkIHBhdGggdGhhdCBtYXRjaGVzIG91ciBzZWxlY3RvciBvciBpcyB3aXRoaW4gb3VyIHRhcmdldFxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVFbCA9IChub2RlIGFzIGFueSk/LmVsZW1lbnQgPz8gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTU9DRWxlbWVudChub2RlRWwsIHNlbCwgZXYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRnID0gbm9kZUVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250YWluc09yU2VsZihzZWwsIG5vZGVFbCwgZXYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRnID0gbm9kZUVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZhbGxiYWNrIHRvIG9yaWdpbmFsIGxvZ2ljIGlmIGNvbXBvc2VkUGF0aCBkaWRuJ3QgZmluZCBhIG1hdGNoXG4gICAgICAgICAgICBpZiAoIXRnKSB7XG4gICAgICAgICAgICAgICAgdGcgPSAoZXY/LnRhcmdldCA/PyB0aGlzLl9nZXRTZWxlY3RlZCh0YXJnZXQpKSA/PyByb3Q7XG4gICAgICAgICAgICAgICAgdGcgPSB0Zz8uZWxlbWVudCA/PyB0ZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWwgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICB7IGlmIChjb250YWluc09yU2VsZihyb3QsIE1PQ0VsZW1lbnQodGcsIHNlbCwgZXYpLCBldikpIHsgY2I/LmNhbGw/Lih0ZywgZXYpOyB9IH0gZWxzZVxuICAgICAgICAgICAgICAgIHsgaWYgKGNvbnRhaW5zT3JTZWxmKHJvdCwgc2VsLCBldikgJiYgY29udGFpbnNPclNlbGYoc2VsLCB0ZywgZXYpKSB7IGNiPy5jYWxsPy4odGcsIGV2KTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBwYXJlbnQ/LmFkZEV2ZW50TGlzdGVuZXI/LihldmVudE5hbWUsIHdyYXAsIG9wdGlvbik7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBldmVudE1hcCA9IHRoaXMuX2V2ZW50TWFwLmdldE9ySW5zZXJ0KHBhcmVudCwgbmV3IE1hcCgpKSE7XG4gICAgICAgIGNvbnN0IGNiTWFwID0gZXZlbnRNYXAuZ2V0T3JJbnNlcnQoZXZlbnROYW1lLCBuZXcgV2Vha01hcCgpKSE7XG4gICAgICAgIGNiTWFwLnNldChjYiwge3dyYXAsIG9wdGlvbn0pO1xuICAgICAgICByZXR1cm4gd3JhcDtcbiAgICB9XG5cbiAgICAvL1xuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyKHRhcmdldDogYW55LCBuYW1lOiBhbnksIGNiOiBhbnksIG9wdGlvbj86IGFueSkge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IHRoaXMuX3NlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgc2VsZWN0b3I/LnJlbW92ZUV2ZW50TGlzdGVuZXI/LihuYW1lLCBjYiwgb3B0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBjYjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRhcmdldD8uc2VsZiA/PyB0YXJnZXQ7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IHRoaXMuX3JlZGlyZWN0VG9CdWJibGUobmFtZSksIGV2ZW50TWFwID0gdGhpcy5fZXZlbnRNYXAuZ2V0KHBhcmVudCk7XG4gICAgICAgIGlmICghZXZlbnRNYXApIHJldHVybjsgY29uc3QgY2JNYXAgPSBldmVudE1hcC5nZXQoZXZlbnROYW1lKSwgZW50cnkgPSBjYk1hcD8uZ2V0Py4oY2IpO1xuICAgICAgICBwYXJlbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXI/LihldmVudE5hbWUsIGVudHJ5Py53cmFwID8/IGNiLCBvcHRpb24gPz8gZW50cnk/Lm9wdGlvbiA/PyB7fSk7XG4gICAgICAgIGNiTWFwPy5kZWxldGU/LihjYik7IGlmIChjYk1hcD8uc2l6ZSA9PSAwKSBldmVudE1hcD8uZGVsZXRlPy4oZXZlbnROYW1lKTtcbiAgICAgICAgaWYgKGV2ZW50TWFwLnNpemUgPT0gMCkgdGhpcy5fZXZlbnRNYXAuZGVsZXRlKHBhcmVudCk7XG4gICAgfVxuXG4gICAgLy9cbiAgICBfc2VsZWN0b3IodGc/OiBhbnkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnNlbGVjdG9yID09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHRnPy5zZWxlY3RvciA9PSBcInN0cmluZ1wiKSB7IHJldHVybiAoKHRnPy5zZWxlY3RvciB8fCBcIlwiKSArIFwiIFwiICsgdGhpcy5zZWxlY3Rvcik/LnRyaW0/LigpOyB9XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdG9yO1xuICAgIH1cblxuICAgIC8vXG4gICAgZ2V0KHRhcmdldDogYW55LCBuYW1lOiBhbnksIGN0eDogYW55KSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gdGhpcy5fZ2V0QXJyYXkodGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbdGhpcy5pbmRleF0gOiB0aGlzLl9nZXRTZWxlY3RlZCh0YXJnZXQpO1xuXG4gICAgICAgIC8vIEV4dGVuc2lvbnNcbiAgICAgICAgaWYgKG5hbWUgaW4gcXVlcnlFeHRlbnNpb25zKSB7IHJldHVybiBxdWVyeUV4dGVuc2lvbnM/LltuYW1lXT8uKHNlbGVjdGVkKTsgfVxuICAgICAgICBpZiAobmFtZSA9PSBcImxlbmd0aFwiICYmIGFycmF5Py5sZW5ndGggIT0gbnVsbCkgeyByZXR1cm4gYXJyYXk/Lmxlbmd0aDsgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwiX3VwZGF0ZVNlbGVjdG9yXCIpIHJldHVybiAoc2VsKT0+KHRoaXMuc2VsZWN0b3IgPSBzZWwgfHwgdGhpcy5zZWxlY3Rvcik7XG4gICAgICAgIGlmIChbXCJzdHlsZVwiLCBcImF0dHJpYnV0ZVN0eWxlTWFwXCJdLmluZGV4T2YobmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgY29uc3QgdGcgPSB0YXJnZXQ/LnNlbGYgPz8gdGFyZ2V0O1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSB0aGlzLl9zZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgYmFzaXMgPSAodHlwZW9mIHNlbGVjdG9yID09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgIGdldEFkb3B0ZWRTdHlsZVJ1bGUoc2VsZWN0b3IsIFwidXgtcXVlcnlcIiwgdGcpIDpcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwiYXR0cmlidXRlU3R5bGVNYXBcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiYXNpcz8uc3R5bGVNYXAgPz8gYmFzaXM/LmF0dHJpYnV0ZVN0eWxlTWFwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJhc2lzPy5bbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcInNlbGZcIikgcmV0dXJuICh0YXJnZXQ/LnNlbGYgPz8gdGFyZ2V0KTtcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJzZWxlY3RvclwiKSByZXR1cm4gdGhpcy5fc2VsZWN0b3IodGFyZ2V0KTtcblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcIm9ic2VydmVBdHRyXCIpIHJldHVybiAobmFtZSwgY2IpPT50aGlzLl9vYnNlcnZlQXR0cmlidXRlcyh0YXJnZXQsIG5hbWUsIGNiKTtcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJET01DaGFuZ2VcIikgcmV0dXJuIChjYik9PnRoaXMuX29ic2VydmVET01DaGFuZ2UodGFyZ2V0LCB0aGlzLnNlbGVjdG9yLCBjYik7XG4gICAgICAgIGlmIChuYW1lID09IFwiYWRkRXZlbnRMaXN0ZW5lclwiKSByZXR1cm4gKG5hbWUsIGNiLCBvcHQ/KT0+dGhpcy5fYWRkRXZlbnRMaXN0ZW5lcih0YXJnZXQsIG5hbWUsIGNiLCBvcHQpO1xuICAgICAgICBpZiAobmFtZSA9PSBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIikgcmV0dXJuIChuYW1lLCBjYiwgb3B0Pyk9PnRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXIodGFyZ2V0LCBuYW1lLCBjYiwgb3B0KTtcblxuICAgICAgICAvLyBnZXQgY29tcGF0aWJsZSByZWFjdGl2ZSB2YWx1ZSwgaWYgYm91bmRcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJnZXRBdHRyaWJ1dGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIChrZXkpPT57XG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLl9nZXRBcnJheSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5W3RoaXMuaW5kZXhdIDogdGhpcy5fZ2V0U2VsZWN0ZWQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeTogYW55ID0gZXhpc3RzUXVlcmllcz8uZ2V0Py4odGFyZ2V0KT8uZ2V0Py4odGhpcy5zZWxlY3RvcikgPz8gc2VsZWN0ZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGVsTWFwPy5nZXQ/LihxdWVyeSk/LmdldD8uKGhhbmRsZUF0dHJpYnV0ZSk/Lmhhcz8uKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsTWFwPy5nZXQ/LihxdWVyeSk/LmdldD8uKGhhbmRsZUF0dHJpYnV0ZSk/LmdldD8uKGtleSk/LlswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkPy5nZXRBdHRyaWJ1dGU/LihrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IGF0dHJpYnV0ZVxuICAgICAgICBpZiAobmFtZSA9PSBcInNldEF0dHJpYnV0ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKGtleSwgdmFsdWUpPT57XG4gICAgICAgICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAgICAgICAvLyAtIHN1cHBvcnQgZm9yIG11bHRpcGxlIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgLy8gLSBzdXBwb3J0IGZvciBuZXdlciBlbGVtZW50cyBieSBET00gT2JzZXJ2ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2dldEFycmF5KHRhcmdldCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbdGhpcy5pbmRleF0gOiB0aGlzLl9nZXRTZWxlY3RlZCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIiAmJiAodmFsdWU/LnZhbHVlICE9IG51bGwgfHwgXCJ2YWx1ZVwiIGluIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluZFdpdGgoc2VsZWN0ZWQsIGtleSwgdmFsdWUsIGhhbmRsZUF0dHJpYnV0ZSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZD8uc2V0QXR0cmlidXRlPy4oa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcInJlbW92ZUF0dHJpYnV0ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKGtleSk9PntcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2dldEFycmF5KHRhcmdldCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbdGhpcy5pbmRleF0gOiB0aGlzLl9nZXRTZWxlY3RlZCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXJ5OiBhbnkgPSBleGlzdHNRdWVyaWVzPy5nZXQ/Lih0YXJnZXQpPy5nZXQ/Lih0aGlzLnNlbGVjdG9yKSA/PyBzZWxlY3RlZDtcbiAgICAgICAgICAgICAgICBpZiAoZWxNYXA/LmdldD8uKHF1ZXJ5KT8uZ2V0Py4oaGFuZGxlQXR0cmlidXRlKT8uaGFzPy4oa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxNYXA/LmdldD8uKHF1ZXJ5KT8uZ2V0Py4oaGFuZGxlQXR0cmlidXRlKT8uZ2V0Py4oa2V5KT8uWzFdPy4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkPy5yZW1vdmVBdHRyaWJ1dGU/LihrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJoYXNBdHRyaWJ1dGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIChrZXkpPT57XG4gICAgICAgICAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLl9nZXRBcnJheSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5W3RoaXMuaW5kZXhdIDogdGhpcy5fZ2V0U2VsZWN0ZWQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeTogYW55ID0gZXhpc3RzUXVlcmllcz8uZ2V0Py4odGFyZ2V0KT8uZ2V0Py4odGhpcy5zZWxlY3RvcikgPz8gc2VsZWN0ZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGVsTWFwPy5nZXQ/LihxdWVyeSk/LmdldD8uKGhhbmRsZUF0dHJpYnV0ZSk/Lmhhcz8uKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZD8uaGFzQXR0cmlidXRlPy4oa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvciBCTFUuRVxuICAgICAgICBpZiAobmFtZSA9PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgaWYgKGFycmF5Py5sZW5ndGggPD0gMSkgcmV0dXJuIHNlbGVjdGVkPy5lbGVtZW50ID8/IHNlbGVjdGVkO1xuICAgICAgICAgICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmQoLi4uYXJyYXkpOyByZXR1cm4gZnJhZ21lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5zZWxlY3RvciBhcyBhbnkpPy5pbmNsdWRlcz8uKFwiaW5wdXRcIikgfHwgKHRoaXMuc2VsZWN0b3IgYXMgYW55KT8ubWF0Y2hlcz8uKFwiaW5wdXRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGhpbnQpPT57XG4gICAgICAgICAgICAgICAgICAgIGlmIChoaW50ID09IFwibnVtYmVyXCIpIHJldHVybiAoc2VsZWN0ZWQ/LmVsZW1lbnQgPz8gc2VsZWN0ZWQpPy52YWx1ZUFzTnVtYmVyID8/IHBhcnNlRmxvYXQoKHNlbGVjdGVkPy5lbGVtZW50ID8/IHNlbGVjdGVkKT8udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGludCA9PSBcInN0cmluZ1wiKSByZXR1cm4gU3RyaW5nKChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk/LnZhbHVlID8/IChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGludCA9PSBcImJvb2xlYW5cIikgcmV0dXJuIChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk/LmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoc2VsZWN0ZWQ/LmVsZW1lbnQgPz8gc2VsZWN0ZWQpPy5jaGVja2VkID8/IChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk/LnZhbHVlID8/IChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG5hbWUgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5zZWxlY3RvciBhcyBhbnkpPy5pbmNsdWRlcz8uKFwiaW5wdXRcIikgfHwgKHRoaXMuc2VsZWN0b3IgYXMgYW55KT8ubWF0Y2hlcz8uKFwiaW5wdXRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHNlbGVjdGVkPy5lbGVtZW50ID8/IHNlbGVjdGVkKT8uY2hlY2tlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmIChuYW1lID09IFwidmFsdWVcIikge1xuICAgICAgICAgICAgaWYgKCh0aGlzLnNlbGVjdG9yIGFzIGFueSk/LmluY2x1ZGVzPy4oXCJpbnB1dFwiKSB8fCAodGhpcy5zZWxlY3RvciBhcyBhbnkpPy5tYXRjaGVzPy4oXCJpbnB1dFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoc2VsZWN0ZWQ/LmVsZW1lbnQgPz8gc2VsZWN0ZWQpPy52YWx1ZUFzTnVtYmVyID8/IChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk/LnZhbHVlQXNEYXRlID8/IChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk/LnZhbHVlID8/IChzZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZCk/LmNoZWNrZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYW4gYmUgc3Vic2NyaWJlZFxuICAgICAgICBpZiAobmFtZSA9PSAkYWZmZWN0ZWQpIHtcbiAgICAgICAgICAgIGlmICgodGhpcy5zZWxlY3RvciBhcyBhbnkpPy5pbmNsdWRlcz8uKFwiaW5wdXRcIikgfHwgKHRoaXMuc2VsZWN0b3IgYXMgYW55KT8ubWF0Y2hlcz8uKFwiaW5wdXRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHNlbGVjdGVkPy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXZ0OiBbYW55LCBhbnldID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgKGV2KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5fZ2V0U2VsZWN0ZWQoZXY/LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2I/LihpbnB1dD8udmFsdWUsIFwidmFsdWVcIiwgb2xkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlID0gaW5wdXQ/LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge3Bhc3NpdmU6IHRydWV9XG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCBcImNoYW5nZVwiLCAuLi5ldnQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKT0+dGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcih0YXJnZXQsIFwiY2hhbmdlXCIsIC4uLmV2dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICBpZiAobmFtZSA9PSBcImRlcmVmXCIgJiYgKHR5cGVvZiBzZWxlY3RlZCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBzZWxlY3RlZCA9PSBcImZ1bmN0aW9uXCIpICYmIHNlbGVjdGVkICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHdrID0gbmV3IFdlYWtSZWYoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgcmV0dXJuICgpPT4od2s/LmRlcmVmPy4oKT8uZWxlbWVudCA/PyB3az8uZGVyZWY/LigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcInN0cmluZ1wiICYmIC9eXFxkKyQvLnRlc3QobmFtZSkpIHsgcmV0dXJuIGFycmF5W3BhcnNlSW50KG5hbWUpXTsgfTtcblxuICAgICAgICAvL1xuICAgICAgICBjb25zdCBvcmlnaW4gPSBzZWxlY3RlZDsgLy9zZWxlY3RlZD8uZWxlbWVudCA/PyBzZWxlY3RlZDtcbiAgICAgICAgaWYgKG9yaWdpbj8uW25hbWVdICE9IG51bGwpIHsgcmV0dXJuIHR5cGVvZiBvcmlnaW5bbmFtZV0gPT0gXCJmdW5jdGlvblwiID8gb3JpZ2luW25hbWVdLmJpbmQob3JpZ2luKSA6IG9yaWdpbltuYW1lXTsgfVxuICAgICAgICBpZiAoIGFycmF5Py5bbmFtZV0gIT0gbnVsbCkgeyByZXR1cm4gdHlwZW9mICBhcnJheVtuYW1lXSA9PSBcImZ1bmN0aW9uXCIgPyAgYXJyYXlbbmFtZV0uYmluZChhcnJheSkgIDogIGFycmF5W25hbWVdOyB9XG5cbiAgICAgICAgLy8gcmVtYWlucyBwb3NzaWJsZSBnZXR0ZXJzXG4gICAgICAgIC8vcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgbmFtZSwgY3R4KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0YXJnZXQ/LltuYW1lXSA9PSBcImZ1bmN0aW9uXCIgPyB0YXJnZXQ/LltuYW1lXS5iaW5kKG9yaWdpbikgOiB0YXJnZXQ/LltuYW1lXTtcbiAgICB9XG5cbiAgICAvL1xuICAgIHNldCh0YXJnZXQ6IGFueSwgbmFtZTogYW55LCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gdGhpcy5fZ2V0QXJyYXkodGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbdGhpcy5pbmRleF0gOiB0aGlzLl9nZXRTZWxlY3RlZCh0YXJnZXQpO1xuXG4gICAgICAgIC8vXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSBcInN0cmluZ1wiICYmIC9eXFxkKyQvLnRlc3QobmFtZSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIGlmIChhcnJheVtuYW1lXSAhPSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICBpZiAoc2VsZWN0ZWQpIHsgc2VsZWN0ZWRbbmFtZV0gPSB2YWx1ZTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy9cbiAgICBoYXModGFyZ2V0OiBhbnksIG5hbWU6IGFueSkge1xuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2dldEFycmF5KHRhcmdldCk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5W3RoaXMuaW5kZXhdIDogdGhpcy5fZ2V0U2VsZWN0ZWQodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICh0eXBlb2YgbmFtZSA9PSBcInN0cmluZ1wiICYmIC9eXFxkKyQvLnRlc3QobmFtZSkgJiYgYXJyYXlbcGFyc2VJbnQobmFtZSldICE9IG51bGwpIHx8XG4gICAgICAgICAgICAoYXJyYXlbbmFtZV0gIT0gbnVsbCkgfHxcbiAgICAgICAgICAgIChzZWxlY3RlZCAmJiBuYW1lIGluIHNlbGVjdGVkKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vXG4gICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0OiBhbnksIG5hbWU6IGFueSkge1xuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2dldEFycmF5KHRhcmdldCk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5W3RoaXMuaW5kZXhdIDogdGhpcy5fZ2V0U2VsZWN0ZWQodGFyZ2V0KTtcbiAgICAgICAgaWYgKHNlbGVjdGVkICYmIG5hbWUgaW4gc2VsZWN0ZWQpIHsgZGVsZXRlIHNlbGVjdGVkW25hbWVdOyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9cbiAgICBvd25LZXlzKHRhcmdldDogYW55KSB7XG4gICAgICAgIGNvbnN0IGFycmF5ID0gdGhpcy5fZ2V0QXJyYXkodGFyZ2V0KTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbdGhpcy5pbmRleF0gOiB0aGlzLl9nZXRTZWxlY3RlZCh0YXJnZXQpO1xuICAgICAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgICAgICBhcnJheS5mb3JFYWNoKChlbCwgaSkgPT4ga2V5cy5hZGQoaS50b1N0cmluZygpKSk7XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGFycmF5KS5mb3JFYWNoKGsgPT4ga2V5cy5hZGQoaykpO1xuICAgICAgICBpZiAoc2VsZWN0ZWQpIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNlbGVjdGVkKS5mb3JFYWNoKGsgPT4ga2V5cy5hZGQoaykpO1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShrZXlzKTtcbiAgICB9XG5cbiAgICAvL1xuICAgIGRlZmluZVByb3BlcnR5KHRhcmdldDogYW55LCBuYW1lOiBhbnksIGRlc2M6IGFueSkge1xuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2dldEFycmF5KHRhcmdldCk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5W3RoaXMuaW5kZXhdIDogdGhpcy5fZ2V0U2VsZWN0ZWQodGFyZ2V0KTtcbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxlY3RlZCwgbmFtZSwgZGVzYyk7IHJldHVybiB0cnVlOyB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL1xuICAgIGFwcGx5KHRhcmdldDogYW55LCBzZWxmOiBhbnksIGFyZ3M6IGFueSkge1xuICAgICAgICBhcmdzWzBdIHx8PSB0aGlzLnNlbGVjdG9yO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0YXJnZXQ/LmFwcGx5Py4oc2VsZiwgYXJncyk7XG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSByZXN1bHQgfHwgdGhpcy5zZWxlY3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHRoaXMgYXMgUHJveHlIYW5kbGVyPGFueT4pO1xuICAgIH1cbn1cblxuLy9cbmV4cG9ydCBjb25zdCBRID0gKHNlbGVjdG9yOiBhbnksIGhvc3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGluZGV4ID0gMCwgZGlyZWN0aW9uOiBcImNoaWxkcmVuXCIgfCBcInBhcmVudFwiID0gXCJjaGlsZHJlblwiKSA9PiB7XG4gICAgLy8gaXMgd3JhcHBlZCBlbGVtZW50IG9yIGVsZW1lbnQgaXRzZWxmXG4gICAgaWYgKChzZWxlY3Rvcj8uZWxlbWVudCA/PyBzZWxlY3RvcikgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCBlbCA9IHNlbGVjdG9yPy5lbGVtZW50ID8/IHNlbGVjdG9yOyAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBhbHJlYWR5VXNlZC5nZXRPckluc2VydChlbCwgbmV3IFByb3h5KGVsLCBuZXcgVW5pdmVyc2FsRWxlbWVudEhhbmRsZXIoXCJcIiwgaW5kZXgsIGRpcmVjdGlvbikgYXMgUHJveHlIYW5kbGVyPGFueT4pKTtcbiAgICB9XG5cbiAgICAvLyBpcyBcInJlZlwiIGhvb2shXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY29uc3QgZWwgPSBzZWxlY3RvcjsgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gYWxyZWFkeVVzZWQuZ2V0T3JJbnNlcnQoZWwsIG5ldyBQcm94eShlbCwgbmV3IFVuaXZlcnNhbEVsZW1lbnRIYW5kbGVyKFwiXCIsIGluZGV4LCBkaXJlY3Rpb24pIGFzIFByb3h5SGFuZGxlcjxhbnk+KSk7XG4gICAgfVxuXG4gICAgLy9cbiAgICBpZiAoaG9zdCA9PSBudWxsIHx8IHR5cGVvZiBob3N0ID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGhvc3QgPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaG9zdCA9PSBcImJvb2xlYW5cIiB8fCB0eXBlb2YgaG9zdCA9PSBcInN5bWJvbFwiIHx8IHR5cGVvZiBob3N0ID09IFwidW5kZWZpbmVkXCIpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAoZXhpc3RzUXVlcmllcz8uZ2V0Py4oaG9zdCk/Lmhhcz8uKHNlbGVjdG9yKSkgeyByZXR1cm4gZXhpc3RzUXVlcmllcz8uZ2V0Py4oaG9zdCk/LmdldD8uKHNlbGVjdG9yKTsgfVxuXG4gICAgLy8gQHRzLWlnbm9yZSAvLyBpcyBzZWxlY3RvciBieSBob3N0XG4gICAgcmV0dXJuIGV4aXN0c1F1ZXJpZXM/LmdldE9ySW5zZXJ0Py4oaG9zdCwgbmV3IE1hcCgpKT8uZ2V0T3JJbnNlcnRDb21wdXRlZD8uKHNlbGVjdG9yLCAoKT0+e1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KGhvc3QsIG5ldyBVbml2ZXJzYWxFbGVtZW50SGFuZGxlcihzZWxlY3RvciwgaW5kZXgsIGRpcmVjdGlvbikgYXMgUHJveHlIYW5kbGVyPGFueT4pO1xuICAgIH0pO1xufVxuXG4vLyBzeW50YXg6XG4vLyAtIFtuYW1lXTogKGN0eCkgPT4gZnVuY3Rpb24oKSB7fVxuZXhwb3J0IGNvbnN0IGV4dGVuZFF1ZXJ5UHJvdG90eXBlID0gKGV4dGVuZGVkOiBhbnkgPSB7fSk9PnsgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHF1ZXJ5RXh0ZW5zaW9ucywgZXh0ZW5kZWQpO1xufVxuXG4vL1xuZXhwb3J0IGRlZmF1bHQgUTtcbiJdfQ==