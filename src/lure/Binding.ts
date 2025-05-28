// @ts-ignore /* @vite-ignore */
import { makeReactive, subscribe, ref } from "/externals/modules/object.js";

// @ts-ignore /* @vite-ignore */
import { observeAttributeBySelector, namedStoreMaps, boundBehaviors, setStyleProperty } from "/externals/modules/dom.js";

// reacts by change storage, loads from storage, and reacts from storage event changes
export const localStorageRef = (key, initial?: any)=>{
    const ref = makeReactive({value: localStorage.getItem(key) ?? (initial?.value ?? initial)});
    addEventListener("storage", (ev)=>{
        if (ev.storageArea == localStorage && ev.key == key) {
            if (ref.value !== ev.newValue) { ref.value = ev.newValue; };
        }
    });
    subscribe([ref, "value"], (val)=>{
        localStorage.setItem(key, val);
    });
    return ref;
}

// reacts only from media, you can't change media condition
export const matchMediaRef = (condition: string)=>{
    const med = matchMedia(condition);
    const ref = makeReactive({value: med.matches});
    med.addEventListener("change", (ev)=>{
        ref.value = ev.matches;
    });
    return ref;
}

// one-shot update
export const visibleRef = (element, initial?: any)=>{
    // bi-directional attribute
    const val = makeReactive({ value: (initial?.value ?? initial) ?? (element?.getAttribute?.("data-hidden") == null) });
    if ((initial?.value ?? initial) != null && element?.getAttribute?.("data-hidden") == null) { if (initial?.value ?? initial) { element?.removeAttribute?.("data-hidden"); } else { element?.setAttribute?.("data-hidden", val.value); } };

    //
    element?.addEventListener?.("u2-hidden", ()=>{ val.value = false; }, {passive: true});
    element?.addEventListener?.("u2-visible", ()=>{ val.value = true; }, {passive: true});
    subscribe([val, "value"], (v,p)=>{if (v) { element?.removeAttribute?.("data-hidden"); } else { element?.setAttribute?.("data-hidden", val.value); }})
    return val;
}

// one-shot update
export const attrRef = (element, attribute: string, initial?: any)=>{
    // bi-directional attribute
    const val = makeReactive({ value: element?.getAttribute?.(attribute) ?? ((initial?.value ?? initial) === true && typeof initial == "boolean" ? "" : (initial?.value ?? initial)) });
    if (initial != null && element?.getAttribute?.(attribute) == null && (typeof val.value != "object" && typeof val.value != "function") && (val.value != null && val.value !== false)) { element?.setAttribute?.(attribute, val.value); };
    const config = {
        attributeFilter: [attribute],
        attributeOldValue: true,
        attributes: true,
        childList: false,
        subtree: false,
    };

    //
    const onMutation = (mutation: any)=>{
        if (mutation.type == "attributes") {
            const value = mutation?.target?.getAttribute?.(mutation.attributeName);
            if (mutation.oldValue != value && (val != null && (val?.value != null || (typeof val == "object" || typeof val == "function")))) {
                if (val?.value !== value) { val.value = value; }
            }
        }
    }

    //
    if (element?.self) {
        observeAttributeBySelector(element.self, element.selector, attribute, onMutation);
    } else {
        const callback = (mutationList, _) => { for (const mutation of mutationList) { onMutation(mutation); } };
        const observer = new MutationObserver(callback);
        if (element instanceof HTMLElement) { observer.observe(element, config); }
    }

    //
    subscribe([val, "value"], (v)=>{
        if (v !== element?.getAttribute?.(attribute)) {
            if (v == null || v === false || typeof v == "object" || typeof v == "function") {
                element?.removeAttribute?.(attribute);
            } else {
                element?.setAttribute?.(attribute, v);
            }
        }
    });

    //
    return val;
}

// ! you can't change size, due it's may break styles
export const sizeRef = (element, axis: "inline"|"block", box: ResizeObserverBoxOptions = "border-box")=>{
    const val = makeReactive({ value: 0 });
    const obs = new ResizeObserver((entries)=>{
        if (box == "border-box") { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize : entries[0].borderBoxSize[0].blockSize };
        if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
        if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
    });
    if ((element?.self ?? element) instanceof HTMLElement) { obs.observe(element?.self ?? element, {box}); };
    return val;
}

//
export const scrollRef = (element, axis: "inline"|"block", initial?: any)=>{
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis=="inline"?"left":"top"]: (initial?.value ?? initial) }); };
    const val = makeReactive({ value: (axis == "inline" ? element?.scrollLeft : element?.scrollTop) || 0 });
    subscribe([val, "value"], ()=>element?.scrollTo?.({ [axis=="inline"?"left":"top"]: (val?.value ?? val) }));
    element?.addEventListener?.("scroll", (ev)=>{ val.value = (axis == "inline" ? ev?.target?.scrollLeft : ev?.target?.scrollTop) || 0; }, { passive: true });
    return val;
}

// for checkbox
export const checkedRef = (element)=>{
    const val = makeReactive({ value: (!!element?.checked) || false });
    if (element?.self ?? element) {
        (element?.self ?? element)?.addEventListener?.("change", (ev)=>{ if (val.value != ev?.target?.checked) { val.value = (!!ev?.target?.checked) || false; } });
        (element?.self ?? element)?.addEventListener?.("input", (ev)=>{ if (val.value != ev?.target?.checked) { val.value = (!!ev?.target?.checked) || false; } });
        (element?.self ?? element)?.addEventListener?.("click", (ev)=>{ if (val.value != ev?.target?.checked) { val.value = (!!ev?.target?.checked) || false; } });
    }
    subscribe([val, "value"], (v)=>{
        if (element && element?.checked != v) {
            element.checked = !!v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    })
    return val;
}

// for string inputs
export const valueRef = (element)=>{
    const val = makeReactive({ value: element?.value || "" });
    (element?.self ?? element)?.addEventListener?.("change", (ev) => { if (val.value != ev?.target?.value) { val.value = ev?.target?.value; } });
    subscribe([val, "value"], (v)=>{
        if (element && element?.value != v) {
            element.value = v;
            element?.dispatchEvent?.(new Event("change", {
                bubbles: true
            }));
        }
    })
    return val;
}

// for numeric inputs
export const valueAsNumberRef = (element)=>{
    const val = makeReactive({ value: Number(element?.valueAsNumber) || 0 });
    (element?.self ?? element)?.addEventListener?.("change", (ev)=>{
        if (val.value != ev?.target?.valueAsNumber) { val.value = Number(ev?.target?.valueAsNumber); }
    });
    subscribe([val, "value"], (v)=>{
        if (element && element?.valueAsNumber != v && typeof element?.valueAsNumber == "number") {
            element.valueAsNumber = Number(v);
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    })
    return val;
}



//
export const bindBeh = (element, store, behavior) => {
    const weak = element instanceof WeakRef ? element : new WeakRef(element);
    const [name, obj] = store;
    if (behavior) {
        subscribe?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(weak.deref?.())]);
        });
    }
    return element;
};

//
export const refCtl = (value) => {
    let self: any = null;
    let ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap]) => {
        boundBehaviors?.get?.(weak?.deref?.())?.values?.()?.forEach?.((beh) => {
            (beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap]);
        });
    });
    return ctl;
};

// for checkbox
export const checkboxCtrl = (ref)=>{
    return (ev)=>{ if (ref) { ref.value = ev?.target?.checked ?? !ref.value; } }
}

// form.addEventListener("change")
export const radioCtrl = (ref, name)=>{
    return (ev)=>{
        const selector = `input[name="${name}"]:checked`;
        ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? ref.value;
    }
}

// "change" | "input" | "click"
export const numberCtrl = (ref)=>{
    return (ev)=>{
        if (ref) { ref.value = ev?.target?.valueAsNumber ?? !ref.value; }
    }
}

// "change" | "input" | "click"
export const valueCtrl = (ref)=>{
    return (ev)=>{
        if (ref) { ref.value = ev?.target?.value ?? !ref.value; }
    }
}

//
export const bindCtrl = (element, ctrl)=>{
    ctrl?.({target: element});
    element?.addEventListener?.("click", ctrl);
    element?.addEventListener?.("input", ctrl);
    element?.addEventListener?.("change", ctrl);
    const cancel = ()=>{
        element?.removeEventListener?.("click", ctrl);
        element?.removeEventListener?.("input", ctrl);
        element?.removeEventListener?.("change", ctrl);
    }
    return cancel;
}

// TODO: make able to cancel controlling
export const reflectControllers = (element, ctrls)=>{
    for (let ctrl of ctrls) { bindCtrl(element, ctrl); }
    return element;
}

// TODO: currently, there is no visable usage
export const OOBTrigger = (element, ref, selector?)=>{
    const ROOT = document.documentElement;
    const checker = (ev)=>{
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { ref.value = false; }
    }
    const cancel = ()=>{ ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
}

//
export const observeSize = (element, box, styles?) => {
    if (!styles) styles = makeReactive({});
    new ResizeObserver((mut)=>{
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
    }).observe(element?.element ?? element, {box});
    return styles;
}



//
export const deleteStyleProperty = (element, name)=>{ element.style.removeProperty(camelToKebab(name)); }
export const camelToKebab = (str) => { return str?.replace?.(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
export const kebabToCamel = (str) => { return str?.replace?.(/-([a-z])/g, (_, char) => char.toUpperCase()); }

//
export const handleDataset = (element, prop, value)=>{
    if (!prop) return; prop = kebabToCamel(prop) || prop;
    if (element.dataset[prop] !== value) {
        if (typeof value == "undefined" || value == null || value === false) { delete element.dataset[prop]; } else
        if (typeof value != "object" && typeof value != "function") { element.dataset[prop] = value; } else
        if (value?.value != null && value?.value !== false && (typeof value?.value != "object" && typeof value?.value != "function"))
            { element.dataset[prop] = value.value; } else // any invalid type is deleted value
            { delete element.dataset[prop]; if (value?.value !== false) console.warn(`Invalid type of attribute value "${prop}":`, value); }
    }
}

//
export const handleStyleChange = (element, prop, value)=>{
    if (!prop || typeof prop != "string") return;
    if (typeof value == "undefined" || value == null) { deleteStyleProperty(element, prop); } else // non-object, except Typed OM
    if ((typeof value != "object" && typeof value != "function") || value instanceof CSSStyleValue)
        { setStyleProperty(element, prop, value); } else
    if (value?.value != null && (typeof value.value != "object" && typeof value.value != "function"))
        { setStyleProperty(element, prop, value.value); } else // any invalid type is deleted value
        { deleteStyleProperty(element, prop); if (value?.value !== false) console.warn(`Invalid value for style property "${prop}":`, value); }
}

//
export const handleAttribute = (element, prop, value)=>{
    if (!prop) return; prop = camelToKebab(prop) || prop;
    if (element.getAttribute(prop) !== value) {
        if (typeof value == "undefined" || value == null || value === false) { element.removeAttribute(prop); } else
        if (typeof value != "object" && typeof value != "function") { element.setAttribute(prop, value); } else
        if (value?.value != null && value?.value !== false && (typeof value?.value != "object" && typeof value?.value != "function"))
            { element.setAttribute(prop, value.value); } else  // any invalid type is deleted value
            { element.removeAttribute(prop); if (value?.value !== false) console.warn(`Invalid type of attribute value "${prop}":`, value); }
    }
}
