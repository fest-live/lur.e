type Unbind = (() => void) | void;

/**
 * Runs `bind()` only while `element.isConnected === true`.
 * - If the element is not connected yet, waits until it appears in the document.
 * - If the element disconnects, calls the returned cleanup.
 * - If it reconnects, binds again.
 */
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

    // Observe DOM changes to detect (dis)connect.
    const root = typeof document !== "undefined" ? document.documentElement : null;
    const el = ((element as any)?.element ?? element) as Element;
    const mo = typeof MutationObserver !== "undefined" && root
        ? new MutationObserver((records) => {
            // Only react when the mutated subtree could actually contain our element.
            // This avoids rebinding checks on unrelated DOM churn.
            for (const r of records) {
                if (r.target === el || (r.target as any)?.contains?.(el)) {
                    ensureBound();
                    return;
                }
                //if (r.type !== "childList") continue;

                const nodes = [...Array.from(r?.addedNodes || []), ...Array.from(r?.removedNodes || [])];
                for (const n of nodes) {
                    // Node.contains checks descendants too (covers "added node contains child elements").
                    if (n === el || (n as Node).contains?.(el)) {
                        ensureBound();
                        return;
                    }
                }
            }
        })
        : null;

    if (mo && root) mo.observe(root, { childList: true, subtree: true });

    // Initial check (after current tick) to allow callers that just created the element.
    queueMicrotask(() => ensureBound());

    return () => {
        disposed = true;
        mo?.disconnect?.();
        cleanup?.();
        cleanup = null;
    };
};
