type AnyHandler<E extends Event = Event> = (ev: E) => any;

type Hub = {
    handlers: Set<AnyHandler>;
    listener: (ev: Event) => void;
    options: AddEventListenerOptions;
};

const hubsByTarget = new WeakMap<EventTarget, Map<string, Hub>>();

const keyOf = (type: string, options: AddEventListenerOptions) => {
    const capture = options?.capture ? "1" : "0";
    const passive = options?.passive ? "1" : "0";
    return `${type}|c:${capture}|p:${passive}`;
};

export const lazyAddEventListener = <E extends Event = Event>(
    target: EventTarget | null | undefined,
    type: string,
    handler: AnyHandler<E>,
    options: AddEventListenerOptions = {}
) => {
    if (!target || typeof (target as any).addEventListener !== "function") return () => { };

    // `once` is not compatible with a shared hub listener; callers should implement their own once-logic.
    const normalized: AddEventListenerOptions = {
        capture: Boolean(options.capture),
        passive: Boolean(options.passive),
    };

    const key = keyOf(type, normalized);
    let hubs = hubsByTarget.get(target);
    if (!hubs) {
        hubs = new Map();
        hubsByTarget.set(target, hubs);
    }

    let hub = hubs.get(key);
    if (!hub) {
        const handlers = new Set<AnyHandler>();
        const listener = (ev: Event) => {
            for (const cb of Array.from(handlers)) {
                try {
                    cb(ev);
                } catch (e) {
                    console.warn(e);
                }
            }
        };
        hubs.set(key, hub = { handlers, listener, options: normalized });
        (target as any).addEventListener(type, listener, normalized);
    }

    hub.handlers.add(handler as AnyHandler);

    return () => {
        const hubsNow = hubsByTarget.get(target);
        const hubNow = hubsNow?.get(key);
        if (!hubNow) return;

        hubNow.handlers.delete(handler as AnyHandler);
        if (hubNow.handlers.size > 0) return;

        (target as any).removeEventListener(type, hubNow.listener, hubNow.options);
        hubsNow?.delete(key);
        if (hubsNow && hubsNow.size === 0) hubsByTarget.delete(target);
    };
};

type ProxiedStrategy = "closest" | "bubble";
type When = boolean | "handled";

type ProxiedConfig = {
    strategy?: ProxiedStrategy;
    preventDefault?: When;
    stopPropagation?: When;
    stopImmediatePropagation?: When;
};

type ProxiedHub = {
    targets: Map<HTMLElement, Set<AnyHandler>>;
    unbindGlobal: (() => void) | null;
    options: AddEventListenerOptions;
    strategy: ProxiedStrategy;
    config: ProxiedConfig;
    dispatch: (ev: Event) => void;
};

const proxiedByRoot = new WeakMap<EventTarget, Map<string, ProxiedHub>>();

const resolveHTMLElement = (el: any): HTMLElement | null => {
    const resolved = (el as any)?.element ?? el;
    return resolved instanceof HTMLElement ? resolved : null;
};

const shouldApply = (when: When | undefined, hadMatch: boolean, hadHandled: boolean) => {
    if (!when) return false;
    if (when === "handled") return hadHandled;
    return hadMatch;
};

/**
 * Proxied events:
 * - Installs **one** real DOM listener on `root` (per event/options/config), but only after the first element handler registers.
 * - Routes events to registered element handlers based on the composed path.
 * - Can conditionally call preventDefault/stop* only when a trigger matches (or when handled).
 */
export const addProxiedEvent = <E extends Event = Event>(
    root: EventTarget | null | undefined,
    type: string,
    options: AddEventListenerOptions = { capture: true, passive: false },
    config: ProxiedConfig = {}
) => {
    const target = root;
    if (!target || typeof (target as any).addEventListener !== "function") {
        return (_element: any, _handler: AnyHandler<E>) => () => { };
    }

    const normalized: AddEventListenerOptions = {
        capture: Boolean(options.capture),
        passive: Boolean(options.passive),
    };
    const strategy: ProxiedStrategy = config.strategy ?? "closest";

    const key = `${type}|c:${normalized.capture ? "1" : "0"}|p:${normalized.passive ? "1" : "0"}|s:${strategy}|pd:${String(config.preventDefault ?? "")}|sp:${String(config.stopPropagation ?? "")}|sip:${String(config.stopImmediatePropagation ?? "")}`;

    let hubs = proxiedByRoot.get(target);
    if (!hubs) {
        hubs = new Map();
        proxiedByRoot.set(target, hubs);
    }

    let hub = hubs.get(key);
    if (!hub) {
        const targets = new Map<HTMLElement, Set<AnyHandler>>();

        const dispatch = (ev: Event) => {
            let hadMatch = false;
            let hadHandled = false;

            const callSet = (set: Set<AnyHandler> | undefined) => {
                if (!set || set.size === 0) return;
                hadMatch = true;
                for (const cb of Array.from(set)) {
                    const r = cb(ev);
                    if (r) hadHandled = true;
                }
            };

            const path = (ev as any)?.composedPath?.() as any[] | undefined;
            if (Array.isArray(path)) {
                if (strategy === "closest") {
                    for (const n of path) {
                        const el = resolveHTMLElement(n);
                        if (!el) continue;
                        const set = targets.get(el);
                        if (!set) continue;
                        callSet(set);
                        break;
                    }
                } else {
                    for (const n of path) {
                        const el = resolveHTMLElement(n);
                        if (!el) continue;
                        callSet(targets.get(el));
                    }
                }
            } else {
                let cur = resolveHTMLElement((ev as any)?.target) as HTMLElement | null;
                while (cur) {
                    const set = targets.get(cur);
                    if (set) {
                        callSet(set);
                        if (strategy === "closest") break;
                    }
                    const r = cur.getRootNode?.() as (ShadowRoot | Document | null);
                    cur = (cur.parentElement || (r instanceof ShadowRoot ? r.host : null)) as HTMLElement | null;
                }
            }

            if (shouldApply(config.preventDefault, hadMatch, hadHandled)) (ev as any)?.preventDefault?.();
            if (shouldApply(config.stopImmediatePropagation, hadMatch, hadHandled)) (ev as any)?.stopImmediatePropagation?.();
            if (shouldApply(config.stopPropagation, hadMatch, hadHandled)) (ev as any)?.stopPropagation?.();
        };

        hub = { targets, unbindGlobal: null, options: normalized, strategy, config, dispatch };
        hubs.set(key, hub);
    }

    return (element: any, handler: AnyHandler<E>) => {
        const el = resolveHTMLElement(element);
        if (!el) return () => { };

        // Attach the single real DOM listener only when the first trigger registers.
        if (hub!.targets.size === 0 && !hub!.unbindGlobal) {
            hub!.unbindGlobal = lazyAddEventListener(target, type, hub!.dispatch, hub!.options);
        }

        let set = hub!.targets.get(el);
        if (!set) {
            set = new Set();
            hub!.targets.set(el, set);
        }
        set.add(handler as AnyHandler);

        return () => {
            const hubsNow = proxiedByRoot.get(target);
            const h = hubsNow?.get(key);
            if (!h) return;

            const resolved = resolveHTMLElement(element);
            if (!resolved) return;

            const s = h.targets.get(resolved);
            if (!s) return;
            s.delete(handler as AnyHandler);
            if (s.size === 0) h.targets.delete(resolved);

            if (h.targets.size === 0) {
                h.unbindGlobal?.();
                h.unbindGlobal = null;
                hubsNow?.delete(key);
                if (hubsNow && hubsNow.size === 0) proxiedByRoot.delete(target);
            }
        };
    };
};
