import { boundBehaviors, getCorrectOrientation, orientationNumberMap, whenAnyScreenChanges, handleHidden, handleAttribute, getPadding, addEvent } from "fest/dom";
import { observe, booleanRef, numberRef, affected, stringRef, ref, $triggerControl } from "fest/object";
import { isNotEqual, isValueRef, $avoidTrigger, isObject, getValue, isPrimitive, normalizePrimitive, $getValue, deref, hasValue } from "fest/core";
import { setChecked } from "fest/dom";
import { getIgnoreNextPopState, setIgnoreNextPopState } from "../../interactive/tasking/BackNavigation";
import { keyType } from "fest/core";

//
export const localStorageLinkMap = new Map<string, any>();

type Cleanup = (() => void) | { disconnect?: () => void } | { unsubscribe?: () => void } | void;
type LinkContext<T = any> = {
    source: any;
    ref: any;
    linker: Linker<T>;
    forProp: string;
    event?: any;
    reason?: "initial" | "source" | "ref" | "manual";
};
export type LinkGetter<T = any> = (ctx: LinkContext<T>) => T;
export type LinkSetter<T = any> = (value: T, ctx: LinkContext<T>) => void;
export type LinkStore<T = any> = (value: T, ctx: LinkContext<T>) => any;
export type LinkTrigger<T = any> = (ctx: LinkContext<T> & { commit: (event?: any, forProp?: string) => any }) => Cleanup;

export interface LinkOptions<T = any> {
    source?: any | ((source?: any) => any);
    ref?: any;
    getter?: LinkGetter<T>;
    setter?: LinkSetter<T>;
    trigger?: LinkTrigger<T>;
    store?: LinkStore<T>;
    forProp?: string;
    affectTypes?: string[];
    triggerImmediately?: boolean;
    bindImmediately?: boolean;
}

export interface Linker<T = any> {
    source: any;
    ref: any;
    forProp: string;
    get(event?: any, forProp?: string): T;
    set(value: T, event?: any, forProp?: string): void;
    store(value: T, event?: any, forProp?: string): any;
    trigger(event?: any, forProp?: string): any;
    bind(): Linker<T>;
    unbind(): void;
    [Symbol.dispose](): void;
}

const cleanupOf = (cleanup: Cleanup) => {
    if (!cleanup) return;
    if (typeof cleanup == "function") return cleanup;
    const target = cleanup as any;
    if (typeof target?.disconnect == "function") return () => target.disconnect?.();
    if (typeof target?.unsubscribe == "function") return () => target.unsubscribe?.();
}

const runWithoutSetterTrigger = (target: any, cb: () => any) => {
    const control = target?.[$triggerControl];
    if (typeof control?.without == "function") return control.without(["setter", "set"], cb);
    return $avoidTrigger(target, cb);
}

const setRefValue = (target: any, value: any, forProp = "value") => {
    if (!target || !(typeof target == "object" || typeof target == "function")) return value;
    if (isNotEqual(target[forProp], value)) {
        return runWithoutSetterTrigger(target, () => { target[forProp] = value; });
    }
    return value;
}

const selectSourceInput = (source: any, event: any, selector = "input") => {
    const target = event?.target ?? source;
    if (target?.matches?.(selector)) return target;
    return target?.querySelector?.(selector) ?? source;
}

const radioScopeOf = (source: any) => {
    return source?.matches?.('input[type="radio"]') ? (source?.form ?? source?.parentNode ?? source) : source;
}

const radioNameOf = (source: any, name?: string | null) => {
    if (name) return name;
    if (source?.type == "radio" && source?.name) return source.name;
    return source?.querySelector?.('input[type="radio"]:checked')?.name ?? source?.querySelector?.('input[type="radio"]')?.name ?? "";
}

const radioSelectorOf = (name?: string | null) => `input[type="radio"]${name ? `[name="${(globalThis as any).CSS?.escape?.(name) ?? name}"]` : ""}`;

const radioCheckedIn = (source: any, name?: string | null) => {
    const scope = radioScopeOf(source);
    if (source?.type == "radio" && (!name || source.name == name) && source.checked) return source;
    return scope?.querySelector?.(`${radioSelectorOf(name)}:checked`) ?? null;
}

const radioByValueIn = (source: any, value: any, name?: string | null) => {
    const scope = radioScopeOf(source);
    const radios = [...(scope?.querySelectorAll?.(radioSelectorOf(name)) ?? (source?.type == "radio" ? [source] : []))];
    return radios.find((radio: any) => radio?.value == value) ?? null;
}

export const eventTrigger = (events: string | string[], options?: AddEventListenerOptions): LinkTrigger => {
    const eventList = Array.isArray(events) ? events : [events];
    return ({ source, commit }) => {
        const target = source?.element ?? source?.self ?? source;
        if (!target?.addEventListener) return;
        const listener = (event: any) => commit(event);
        eventList.forEach((name) => target.addEventListener(name, listener, options));
        return () => eventList.forEach((name) => target.removeEventListener?.(name, listener, options));
    };
}

export const mutationTrigger = (attribute?: string): LinkTrigger => {
    return ({ source, commit }) => {
        const target = source?.element ?? source?.self ?? source;
        if (!target || typeof MutationObserver == "undefined") return;
        const observer = new MutationObserver((records) => {
            if (!attribute || records.some((record) => record.type == "attributes" && record.attributeName == attribute)) {
                commit(records);
            }
        });
        observer.observe(target, { attributes: true, attributeFilter: attribute ? [attribute] : undefined });
        return () => observer.disconnect();
    };
}

export const resizeTrigger = (box?: ResizeObserverBoxOptions): LinkTrigger => {
    return ({ source, commit }) => {
        const target = source?.element ?? source?.self ?? source;
        if (!target || typeof ResizeObserver == "undefined") return;
        const observer = new ResizeObserver((entries) => commit(entries));
        observer.observe(target, { box });
        return () => observer.disconnect();
    };
}

export const makeLinker = <T = any>(options: LinkOptions<T>): Linker<T> => {
    const source = typeof options.source == "function" ? options.source() : options.source;
    const defaultForProp = options.forProp ?? "value";
    const linker = {
        source,
        ref: options.ref,
        forProp: defaultForProp,
        get(event?: any, forProp = defaultForProp) {
            return options.getter?.({ source, ref: linker.ref, linker, forProp, event, reason: event ? "source" : "manual" }) as T;
        },
        set(value: T, event?: any, forProp = defaultForProp) {
            return options.setter?.(value, { source, ref: linker.ref, linker, forProp, event, reason: "ref" });
        },
        store(value: T, event?: any, forProp = defaultForProp) {
            const ctx = { source, ref: linker.ref, linker, forProp, event, reason: "source" as const };
            return options.store ? options.store(value, ctx) : setRefValue(linker.ref, value, forProp);
        },
        trigger(event?: any, forProp = defaultForProp) {
            const value = linker.get(event, forProp);
            return linker.store(value, event, forProp);
        },
        bind() {
            linker.unbind();
            if (options.bindImmediately) linker.trigger();
            const triggerCleanup = cleanupOf(options.trigger?.({
                source,
                ref: linker.ref,
                linker,
                forProp: defaultForProp,
                reason: "initial",
                commit: (event?: any, forProp = defaultForProp) => linker.trigger(event, forProp),
            }));
            const setterCleanup = linker.ref && options.setter ? affected([linker.ref, defaultForProp], (value) => {
                linker.set(value, undefined, defaultForProp);
            }, {
                affectTypes: options.affectTypes ?? ["setter", "manual"],
                triggerImmediately: options.triggerImmediately ?? true,
            }) : null;
            linker.__cleanup = () => {
                triggerCleanup?.();
                setterCleanup?.();
            };
            return linker;
        },
        unbind() {
            linker.__cleanup?.();
            linker.__cleanup = null;
        },
        [Symbol.dispose]() {
            linker.unbind();
        },
        __cleanup: null as null | (() => void),
    } as Linker<T> & { __cleanup: null | (() => void) };
    return linker;
}
export const localStorageLink = (existsStorage?: any|null, exists?: any|null, key?: string, initial?: any|null) => {
    if (key == null) return;
    // de-assign local storage link for key
    if (localStorageLinkMap.has(key)) {
        localStorageLinkMap.get(key)?.[0]?.();
        localStorageLinkMap.delete(key);
    }

    // @ts-ignore // assign new local storage link for key
    return localStorageLinkMap.getOrInsertComputed?.(key, ()=>{
        const def  = (existsStorage ?? localStorage).getItem(key) ?? (initial?.value ?? initial);
        const ref = isValueRef(exists) ? exists : stringRef(def); /*if (typeof ref == "object" || typeof ref == "function")*/ ref.value ??= def;
        const $val = new WeakRef(ref);
        const unsb = affected([ref, "value"], (val) => {
            $avoidTrigger($val?.deref?.(), ()=>{
                (existsStorage ?? localStorage).setItem(key, val);
            });
        });
        const list = (ev: { storageArea: any; key: string; newValue: any; }) => { if (ev.storageArea == (existsStorage ?? localStorage) && ev.key == key) {
            if (isNotEqual(ref.value, ev.newValue)) { ref.value = ev.newValue; };
        } };
        addEventListener("storage", list as unknown as EventListener);
        return [() => { unsb?.(); removeEventListener("storage", list as unknown as EventListener); }, ref];
    });
}

//
const normalizeHash = (hash: string | null, withHashCharacter: boolean = true) => {
    if (hash == null) return (withHashCharacter ? "#" : "");
    if (!withHashCharacter && hash?.startsWith?.("#")) { return (hash?.replace?.("#", "") || ""); };
    if (withHashCharacter && !hash?.startsWith?.("#")) { return `#${hash || ""}`; };
    return (withHashCharacter ? (hash?.startsWith?.("#") ? hash : `#${hash || ""}`) : hash?.replace?.("#", "")) || "";
}

//
export const hashTargetLink = (_?: any|null, exists?: any|null, initial?: any|null, withHashCharacter: boolean = false)=>{
    const locationHash = normalizeHash(normalizeHash(location?.hash || "", false) || normalizeHash(initial || "", false) || "", withHashCharacter) || "";

    //
    const ref = isValueRef(exists) ? exists : stringRef(locationHash);
    if (isObject(ref)) ref.value ||= locationHash;

    //
    let processingStateChange = false;
    let nanoThrottle = 0;
    const evf = (ev: any) => {
        if (getIgnoreNextPopState()) return;
        if (nanoThrottle <= 0) {
            nanoThrottle = 1;
            setTimeout(() => {
                const normalizedLocationHash = normalizeHash(location?.hash, false);
                const newValue = normalizeHash(normalizedLocationHash || normalizeHash(ref.value || "", false), withHashCharacter) || "";
                if (normalizeHash(ref.value, false) !== normalizeHash(newValue, false)) {
                    if (!processingStateChange) {
                        processingStateChange = true;
                        ref.value = newValue;
                        setTimeout(() => (processingStateChange = false), 0);
                    }
                }
                nanoThrottle = 0;
            }, 0);
        }
    };

    //
    const $val = new WeakRef(ref);
    const usb = affected([ref, "value"], (val) => {
        const newHash = normalizeHash(normalizeHash($getValue($val?.deref?.()) || val, false) || normalizeHash(location?.hash, false), true);
        if (newHash != location.hash) {
            $avoidTrigger($val?.deref?.(), () => {
                if (!processingStateChange) {
                    setIgnoreNextPopState(true);
                    //location.hash = `#${(newHash || location.hash)?.replace?.(/^#/, "")?.trim?.()?.replace?.(/^#/, "")?.trim?.() || ""}`;
                    history.pushState("", "", newHash || location.hash);
                    setTimeout(() => setIgnoreNextPopState(false), 0);
                }
            });
        }
    });

    //
    addEventListener("popstate", evf);
    addEventListener("hashchange", evf);
    return () => { usb?.();
        removeEventListener("popstate", evf);
        removeEventListener("hashchange", evf);
    };
}

//
export const matchMediaLink = (existsMedia?: any|null, exists?: any|null, condition?: string) => {
    if (condition == null) return;
    const med = existsMedia ?? matchMedia(condition), def = med?.matches || false;
    const ref = isValueRef(exists) ? exists : booleanRef(def); ref.value ??= def;
    const evf = (ev: { matches: any; }) => (ref.value = ev.matches); med?.addEventListener?.("change", evf);
    return () => { med?.removeEventListener?.("change", evf); };
}

//
export const visibleLink = (element?: any|null, exists?: any|null, initial?: any|null) => {
    if (element == null) return;
    const def = (initial?.value ?? (typeof initial != "object" ? initial : null)) ?? (element?.getAttribute?.("data-hidden") == null);
    const val = isValueRef(exists) ? exists : booleanRef(!!def);
    const linker = makeLinker<boolean>({
        source: element,
        ref: val,
        getter: ({ event }) => event?.type == "u2-hidden" ? false : true,
        setter: (value, { source }) => handleHidden(source, "data-hidden", value),
        trigger: eventTrigger(["u2-hidden", "u2-appear"], { passive: true }),
    }).bind();
    return () => linker.unbind();
}

//
export const attrLink = (element?: any|null, exists?: any|null, attribute?: string, initial?: any|null) => {
    const def = element?.getAttribute?.(attribute) ?? (typeof initial == "boolean" ? (initial ? "" : null) : getValue(initial));
    if (!element) return; const val = isValueRef(exists) ? exists : stringRef(def);
    if (isObject(val) && !normalizePrimitive(val.value)) val.value = normalizePrimitive(def) ?? val.value ?? "";
    const linker = makeLinker<string>({
        source: element,
        ref: val,
        getter: ({ source }) => source?.getAttribute?.(attribute),
        setter: (value, { source }) => handleAttribute(source, attribute, normalizePrimitive(value)),
        trigger: mutationTrigger(attribute),
    }).bind();
    return () => linker.unbind();
}

//
export const sizeLink = (element?: any|null, exists?: any|null, axis?: "inline" | "block", box?: ResizeObserverBoxOptions) => {
    const def = box == "border-box" ? element?.[axis == "inline" ? "offsetWidth" : "offsetHeight"] : (element?.[axis == "inline" ? "clientWidth" : "clientHeight"] - getPadding(element, axis));
    const val = isValueRef(exists) ? exists : numberRef(def); if (isObject(val)) val.value ||= (def ?? val.value) || 1;
    const obs = new ResizeObserver((entries) => {
        if (isObject(val)) {
            if (box == "border-box") { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize : entries[0].borderBoxSize[0].blockSize };
            if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
            if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
        }
    });
    if ((element?.element ?? element?.self ?? element) instanceof HTMLElement) { obs?.observe?.(element?.element ?? element?.self ?? element, { box }); };
    return ()=>obs?.disconnect?.();
}

//
export const scrollLink = (element?: any|null, exists?: any|null, axis?: "inline" | "block", initial?: any|null) => {
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: (initial?.value ?? initial) }); };
    const def = element?.[axis == "block" ? "scrollTop" : "scrollLeft"];
    const val = isValueRef(exists) ? exists : numberRef(def || 0); if (isObject(val)) val.value ||= (def ?? val.value) || 1; val.value ||= (def ?? val.value) || 0;
    const prop = axis == "block" ? "scrollTop" : "scrollLeft";
    const scrollProp = axis == "block" ? "top" : "left";
    const linker = makeLinker<number>({
        source: element,
        ref: val,
        getter: ({ source }) => source?.[prop] || 0,
        setter: (value, { source }) => {
            if (Math.abs((source?.[prop] || 0) - Number(value || 0)) > 0.001) {
                source?.scrollTo?.({ [scrollProp]: Number(value || 0) });
            }
        },
        trigger: eventTrigger("scroll", { passive: true }),
    }).bind();
    return () => linker.unbind();
}

//
export const checkedLink = (element?: any|null, exists?: any|null) => {
    const def = (!!element?.checked) || false;
    const val = isValueRef(exists) ? exists : booleanRef(def); if (isObject(val) && val.value !== def) val.value = def;
    const inputSource = (element?.type == "radio" ? element?.closest?.("input[type='radio']") : element) ?? element;
    const linker = makeLinker<boolean>({
        source: inputSource,
        ref: val,
        getter: ({ source, event }) => selectSourceInput(source, event, `input[type="checkbox"], input:checked`)?.checked ?? element?.checked ?? val?.value,
        setter: (value) => {
            if (element && element?.checked != value) setChecked(element, value);
        },
        trigger: eventTrigger(["click", "input", "change"]),
    }).bind();
    return () => linker.unbind();
}

export const radioValueLink = (element?: any|null, exists?: any|null, name?: string|null, initial?: any|null) => {
    if (isPrimitive(element)) return;
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    const radioName = radioNameOf(element, name);
    const checked = radioCheckedIn(element, radioName);
    const def = checked?.value ?? getValue(initial) ?? "";
    const val = isValueRef(exists) ? exists : stringRef(def);
    if (isObject(val) && !normalizePrimitive(val.value)) val.value = normalizePrimitive(def) ?? val.value ?? "";
    if (isObject(val) && isNotEqual(val.value, def)) val.value = def;

    const linker = makeLinker<string>({
        source: element,
        ref: val,
        getter: ({ source, event }) => {
            const target = event?.target;
            if (target?.matches?.(radioSelectorOf(radioName)) && target?.checked) return target.value;
            return radioCheckedIn(source, radioName)?.value ?? val?.value ?? "";
        },
        setter: (value, { source }) => {
            const radio = radioByValueIn(source, $getValue(value), radioName);
            if (radio && !radio.checked) {
                setChecked(radio, true);
                radio.dispatchEvent?.(new Event("change", { bubbles: true }));
            }
        },
        trigger: eventTrigger(["click", "input", "change"]),
    }).bind();
    return () => linker.unbind();
}

//
export const valueLink = (element?: any|null, exists?: any|null) => {
    if (isPrimitive(element)) return;
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    //
    const def = element?.value ?? "";
    const val = isValueRef(exists) ? exists : stringRef(def); if (isObject(val) && !normalizePrimitive(val.value)) val.value = normalizePrimitive(def) ?? val.value ?? "";
    const linker = makeLinker<string>({
        source: element,
        ref: val,
        getter: ({ source, event }) => selectSourceInput(source, event)?.value ?? source?.value ?? val?.value ?? "",
        setter: (value, { source }) => {
            const next = $getValue(value);
            if (source && isNotEqual(source?.value, next)) {
                source.value = next ?? "";
                source?.dispatchEvent?.(new Event("change", { bubbles: true }));
            }
        },
        trigger: eventTrigger(["click", "input", "change"]),
    }).bind();
    return () => linker.unbind();
}

//
export const valueAsNumberLink = (element?: any|null, exists?: any|null) => {
    if (isPrimitive(element)) return;
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    //
    const def = Number(element?.valueAsNumber) || 0;
    const val = isValueRef(exists) ? exists : numberRef(def); if (isObject(val) && !val.value && def) val.value = def;
    const linker = makeLinker<number>({
        source: element,
        ref: val,
        getter: ({ source, event }) => Number(selectSourceInput(source, event)?.valueAsNumber || source?.valueAsNumber || 0) || 0,
        setter: (value, { source }) => {
            if (source && (source.type == "range" || source.type == "number") && typeof source?.valueAsNumber == "number" && isNotEqual(source?.valueAsNumber, value)) {
                source.valueAsNumber = Number(value);
                source?.dispatchEvent?.(new Event("change", { bubbles: true }));
            }
        },
        trigger: eventTrigger(["click", "input", "change"]),
    }).bind();
    return () => linker.unbind();
}

//
export const observeSizeLink = (element?: any|null, exists?: any|null, box?: any|null, styles?: any|null) => {
    if (isPrimitive(element)) return;
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    //
    if (!styles) styles = isValueRef(exists) ? exists : observe({}); let obs: any = null;
    (obs = new ResizeObserver((mut) => {
        if (box == "border-box") {
            styles.inlineSize = `${mut[0].borderBoxSize[0].inlineSize}px`;
            styles.blockSize  = `${mut[0].borderBoxSize[0].blockSize}px`;
        }
        if (box == "content-box") {
            styles.inlineSize = `${mut[0].contentBoxSize[0].inlineSize}px`;
            styles.blockSize  = `${mut[0].contentBoxSize[0].blockSize}px`;
        }
        if (box == "device-pixel-content-box") {
            styles.inlineSize = `${mut[0].devicePixelContentBoxSize[0].inlineSize}px`;
            styles.blockSize  = `${mut[0].devicePixelContentBoxSize[0].blockSize}px`;
        }
    })).observe(element?.element ?? element?.self ?? element, { box });
    return () => { obs?.disconnect?.(); };
}

//
export const refCtl = (value?: any|null) => {
    if (isPrimitive(value)) return value;
    return ref(value);
}

//
export const orientLink = (host?: any|null, exists?: any|null)=>{
    const orient = orientationNumberMap?.[getCorrectOrientation()] || 0;
    const def = Number(orient) || 0;
    const val = isValueRef(exists) ? exists : numberRef(def);
    if (hasValue(val)) val.value = def;

    // !Change orientation? You are seious?!
    //affected([exists, "value"], (orient)=>{ // pickup name...
        //screen?.orientation?.lock?.($NAME$?.(orient));
    //});

    return whenAnyScreenChanges(()=>{
        val.value = orientationNumberMap?.[getCorrectOrientation()] || 0;
    });
}

//
export const pointerEventLink = (element?: any|null, event: string = "click", pointerId: number = 0, coordType: string = "client", exists?: any|null) => {
    if (isPrimitive(element)) return;
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    //
    const x = numberRef(0);
    const y = numberRef(0);
    const p = numberRef(pointerId || 0);

    //
    if (exists) {
        Object.defineProperty(exists, "x", {
            get: () => x.value,
            set: (value: number) => x.value = value,
            enumerable: true,
        });
        Object.defineProperty(exists, "y", {
            get: () => y.value,
            set: (value: number) => y.value = value,
            enumerable: true,
        });
        Object.defineProperty(exists, "pointerId", {
            get: () => p.value,
            set: (value: number) => p.value = value,
            enumerable: true,
        });
    } else {
        exists ??= observe({
            get x() {
                return x.value;
            },
            get y() {
                return y.value;
            },
            set x(value: number) {
                x.value = value;
            },
            set y(value: number) {
                y.value = value;
            },
            set pointerId(value: number) {
                p.value = value;
            },
            get pointerId() {
                return p.value;
            },
        });
    }

    //
    const unb = addEvent(element, event || "click", (ev: any) => {
        if (ev?.pointerId == (pointerId || 0)) {
            x.value = ev[(coordType || "client") + "X"];
            y.value = ev[(coordType || "client") + "Y"];
            p.value = ev.pointerId;
        }
        return true;
    });

    //
    return () => { unb?.(); x?.(); y?.(); p?.(); };
}



