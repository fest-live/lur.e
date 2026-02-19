import { addToCallChain, observe, affected, unaffected } from "fest/object";
import {
    handleAttribute,
    handleProperty,
    namedStoreMaps,
    observeAttribute,
    observeBySelector,
    includeSelf,
    setChecked,
    getEventTarget,
    handleStyleChange,
} from "fest/dom";
import {
    $getValue,
    camelToKebab,
    $set,
    toRef,
    deref,
    isNotEqual,
    handleListeners,
    $avoidTrigger,
} from "fest/core";

import {
    handleAnimatedStyleChange,
    handleTransitionStyleChange,
    handleSpringStyleChange,
    handleMorphStyleChange,
    bindAnimatedStyle,
    AnimationSequence,
    AnimationPresets,
    cancelElementAnimations,
    animatedRef,
    type AnimationOptions,
    type TransitionOptions,
} from "../../extension/css-ref/CSSAnimated";

// предполагается, что класс уже существует в проекте
import { DoubleWeakMap } from "fest/object"; // <-- путь подстрой под себя

// ============================================================================
// Bank storage (pair-keyed)
// ============================================================================

type Unsub = (() => void) | void;
type BankEntry = [any, Unsub];
type Bank = Record<string | symbol, BankEntry>;

//
export const elMap = new DoubleWeakMap();
export const alives = new FinalizationRegistry((unsub: any) => unsub?.());

//
export const $mapped = Symbol.for("@mapped");
export const $virtual = Symbol.for("@virtual");
export const $behavior = Symbol.for("@behavior");

//
export const bindBeh = (element: any, store: any, behavior: any) => {
    const weak = toRef(element);
    const name = store?.[0] ?? store?.name;
    const value = store?.[1] ?? store?.value;

    if (behavior) {
        const usub = affected?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps?.get?.(name as string);
            behavior?.([value, prop, old], [weak, store, valMap?.get(deref(weak))]);
        });
        addToCallChain(store, Symbol.dispose, usub);
    }
    return element;
};

//
export const bindCtrl = (element: any, ctrlCb: any) => {
    const hdl = { click: ctrlCb, input: ctrlCb, change: ctrlCb };
    ctrlCb?.({ target: element });
    const unsub = handleListeners?.(element, "addEventListener", hdl);
    addToCallChain(element, Symbol.dispose, unsub);
    return unsub;
};

//
export const reflectControllers = (element: any, ctrls: any) => {
    if (ctrls) for (let ctrl of ctrls) bindCtrl(element, ctrl);
    return element;
};

//
export const $observeInput = (element: any, ref?: any | null, prop: string = "value") => {
    const wel = toRef(element);
    const rf = toRef(ref);

    const ctrlCb = (_ev: any) => {
        $set(rf, "value", deref(wel)?.[prop ?? "value"] ?? $getValue(deref(rf)));
    };

    const hdl = { click: ctrlCb, input: ctrlCb, change: ctrlCb };
    ctrlCb?.({ target: element });
    handleListeners?.(element, "addEventListener", hdl);

    $set(rf, "value", element?.[prop ?? "value"] ?? $getValue(deref(ref)));
    return () => handleListeners?.(element, "removeEventListener", hdl);
};

//
export const $observeAttribute = (el: any, ref?: any | null, prop: string = "") => {
    const wel = toRef(el);
    const wv = toRef(ref);

    const attrName = camelToKebab(prop)!;

    const cb = (mutation: any) => {
        if (mutation.type == "attributes" && mutation.attributeName == attrName) {
            const value = mutation?.target?.getAttribute?.(mutation.attributeName);
            const valRef = deref(wv),
                reVal = $getValue(valRef);

            if (
                isNotEqual(mutation.oldValue, value) &&
                valRef != null &&
                (typeof valRef == "object" || typeof valRef == "function")
            ) {
                if (isNotEqual(reVal, value) || reVal == null) {
                    $set(valRef, "value", value);
                }
            }
        }
    };

    return observeAttribute(el, attrName, cb);
};

// ============================================================================
// Bank helpers (adapted to pair-key map)
// ============================================================================

// @ts-ignore // Stable Universal Key Assignation - eg. [S.U.K.A.]
export const removeFromBank = (el: any, handler: any, prop: any) => {
    const bank = elMap.get([el, handler]);
    if (bank) {
        const old = bank[prop]?.[1];
        delete bank[prop];
        old?.();
    }
};

//
export const addToBank = (el: any, handler: any, prop: any, forLink: any) => {
    // bank is stored by pair [el, handler]
    const bank = elMap.getOrInsertComputed([el, handler], () => ({} as Bank));
    bank?.[prop]?.[1]?.();
    bank[prop] = forLink;
    return true;
};

//
export const hasInBank = (el: any, handler: any) => {
    return elMap.has([el, handler]);
};

// ============================================================================
// Core binding
// ============================================================================

export const bindHandler = (
    element: any,
    value: any,
    prop: any,
    handler: any,
    set?: any,
    withObserver?: boolean | Function
) => {
    const wel = toRef(element);
    element = deref(wel);
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    //
    let controller: AbortController | null = null;
    controller?.abort?.();
    controller = new AbortController();

    //
    const wv = toRef(value);
    handler?.(element, prop, value);

    const un = affected?.([value, "value"], (curr: any, _p: any, old: any) => {
        const valueRef = deref(wv);
        const setRef = deref(set);
        const elementRef = deref(wel);

        const v = $getValue(valueRef) ?? $getValue(curr);
        if (!setRef || setRef?.[prop] == valueRef) {
            if (typeof valueRef?.[$behavior] == "function") {
                valueRef?.[$behavior]?.(
                    (_val: any = curr) => handler(elementRef, prop, v),
                    [curr, prop, old],
                    [controller?.signal, prop, wel]
                );
            } else {
                handler(elementRef, prop, v);
            }
        }
    });

    //
    let obs: any = null;
    if (typeof withObserver == "boolean" && withObserver) {
        if (handler == handleAttribute) obs = $observeAttribute(element, value, prop);
        if (handler == handleProperty) obs = $observeInput(element, value, prop);
    }
    if (typeof withObserver == "function") {
        obs = withObserver(element, prop, value);
    }

    //
    const unsub = () => {
        obs?.disconnect?.();
        obs != null && typeof obs == "function" ? obs?.() : null;
        un?.();
        controller?.abort?.();
        removeFromBank?.(element, handler, prop);
    };

    // @ts-ignore
    addToCallChain(value, Symbol.dispose, unsub);
    alives.register(element, unsub);

    // register in bank
    if (!addToBank(element, handler, prop, [value, unsub])) return unsub;
};

// ============================================================================
// Updating forms
// ============================================================================

export const updateInput = (target: any, state: any) => {
    const selector = 'input:where([type="text"], [type="number"], [type="range"])';
    const input = includeSelf(target, "input");
    const name = (input as HTMLInputElement)?.name || (target as HTMLElement)?.dataset?.name || "";

    if (state?.[name] != null || name in state) {
        if (state && input?.matches?.(selector)) {
            if ((input as HTMLInputElement).value != state[name]) {
                $avoidTrigger(state, () => {
                    (input as HTMLInputElement).value = state[name];
                    input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
                }, name);
            }
        }

        // radio
        if (state) {
            const radio = includeSelf(
                target,
                `input:where([type="radio"][name="${name}"][value="${state?.[name]}"])`
            );
            if (state && radio && state[name] == (radio as HTMLInputElement).value && !(radio as HTMLInputElement).checked) {
                $avoidTrigger(state, () => {
                    setChecked(radio as HTMLInputElement, state[name]);
                }, name);
            }
        }

        // checkbox
        const checkbox = includeSelf(target, 'input:where([type="checkbox"])');
        if (state && checkbox) {
            if (state[name] != (checkbox as HTMLInputElement).checked) {
                $avoidTrigger(state, () => {
                    setChecked(checkbox as HTMLInputElement, state[name]);
                }, name);
            }
        }
    }
};

//
export const bindWith = (
    el: any,
    prop: any,
    value: any,
    handler: any,
    set?: any,
    withObserver?: boolean | Function
) => {
    handler(el, prop, value);
    return bindHandler(el, value, prop, handler, set, withObserver);
};

//
export const bindForms = (
    fields: any = document.documentElement,
    wrapper: string = ".u2-input",
    state: any = {}
) => {
    state ??= observe({});

    const wst = new WeakRef(state);

    const onChange = (ev: any) => {
        const state = deref(wst);
        if (!state) return;

        const eventTarget = getEventTarget(ev) ?? ev?.target;
        const input = eventTarget?.matches?.("input") ? eventTarget : eventTarget?.querySelector?.("input");
        const target = (eventTarget?.matches?.(wrapper) ? eventTarget : input?.closest?.(wrapper)) ?? input;
        const name = input?.name || target?.name || target?.dataset?.name;

        if (state?.[name] != null || name in state) {
            if (input?.matches?.('input:where([type="text"], [type="number"], [type="range"])')) {
                const value =
                    input.valueAsNumber != null && !isNaN(input.valueAsNumber)
                        ? input.valueAsNumber
                        : input.value;
                if (state[name] != value) state[name] = value;
            }

            if (input?.matches?.('input[type="radio"]') && state[name] != input?.value && input?.checked) {
                state[name] = input.value;
            }

            if (input?.matches?.('input[type="checkbox"]') && state[name] != input?.checked) {
                state[name] = input.checked;
            }
        }
    };

    const appearHandler = () =>
        requestIdleCallback(
            () => fields.querySelectorAll(wrapper).forEach((target: any) => updateInput(target, state)),
            { timeout: 100 }
        );

    const observer = observeBySelector(fields, wrapper, (mutations: any) =>
        mutations.addedNodes.forEach((target: any) =>
            requestIdleCallback(() => updateInput(state, target), { timeout: 100 })
        )
    );

    const unsubscribe = affected?.(state, (_value: any, _property: any) =>
        fields.querySelectorAll(wrapper).forEach((target: any) => updateInput(target, state))
    );

    requestIdleCallback(
        () => fields.querySelectorAll(wrapper).forEach((target: any) => updateInput(target, state)),
        { timeout: 100 }
    );

    fields.addEventListener("input", onChange);
    fields.addEventListener("change", onChange);
    fields.addEventListener("u2-appear", appearHandler);

    const wf = new WeakRef(fields);
    addToCallChain(state, Symbol.dispose, () => {
        const fields = deref(wf);
        fields?.removeEventListener?.("input", onChange);
        fields?.removeEventListener?.("change", onChange);
        fields?.removeEventListener?.("u2-appear", appearHandler);
        observer?.disconnect?.();
        unsubscribe?.(); // <-- важно: ты объявлял unsubscribe, но раньше вызывал unaffected(state)
        unaffected(state);
    });

    return state;
};

// ============================================================================
// Animation-Based Binding Functions (unchanged)
// ============================================================================

export const bindAnimated = (element: any, property: any, value: any, options: AnimationOptions = {}) => {
    return bindAnimatedStyle(element, property, value, "animate", options);
};

export const bindTransition = (
    element: any,
    property: any,
    value: any,
    options: TransitionOptions = {}
) => {
    return bindAnimatedStyle(element, property, value, "transition", options);
};

export const bindSpring = (
    element: any,
    property: any,
    value: any,
    options: { stiffness?: number; damping?: number; mass?: number; velocity?: number } = {}
) => {
    return bindAnimatedStyle(element, property, value, "spring", options as any);
};

export const bindMorph = (element: any, properties: Record<string, any>, options: AnimationOptions = {}) => {
    return bindAnimatedStyle(element, "", properties, "morph", options);
};

export const createAnimatedRef = animatedRef;
export const createAnimationSequence = () => AnimationSequence.create();
export const cancelAnimations = cancelElementAnimations;

export const bindWithAnimation = (
    el: any,
    prop: any,
    value: any,
    animationType: "instant" | "animate" | "transition" | "spring" = "instant",
    animationOptions: AnimationOptions | TransitionOptions = {}
) => {
    if (animationType === "instant") {
        return bindWith(el, prop, value, handleStyleChange);
    }

    const binder =
        animationType === "animate" ? bindAnimated : animationType === "transition" ? bindTransition : bindSpring;

    return binder(el, prop, value, animationOptions as any);
};

export const bindAnimatedBatch = (
    element: any,
    bindings: Array<{
        property: string;
        value: any;
        animationType?: "animate" | "transition" | "spring";
        options?: AnimationOptions | TransitionOptions;
        delay?: number;
    }>
) => {
    const unbinders: (() => void)[] = [];

    bindings.forEach((binding, index) => {
        const delay = binding.delay || index * 50;
        const options = {
            ...binding.options,
            delay: (binding.options?.delay || 0) + delay,
        };

        const unbinder = bindAnimatedStyle(
            element,
            binding.property,
            binding.value,
            binding.animationType || "animate",
            options
        );
        unbinders.push(unbinder);
    });

    return () => unbinders.forEach((unbind) => unbind?.());
};

export const bindPreset = {
    fade: (element: any, value: any, duration = 200) =>
        bindAnimated(element, "opacity", value, { duration, easing: "ease-in-out" }),

    slideX: (element: any, value: any, duration = 300) =>
        bindAnimated(element, "transform", value, { duration, easing: "ease-out" }),

    slideY: (element: any, value: any, duration = 300) =>
        bindAnimated(element, "transform", value, { duration, easing: "ease-out" }),

    scale: (element: any, value: any, duration = 200) =>
        bindAnimated(element, "transform", value, { duration, easing: "ease-in-out" }),

    color: (element: any, value: any, duration = 300) =>
        bindTransition(element, "color", value, { duration, easing: "ease-in-out" }),

    backgroundColor: (element: any, value: any, duration = 300) =>
        bindTransition(element, "background-color", value, { duration, easing: "ease-in-out" }),

    bounce: (element: any, property: string, value: any) =>
        bindSpring(element, property, value, { stiffness: 200, damping: 15 }),

    elastic: (element: any, property: string, value: any) =>
        bindAnimated(element, property, value, AnimationPresets.elastic),
};

export const bindConditionalAnimation = (
    element: any,
    condition: any,
    animations: {
        true?: { property: string; value: any; options?: AnimationOptions }[];
        false?: { property: string; value: any; options?: AnimationOptions }[];
    }
) => {
    const wel = toRef(element);
    const wcond = toRef(condition);

    let currentUnbinders: (() => void)[] = [];

    const applyAnimations = (isTrue: boolean) => {
        currentUnbinders.forEach((un) => un?.());
        currentUnbinders = [];

        const animationSet = isTrue ? animations.true : animations.false;
        if (animationSet) {
            animationSet.forEach((anim) => {
                const unbinder = bindAnimated(deref(wel), anim.property, anim.value, anim.options);
                currentUnbinders.push(unbinder);
            });
        }
    };

    applyAnimations($getValue(deref(wcond)));

    const unSub = affected(condition, (newValue: any) => {
        applyAnimations(!!newValue);
    });

    return () => {
        currentUnbinders.forEach((un) => un?.());
        unSub?.();
    };
};

//
export const withInsetWithPointer = (exists: HTMLElement, pRef: any) => {
    if (!exists) return () => { };
    const ubs = [
        bindWith(exists, "--client-x", pRef?.[0], handleStyleChange),
        bindWith(exists, "--client-y", pRef?.[1], handleStyleChange),
    ];
    if (pRef?.[2]) ubs.push(bindWith(exists, "--anchor-width", pRef?.[2], handleStyleChange));
    if (pRef?.[3]) ubs.push(bindWith(exists, "--anchor-height", pRef?.[3], handleStyleChange));
    return () => ubs?.forEach?.((ub: any) => ub?.());
};

type Unbind = (() => void) | void;

export const bindWhileConnected = (element: Element | null | undefined, bind: () => Unbind) => {
    if (!element) return () => { };

    let cleanup: (() => void) | null = null;
    let disposed = false;

    const ensureBound = () => {
        if (disposed) return;

        if (!element.isConnected) {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
            return;
        }

        if (!cleanup) {
            const c = bind();
            cleanup = typeof c === "function" ? c : null;
        }
    };

    const root = typeof document !== "undefined" ? document.documentElement : null;
    const el = ((element as any)?.element ?? element) as Element;

    const mo =
        typeof MutationObserver !== "undefined" && root
            ? new MutationObserver((records) => {
                for (const r of records) {
                    if (r.target === el || (r.target as any)?.contains?.(el)) {
                        ensureBound();
                        return;
                    }

                    const nodes = [...Array.from(r?.addedNodes || []), ...Array.from(r?.removedNodes || [])];
                    for (const n of nodes) {
                        if (n === el || (n as Node).contains?.(el)) {
                            ensureBound();
                            return;
                        }
                    }
                }
            })
            : null;

    if (mo && root) mo.observe(root, { childList: true, subtree: true });

    queueMicrotask(() => ensureBound());

    return () => {
        disposed = true;
        mo?.disconnect?.();
        cleanup?.();
        cleanup = null;
    };
};