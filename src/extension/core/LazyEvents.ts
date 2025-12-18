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
            // Snapshot to avoid iteration issues if handlers mutate during dispatch.
            for (const cb of Array.from(handlers)) {
                try {
                    cb(ev);
                } catch (e) {
                    // Keep the global listener alive even if a handler throws.
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
type ProxiedHub = {
    targets: Map<HTMLElement, Set<AnyHandler>>;
    unbindGlobal: (() => void) | null;
    options: AddEventListenerOptions;
    strategy: ProxiedStrategy;
    dispatch: (ev: Event) => void;
};

const proxiedByTarget = new WeakMap<EventTarget, Map<string, ProxiedHub>>();

const resolveHTMLElement = (el: any): HTMLElement | null => {
    const resolved = (el as any)?.element ?? el;
    return resolved instanceof HTMLElement ? resolved : null;
};

/**
 * Creates a proxied event on `root` with exactly one real DOM listener.
 * Then you can register per-element handlers which will be invoked based on event path.
 *
 * - **strategy: "closest"**: fires handlers for the first registered element in the composed path.
 * - **strategy: "bubble"**: fires handlers for every registered element in the composed path.
 */
export const addProxiedEvent = <E extends Event = Event>(
    root: EventTarget | null | undefined,
    type: string,
    options: AddEventListenerOptions = { capture: true, passive: false },
    config: { strategy?: ProxiedStrategy } = {}
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

    const key = `${type}|c:${normalized.capture ? "1" : "0"}|p:${normalized.passive ? "1" : "0"}|s:${strategy}`;
    let hubs = proxiedByTarget.get(target);
    if (!hubs) {
        hubs = new Map();
        proxiedByTarget.set(target, hubs);
    }

    let hub = hubs.get(key);
    if (!hub) {
        const targets = new Map<HTMLElement, Set<AnyHandler>>();

        const dispatch = (ev: Event) => {
            const path = (ev as any)?.composedPath?.() as any[] | undefined;
            if (Array.isArray(path)) {
                if (strategy === "closest") {
                    for (const n of path) {
                        const el = resolveHTMLElement(n);
                        if (!el) continue;
                        const set = targets.get(el);
                        if (!set) continue;
                        for (const cb of Array.from(set)) cb(ev);
                        return;
                    }
                    return;
                }

                // bubble
                for (const n of path) {
                    const el = resolveHTMLElement(n);
                    if (!el) continue;
                    const set = targets.get(el);
                    if (!set) continue;
                    for (const cb of Array.from(set)) cb(ev);
                }
                return;
            }

            // Fallback without composedPath
            let cur = resolveHTMLElement((ev as any)?.target) as HTMLElement | null;
            while (cur) {
                const set = targets.get(cur);
                if (set) {
                    for (const cb of Array.from(set)) cb(ev);
                    if (strategy === "closest") return;
                }
                const r = cur.getRootNode?.() as (ShadowRoot | Document | null);
                cur = (cur.parentElement || (r instanceof ShadowRoot ? r.host : null)) as HTMLElement | null;
            }
        };

        const unbindGlobal = lazyAddEventListener(target, type, dispatch, normalized);
        hub = { targets, unbindGlobal, options: normalized, strategy, dispatch };
        hubs.set(key, hub);
    }

    return (element: any, handler: AnyHandler<E>) => {
        const el = resolveHTMLElement(element);
        if (!el) return () => { };

        let set = hub!.targets.get(el);
        if (!set) {
            set = new Set();
            hub!.targets.set(el, set);
        }
        set.add(handler as AnyHandler);

        return () => {
            const h = hubs?.get(key);
            if (!h) return;
            const resolved = resolveHTMLElement(element);
            if (!resolved) return;
            const s = h.targets.get(resolved);
            if (!s) return;
            s.delete(handler as AnyHandler);
            if (s.size === 0) h.targets.delete(resolved);
            if (h.targets.size === 0) {
                h.unbindGlobal?.();
                hubs?.delete(key);
            }
            if (hubs && hubs.size === 0) proxiedByTarget.delete(target);
        };
    };
};
