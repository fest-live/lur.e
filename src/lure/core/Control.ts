/**
 * DOM checkbox "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof booleanRef>} ref
 * @returns {(ev: Event) => void}
 */
export const checkboxCtrl = (ref) => { return (ev) => { const $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref; if ($ref) { $ref.value = ev?.target?.checked ?? !$ref.value; } } }

/**
 * DOM number input "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof numberRef>} ref
 * @returns {(ev: Event) => void}
 */
export const numberCtrl = (ref) => { return (ev) => { const $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref; if ($ref && $ref.value !== ev?.target?.valueAsNumber) { $ref.value = Number(ev?.target?.valueAsNumber || 0) ?? 0; } } }

/**
 * DOM value input "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof stringRef>} ref
 * @returns {(ev: Event) => void}
 */
export const valueCtrl = (ref) => { return (ev) => { const $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref; if ($ref) { $ref.value = (ev?.target?.value ?? $ref?.value) || ""; } } }

/**
 * DOM radio group "controller" handler for use with bindCtrl
 * @param {ReturnType<typeof stringRef>} ref
 * @param {string} name
 * @returns {(ev: Event) => void}
 */
export const radioCtrl = (ref, name) => {
    return (ev) => {
        let $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref;
        const selector = `input[name="${name}"]:checked`;
        if ($ref) { $ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? $ref.value; }
    }
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
        let $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref;
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { $ref.value = false; }
    }
    const cancel = () => { ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
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
