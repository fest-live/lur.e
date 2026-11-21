/*
 * Filename: exit-layer.node.test.ts
 * FullPath: modules/projects/lur.e/test/exit-layer.node.test.ts
 * FIND:exit-layer
 * TAG:exit-layer,style-anim,lure
 * WHY: removeChild exitLayer relocates a dying node into the fixed top host;
 *      hidden/covered nodes detach instantly; re-append before the decision
 *      frame cancels the exit and keeps the node.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/"
});
const browserGlobals = [
    "window",
    "document",
    "Node",
    "Element",
    "HTMLElement",
    "HTMLBodyElement",
    "Document",
    "DocumentFragment",
    "Text",
    "Comment",
    "MutationObserver",
    "CustomEvent",
    "Event",
    "navigator"
] as const;

for (const name of browserGlobals) {
    try {
        (globalThis as any)[name] = (dom.window as any)[name];
    } catch {
        Object.defineProperty(globalThis, name, {
            configurable: true,
            writable: true,
            value: (dom.window as any)[name]
        });
    }
}

(globalThis as any).getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
(globalThis as any).addEventListener = dom.window.addEventListener.bind(dom.window);
(globalThis as any).removeEventListener = dom.window.removeEventListener.bind(dom.window);
(globalThis as any).postMessage = dom.window.postMessage.bind(dom.window);
(globalThis as any).OffscreenCanvas = class {
    getContext() {
        return null;
    }
};
(globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) =>
    setTimeout(() => callback(Date.now()), 0);
(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);

const { observe } = await import("@fest-lib/object");
const { removeChild } = await import("../src/lure/context/Utils");
const { M } = await import("../src/lure/node/Mapped");
const {
    setExitLayerDefaults,
    ensureExitHost,
    isExitVisibilityHidden,
    runExitLayer,
} = await import("../src/lure/context/ExitLayer");

// WHY: Mapped/Utils read a global `scheduler` (yield) that jsdom does not provide.
(globalThis as any).scheduler = (globalThis as any).scheduler ?? {
    yield: () => Promise.resolve(),
    postTask: (cb: any) => Promise.resolve().then(cb),
};

// WHY: Mapped.isElementParent requires moveBefore; jsdom does not implement it.
// Same fallback shape as Utils.appendOrEmplaceByIndex.
if (typeof (Element.prototype as any).moveBefore !== "function") {
    (Element.prototype as any).moveBefore = function (node: Node, child: Node | null) {
        if (child == null) { this.appendChild(node); return node; }
        this.insertBefore(node, child);
        return node;
    };
}

const tick = () => new Promise((r) => setTimeout(r, 5));

// WHY: disappear()/waitElementAnimations resolve instantly in jsdom (no real
// WAAPI); a fake running player holds the ghost until `gate()` resolves it.
const holdAnimations = (el: HTMLElement) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    (el as any).getAnimations = () => [{ playState: "running", finished: gate }];
    return () => release();
};

test("exit layer host mounts into body with fixed top styling", () => {
    const host = ensureExitHost();
    assert.ok(host);
    assert.equal(host.getAttribute("data-lure-exit-layer"), "");
    assert.equal(host.style.position, "fixed");
    assert.equal(host.style.zIndex, String(2147483647));
    assert.equal(document.querySelector("[data-lure-exit-layer]"), host);
});

test("removeChild exitLayer relocates the node into the host before removal", async () => {
    const parent = document.createElement("div");
    document.body.append(parent);
    const child = document.createElement("span");
    child.textContent = "bye";
    parent.append(child);
    const release = holdAnimations(child);

    const pending = removeChild(parent, child, null, -1, {
        disappear: { properties: { opacity: [1, 0] }, duration: 1 },
        exitLayer: true,
    });

    // NOTE: rAF mock resolves on a timeout; the ghost decision happens after it.
    await tick();
    const host = ensureExitHost();
    assert.equal(child.parentNode, host, "ghost lives in the exit host");
    assert.equal(child.getAttribute("data-exit-ghost"), "");
    assert.equal(child.style.position, "fixed");
    assert.equal(child.parentNode, host);

    release();
    await pending;
    // NOTE: el.remove() is sync, but the ghost's finally runs a microtask
    // after the wait — give the queue a tick before asserting detachment.
    await tick();
    assert.equal(child.parentNode, null);
    assert.equal(host.children.length, 0);
});

test("hidden element skips the exit animation and detaches instantly", async () => {
    const parent = document.createElement("div");
    document.body.append(parent);
    const child = document.createElement("span");
    child.style.display = "none";
    parent.append(child);
    const release = holdAnimations(child);

    const pending = removeChild(parent, child, null, -1, {
        disappear: { properties: { opacity: [1, 0] }, duration: 1 },
        exitLayer: true,
    });

    // WHY: hidden nodes skip the ghost relocation but still take the classic
    // data-removing disappear branch inside the origin parent.
    await tick();
    assert.equal(child.parentNode, parent, "stays in origin parent (no exit host)");
    assert.equal(child.getAttribute("data-removing"), "");
    assert.equal(ensureExitHost().children.length, 0, "exit host stays empty");
    release();
    await pending;
    await tick();
    assert.equal(child.parentNode, null);
});

test("isExitVisibilityHidden treats a jsdom node without checkVisibility as visible", () => {
    const el = document.createElement("div");
    document.body.append(el);
    assert.equal(isExitVisibilityHidden(el), false);
});

test("re-appending before the decision frame keeps the node alive", async () => {
    const parent = document.createElement("div");
    document.body.append(parent);
    const child = document.createElement("span");
    parent.append(child);

    const pending = removeChild(parent, child, null, -1, {
        disappear: { properties: { opacity: [1, 0] }, duration: 1 },
        exitLayer: true,
    });

    // WHY: moveBefore/append from another layer lands before the next frame —
    // the move detector must treat it as a re-parent, not a removal.
    const other = document.createElement("div");
    document.body.append(other);
    other.append(child);

    await pending;
    assert.equal(child.parentNode, other, "moved node stays in its new parent");
    assert.equal(ensureExitHost().children.length, 0);
});

test("Mapped splice plays the exit through the exit layer", async () => {
    const items = observe(["a"]);
    const list = document.createElement("div");
    document.body.append(list);
    let release: (() => void) | null = null;
    const mapped: any = M(items, (item: string) => {
        const row = document.createElement("span");
        row.textContent = item;
        release = holdAnimations(row);
        return row;
    }, {
        boundParent: list,
        disappear: { properties: { opacity: [1, 0] }, duration: 1 },
        exitLayer: true,
    });
    // NOTE: elementForPotentialParent binds the empty source directly to the
    // list; appending its return value would double-route the initial mount.
    mapped.elementForPotentialParent(list);
    await tick();
    await tick();

    items.splice(0, 1);
    // WHY: the ghost decision lands on the frame AFTER the remove call — the
    // relocate shows up from the second tick after the splice.
    await tick();
    await tick();

    const host = ensureExitHost();
    const ghost = host.querySelector("span");
    assert.ok(ghost, "row moved to the exit host for the exit animation");
    assert.equal(ghost?.getAttribute("data-exit-ghost"), "");

    release?.();
    await tick();
    await tick();
    await tick();
    assert.equal(host.querySelector("span"), null, "ghost detaches after the exit");
    assert.deepEqual(Array.from(list.children), []);
});

test("runExitLayer with no document body still detaches the node", async () => {
    const detachedHost = document.createElement("div");
    const el = document.createElement("span");
    detachedHost.append(el);
    // NOTE: ensureExitHost finds document.body here, so force the null branch.
    const result = await runExitLayer(el, detachedHost, null, { host: null });
    assert.equal(result, "removed");
});

setExitLayerDefaults({ enabled: true });
