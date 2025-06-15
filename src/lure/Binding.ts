import { makeReactive, subscribe, ref, numberRef, stringRef, booleanRef, computed } from "u2re/object";
import { observeAttributeBySelector, namedStoreMaps, boundBehaviors } from "u2re/dom";

/**
 * Symbol for mapped state
 * @type {unique symbol}
 */
export const $mapped = Symbol.for("@mapped");

/**
 * Symbol for virtual state
 * @type {unique symbol}
 */
export const $virtual = Symbol.for("@virtual");

/**
 * Symbol for behavior marker
 * @type {unique symbol}
 */
export const $behavior = Symbol.for("@behavior");

/**
 * Make a two-way <-> ref to a localStorage string value, auto-update on change and storage events
 * @template T
 * @param {string} key storage key
 * @param {T|{value:T}} [initial] initial value (used/converted to string if not there)
 * @returns {ReturnType<typeof stringRef>}
 */
export const localStorageRef = (key, initial) => {
    const ref = stringRef(localStorage.getItem(key) ?? (initial?.value ?? initial));
    subscribe([ref, "value"], (val) => localStorage.setItem(key, val));
    addEventListener("storage", (ev) => {
        if (ev.storageArea == localStorage && ev.key == key) {
            if (ref.value !== ev.newValue) { ref.value = ev.newValue; };
        }
    });
    return ref;
}

/**
 * Create a booleanRef that reflects matchMedia state. You cannot write to it.
 * @param {string} condition CSS media query string
 * @returns {ReturnType<typeof booleanRef>}
 */
export const matchMediaRef = (condition: string) => {
    const med = matchMedia(condition), ref = booleanRef(med.matches);
    med?.addEventListener?.("change", (ev) => ref.value = ev.matches); return ref;
}

/**
 * Create a booleanRef for an element's "data-hidden" visible state, one-way
 * @param {Element} element
 * @param {*} [initial]
 * @returns {ReturnType<typeof booleanRef>}
 */
export const visibleRef = (element, initial?) => {
    const val = booleanRef((initial?.value ?? initial) ?? (element?.getAttribute?.("data-hidden") == null));
    if ((initial?.value ?? initial) != null && element?.getAttribute?.("data-hidden") == null) { if (initial?.value ?? initial) { element?.removeAttribute?.("data-hidden"); } else { element?.setAttribute?.("data-hidden", val.value); } };

    element?.addEventListener?.("u2-hidden", () => { val.value = false; }, { passive: true });
    element?.addEventListener?.("u2-visible", () => { val.value = true; }, { passive: true });
    subscribe([val, "value"], (v, p) => { if (v) { element?.removeAttribute?.("data-hidden"); } else { element?.setAttribute?.("data-hidden", val.value); } })
    return val;
}

/**
 * Attribute two-way binding
 * @template T
 * @param {Element} element
 * @param {string} attribute
 * @param {T|{value:T}} [initial]
 * @returns {ReturnType<typeof stringRef>}
 */
export const attrRef = (element, attribute: string, initial?) => {
    if (!element) return;
    const val = stringRef(element?.getAttribute?.(attribute) ?? ((initial?.value ?? initial) === true && typeof initial == "boolean" ? "" : (initial?.value ?? initial)));
    if (initial != null && element?.getAttribute?.(attribute) == null && (typeof val.value != "object" && typeof val.value != "function") && (val.value != null && val.value !== false)) { element?.setAttribute?.(attribute, val.value); };
    const config = {
        attributeFilter: [attribute],
        attributeOldValue: true,
        attributes: true,
        childList: false,
        subtree: false,
    };

    const onMutation = (mutation: any) => {
        if (mutation.type == "attributes") {
            const value = mutation?.target?.getAttribute?.(mutation.attributeName);
            if (mutation.oldValue != value && (val != null && (val?.value != null || (typeof val == "object" || typeof val == "function")))) {
                if (val?.value !== value) { val.value = value; }
            }
        }
    }

    if (element?.self) { observeAttributeBySelector(element.self, element.selector, attribute, onMutation); } else {
        const callback = (mutationList, _) => { for (const mutation of mutationList) { onMutation(mutation); } };
        const observer = new MutationObserver(callback); observer.observe(element?.element ?? element?.self ?? element, config);
    }

    subscribe([val, "value"], (v) => {
        if (v !== element?.getAttribute?.(attribute)) {
            if (v == null || v === false || typeof v == "object" || typeof v == "function") { element?.removeAttribute?.(attribute); } else { element?.setAttribute?.(attribute, v); }
        }
    });

    return val;
}

/**
 * Numeric ref of the element size (inline/block, observed with ResizeObserver)
 * @param {Element} element
 * @param {"inline"|"block"} axis
 * @param {ResizeObserverBoxOptions} [box='border-box']
 * @returns {ReturnType<typeof numberRef>}
 */
export const sizeRef = (element, axis: "inline" | "block", box: ResizeObserverBoxOptions = "border-box") => {
    const val = numberRef(0), obs = new ResizeObserver((entries) => {
        if (box == "border-box") { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize : entries[0].borderBoxSize[0].blockSize };
        if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
        if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
    });
    if ((element?.self ?? element) instanceof HTMLElement) { obs.observe(element?.element ?? element?.self ?? element, { box }); }; return val;
}

/**
 * Numeric ref for scroll offset of an element (auto two-way)
 * @param {Element} element
 * @param {"inline"|"block"} axis
 * @param {*} [initial]
 * @returns {ReturnType<typeof numberRef>}
 */
export const scrollRef = (element, axis: "inline" | "block", initial?) => {
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis == "inline" ? "left" : "top"]: (initial?.value ?? initial) }); };
    const val = numberRef((axis == "inline" ? element?.scrollLeft : element?.scrollTop) || 0);
    subscribe([val, "value"], () => element?.scrollTo?.({ [axis == "inline" ? "left" : "top"]: (val?.value ?? val) }));
    element?.addEventListener?.("scroll", (ev) => { val.value = (axis == "inline" ? ev?.target?.scrollLeft : ev?.target?.scrollTop) || 0; }, { passive: true });
    return val;
}

/**
 * Boolean ref for checkbox element (auto two-way)
 * @param {HTMLInputElement} element
 * @returns {ReturnType<typeof booleanRef>}
 */
export const checkedRef = (element) => {
    const val = booleanRef((!!element?.checked) || false);
    if (element?.self ?? element) {
        (element?.self ?? element)?.addEventListener?.("change", (ev) => { if (val.value != ev?.target?.checked) { val.value = (!!ev?.target?.checked) || false; } });
        (element?.self ?? element)?.addEventListener?.("input", (ev) => { if (val.value != ev?.target?.checked) { val.value = (!!ev?.target?.checked) || false; } });
        (element?.self ?? element)?.addEventListener?.("click", (ev) => { if (val.value != ev?.target?.checked) { val.value = (!!ev?.target?.checked) || false; } });
    }
    subscribe([val, "value"], (v) => {
        if (element && element?.checked != v) {
            element.checked = !!v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    }); return val;
}

/**
 * String ref for text input elements (auto two-way)
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @returns {ReturnType<typeof stringRef>}
 */
export const valueRef = (element) => {
    const val = stringRef(element?.value || "");
    (element?.self ?? element)?.addEventListener?.("change", (ev) => { if (val.value != ev?.target?.value) { val.value = ev?.target?.value; } });
    subscribe([val, "value"], (v) => {
        if (element && element?.value != v) {
            element.value = v;
            element?.dispatchEvent?.(new Event("change", {
                bubbles: true
            }));
        }
    }); return val;
}

/**
 * Number ref for number inputs (auto two-way)
 * @param {HTMLInputElement} element
 * @returns {ReturnType<typeof numberRef>}
 */
export const valueAsNumberRef = (element) => {
    const val = numberRef(Number(element?.valueAsNumber) || 0);
    (element?.self ?? element)?.addEventListener?.("change", (ev) => { if (val.value != ev?.target?.valueAsNumber) { val.value = Number(ev?.target?.valueAsNumber); } });
    subscribe([val, "value"], (v) => {
        if (element && element?.valueAsNumber != v && typeof element?.valueAsNumber == "number") {
            element.valueAsNumber = Number(v);
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    }); return val;
}

/**
 * Bind reactive behavior to an element given a store and behavior function
 * @param {Element} element
 * @param {[string, any]} store [name, object]
 * @param {(event: any, context: [WeakRef<Element>, [string,any], any])=>void} behavior
 * @returns {Element}
 */
export const bindBeh = (element, store, behavior) => {
    const weak = element instanceof WeakRef ? element : new WeakRef(element), [name, obj] = store;
    if (behavior) {
        subscribe?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(weak.deref?.())]);
        });
    }; return element;
}

/**
 * Create a controller ref which fires all boundBehaviors except self on change
 * @param {*} value
 * @returns {any}
 */
export const refCtl = (value) => {
    let self: any = null, ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap]) => boundBehaviors?.get?.(weak?.deref?.())?.values?.()?.forEach?.((beh) => {
        (beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap]);
    })); return ctl;
}

/**
 * DOM checkbox "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof booleanRef>} ref
 * @returns {(ev: Event) => void}
 */
export const checkboxCtrl = (ref) => { return (ev) => { if (ref) { ref.value = ev?.target?.checked ?? !ref.value; } } }

/**
 * DOM number input "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof numberRef>} ref
 * @returns {(ev: Event) => void}
 */
export const numberCtrl = (ref) => { return (ev) => { if (ref) { ref.value = ev?.target?.valueAsNumber ?? !ref.value; } } }

/**
 * DOM value input "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof stringRef>} ref
 * @returns {(ev: Event) => void}
 */
export const valueCtrl = (ref) => { return (ev) => { if (ref) { ref.value = ev?.target?.value ?? !ref.value; } } }

/**
 * DOM radio group "controller" handler for use with bindCtrl
 * @param {ReturnType<typeof stringRef>} ref
 * @param {string} name
 * @returns {(ev: Event) => void}
 */
export const radioCtrl = (ref, name) => {
    return (ev) => {
        const selector = `input[name="${name}"]:checked`;
        ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? ref.value;
    }
}

/**
 * Bind event controller (checkboxCtrl, valueCtrl etc) to element and set initial value.
 * Returns a cancel function.
 * @param {Element} element
 * @param {(ev: Event) => void} ctrl
 * @returns {()=>void} cancel function
 */
export const bindCtrl = (element, ctrl) => {
    ctrl?.({ target: element });
    element?.addEventListener?.("click", ctrl);
    element?.addEventListener?.("input", ctrl);
    element?.addEventListener?.("change", ctrl);
    return () => {
        element?.removeEventListener?.("click", ctrl);
        element?.removeEventListener?.("input", ctrl);
        element?.removeEventListener?.("change", ctrl);
    };
}

/**
 * Out-of-bounds trigger (fires ref.value = false if clicked outside)
 * @param {Element} element
 * @param {ReturnType<typeof booleanRef>|{value: boolean}} ref
 * @param {string} [selector] optional CSS selector for target
 * @returns {()=>void} cancel function
 */
export const OOBTrigger = (element, ref, selector?) => {
    const ROOT = document.documentElement;
    const checker = (ev) => {
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { ref.value = false; }
    }
    const cancel = () => { ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
}

/**
 * Reflect multiple event ctrls on an element (does not support cancel)
 * @param {Element} element
 * @param {Array<Function>} ctrls
 * @returns {Element}
 */
export const reflectControllers = (element, ctrls) => { for (let ctrl of ctrls) { bindCtrl(element, ctrl); }; return element; }

/**
 * Observe and reactively assign size styles to a reactive object
 * @param {Element} element
 * @param {ResizeObserverBoxOptions} box
 * @param {object} [styles] reactive object (will be created if omitted)
 * @returns {object} styles
 */
export const observeSize = (element, box, styles?) => {
    if (!styles) styles = makeReactive({});
    new ResizeObserver((mut) => {
        if (box == "border-box") {
            styles.inlineSize = `${mut[0].borderBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].borderBoxSize[0].blockSize}px`;
        }
        if (box == "content-box") {
            styles.inlineSize = `${mut[0].contentBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].contentBoxSize[0].blockSize}px`;
        }
        if (box == "device-pixel-content-box") {
            styles.inlineSize = `${mut[0].devicePixelContentBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].devicePixelContentBoxSize[0].blockSize}px`;
        }
    }).observe(element?.element ?? element?.self ?? element, { box });
    return styles;
}

/**
 * Bind reactive style/prop handler for a ref to an element property, using an optional set WeakRef
 * @param {WeakRef<Element>} el
 * @param {any} value ref object
 * @param {string} prop property name
 * @param {Function} handler handler function
 * @param {WeakRef<any>} [set]
 */
export const bindHandler = (el: any, value: any, prop: any, handler: any, set?: any) => {
    if (value?.value == null || value instanceof CSSStyleValue) return;
    let controller: AbortController | null = null; // @ts-ignore
    controller?.abort?.(); controller = new AbortController();

    const wv = new WeakRef(value);
    subscribe([value, "value"], (curr, _, old) => {
        if (set?.deref?.()?.style?.[prop] === wv?.deref?.() || !(set?.deref?.())) {
            if (typeof wv?.deref?.()?.[$behavior] == "function") {
                wv?.deref?.()?.[$behavior]?.((val = curr) => handler(el?.deref?.(), prop, wv?.deref?.()?.value ?? val), [curr, prop, old], [controller?.signal, prop, el]);
            } else {
                handler(el?.deref?.(), prop, curr);
            }
        }
    });
}

/**
 * Starts/stops a requestAnimationFrame async scheduler loop.
 * All scheduled cbs will be run after each rAF.
 * @returns {{
 *     canceled: boolean,
 *     rAFs: Set<Function>,
 *     last: any,
 *     cancel: () => any,
 *     shedule: (cb: Function) => any
 * }}
 */
export const makeRAFCycle = () => {
    const control: any = {
        canceled: false,
        rAFs: new Set<any>(),
        last: null,
        cancel() { this.canceled = true; cancelAnimationFrame(this.last); return this; },
        shedule(cb: any) { this.rAFs.add(cb); return this; }
    };
    (async () => {
        while (!control?.canceled) { // @ts-ignore
            await Promise.all((control?.rAFs?.values?.() ?? [])?.map?.((rAF) => Promise.try(rAF)?.catch?.(console.warn.bind(console)))); control.rAFs?.clear?.();
            await new Promise((res) => { control.last = requestAnimationFrame(res); });
        }
    })();
    return control;
}

/**
 * Produces a "rAF behavior" callback, which defers calls via requestAnimationFrame cycle
 * @param {Function} cb function to call
 * @param {ReturnType<typeof makeRAFCycle>} [shed]
 * @returns {Function}
 */
export const RAFBehavior = (cb, shed = makeRAFCycle()) => {
    return (...args) => { return shed.shedule(() => cb?.(...args)); }
}

// TODO: support for `computed` from wrapped arrays
export const conditionalIndex = (condList: any[]) => {
    const comp = computed(condList, () => condList.findIndex(cb => cb?.()));
    return comp;
}
