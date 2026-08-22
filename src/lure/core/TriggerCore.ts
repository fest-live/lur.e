/**
 * Composable modifier and reactive-source adapters for LinkTrigger.
 * DOM listener mechanics remain in fest/dom; object.ts remains the owner of
 * reactive subscription semantics.
 */

import { affected } from "@fest-lib/object";
import type { LinkTrigger } from "./Links";

export type TriggerModifiers = {
    once?: boolean;
    debounce?: number;
    prevent?: boolean;
    stop?: boolean;
    capture?: boolean;
    passive?: boolean;
};

export type RefTriggerOptions = {
    affectTypes?: string[];
    triggerImmediately?: boolean;
};

export type TriggerHandler = EventListenerOrEventListenerObject;
export type TriggerHandlerEntry = TriggerHandler | [TriggerHandler, TriggerModifiers];
export type TriggerHandlerValue = TriggerHandlerEntry | TriggerHandlerEntry[];

type CleanupLike = (() => void) | { disconnect?: () => void; unsubscribe?: () => void } | void;

const disposeOf = (cleanup: CleanupLike): (() => void) | undefined => {
    if (typeof cleanup === "function") return cleanup;
    if (typeof cleanup?.disconnect === "function") return () => cleanup.disconnect?.();
    if (typeof cleanup?.unsubscribe === "function") return () => cleanup.unsubscribe?.();
    return undefined;
};

/** Normalize modifier listener options without allowing passive preventDefault. */
export const listenerOptionsFor = (modifiers: TriggerModifiers = {}): AddEventListenerOptions => ({
    capture: Boolean(modifiers.capture),
    passive: modifiers.prevent ? false : Boolean(modifiers.passive),
});

const applyEventModifiers = (event: Event | undefined, modifiers: TriggerModifiers): void => {
    if (!event) return;
    if (modifiers.prevent) event.preventDefault?.();
    if (modifiers.stop) event.stopPropagation?.();
};

const isTriggerHandler = (value: any): value is TriggerHandler =>
    typeof value === "function" || typeof value?.handleEvent === "function";

const invokeHandler = (handler: TriggerHandler, event: Event): any =>
    typeof handler === "function" ? handler(event) : handler.handleEvent(event);

const isModifierTuple = (entry: any): entry is [TriggerHandler, TriggerModifiers] =>
    Array.isArray(entry)
    && entry.length === 2
    && isTriggerHandler(entry[0])
    && !!entry[1]
    && typeof entry[1] === "object"
    && !Array.isArray(entry[1]);

/**
 * Decorate any LinkTrigger with lifecycle-safe DOM modifiers.
 * INVARIANT: `once` disposes the wrapped trigger after the committed callback,
 * including a delayed debounce commit.
 */
export const withTriggerModifiers = <T = any>(
    trigger: LinkTrigger<T>,
    modifiers: TriggerModifiers = {},
): LinkTrigger<T> => (ctx) => {
    let disposed = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let cleanup: (() => void) | undefined;
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        if (timeout) clearTimeout(timeout);
        timeout = null;
        cleanup?.();
        cleanup = undefined;
    };
    const commit = (event?: any, forProp?: string) => {
        if (disposed) return;
        applyEventModifiers(event as Event | undefined, modifiers);
        const run = () => {
            if (disposed) return;
            ctx.commit(event, forProp);
            if (modifiers.once) dispose();
        };
        const delay = Math.max(0, Number(modifiers.debounce) || 0);
        if (delay > 0) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(run, delay);
        } else {
            run();
        }
    };
    cleanup = disposeOf(trigger({ ...ctx, commit }));
    return dispose;
};

/**
 * Adapt an object.ts observable ref/property into the LinkTrigger lifecycle.
 * Reactive filtering remains delegated to object.ts `affected()`.
 */
export const refTrigger = (
    target: any,
    prop = "value",
    {
        affectTypes = ["setter", "manual"],
        triggerImmediately = false,
    }: RefTriggerOptions = {},
): LinkTrigger => ({ commit }) => affected([target, prop], (value, key, oldValue, trigger) => {
    commit({ type: "ref", target, prop: key ?? prop, value, oldValue, trigger }, prop);
}, {
    affectTypes,
    triggerImmediately,
});

/**
 * Bind `E({ on })` style handlers with the same modifier semantics as Linker.
 * Existing bare handlers remain valid; modifier tuples are additive.
 */
export const bindTriggerHandlers = (
    target: EventTarget | null | undefined,
    handlers: Record<string, TriggerHandlerValue> | null | undefined,
): (() => void) => {
    if (!target || !handlers) return () => {};
    const disposers: Array<() => void> = [];
    for (const [type, entry] of Object.entries(handlers)) {
        const entries = isModifierTuple(entry)
            ? [entry]
            : Array.isArray(entry)
                ? entry
                : [entry];
        for (const current of entries) {
            const [handler, modifiers] = isModifierTuple(current)
                ? current
                : [current, {} as TriggerModifiers];
            if (!isTriggerHandler(handler)) continue;
            let disposed = false;
            let timeout: ReturnType<typeof setTimeout> | null = null;
            let remove: (() => void) | null = null;
            const dispose = () => {
                if (disposed) return;
                disposed = true;
                if (timeout) clearTimeout(timeout);
                timeout = null;
                remove?.();
                remove = null;
            };
            const listener = (event: Event) => {
                if (disposed) return;
                applyEventModifiers(event, modifiers);
                const run = () => {
                    if (disposed) return;
                    invokeHandler(handler, event);
                    if (modifiers.once) dispose();
                };
                const delay = Math.max(0, Number(modifiers.debounce) || 0);
                if (delay > 0) {
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(run, delay);
                } else {
                    run();
                }
            };
            const options = listenerOptionsFor(modifiers);
            target.addEventListener(type, listener, options);
            remove = () => target.removeEventListener(type, listener, options);
            disposers.push(dispose);
        }
    }
    return () => disposers.forEach((dispose) => dispose());
};
