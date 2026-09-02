/*
 * Filename: mapped-lifecycle.node.test.ts
 * FullPath: modules/projects/lur.e/test/mapped-lifecycle.node.test.ts
 * FIND:style-anim
 * TAG:style-anim,lure
 * WHY: Utils append/remove wait for appear/disappear before detach.
 * WHY: Mapped splice uses #syncBoundParent, not makeUpdater.
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
const { M } = await import("../src/lure/node/Mapped");
const { removeChild, appendChild, replaceChildren } = await import("../src/lure/context/Utils");

const tick = () => new Promise((r) => setTimeout(r, 5));

test("removeChild without lifecycle detaches immediately", async () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.append(child);
    await removeChild(parent, child);
    assert.equal(child.parentNode, null);
});

test("removeChild sets data-removing and waits getAnimations", async () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.append(child);
    let finished!: () => void;
    const done = new Promise<void>((resolve) => { finished = resolve; });
    child.getAnimations = () => [{ playState: "running", finished: done }];
    const pending = removeChild(parent, child);
    await tick();
    assert.equal(child.getAttribute("data-removing"), "");
    assert.equal(child.parentNode, parent);
    finished();
    await pending;
    assert.equal(child.parentNode, null);
});

test("cancel u2-before-remove leaves the node", async () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.append(child);
    child.addEventListener("u2-before-remove", (ev) => ev.preventDefault());
    await removeChild(parent, child);
    assert.equal(child.parentNode, parent);
});

test("replaceChildren awaits appendChild appear", async () => {
    const parent = document.createElement("div");
    const next = document.createElement("span");
    let hold!: () => void;
    const gate = new Promise<void>((resolve) => { hold = resolve; });
    next.getAnimations = () => [{ playState: "running", finished: gate }] as any;
    const pending = replaceChildren(parent, next, null, -1, null);
    await tick();
    assert.equal(next.parentNode, parent);
    let resolved = false;
    void pending.then(() => { resolved = true; });
    await tick();
    assert.equal(resolved, false);
    hold();
    await pending;
    assert.equal(resolved, true);
});

test("Mapped without options removes instantly", async () => {
    const items = observe(["a", "b"]);
    const list = document.createElement("ul");
    const mapped: any = M(items, (item: string) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
    }, { boundParent: list });
    mapped.elementForPotentialParent(list);
    await tick();
    items.splice(1, 1);
    await tick();
    assert.equal(list.children.length, 1);
});

test("Mapped disappear sets data-removing before detach", async () => {
    const items = observe(["a"]);
    const list = document.createElement("ul");
    let hold!: () => void;
    const gate = new Promise<void>((resolve) => { hold = resolve; });
    const mapped: any = M(items, (item: string) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.getAnimations = () => [{ playState: "running", finished: gate }];
        return li;
    }, { boundParent: list, disappear: { properties: { opacity: [1, 0] }, duration: 1 } });
    mapped.elementForPotentialParent(list);
    await tick();
    items.splice(0, 1);
    await tick();
    const row = list.querySelector("li");
    assert.ok(row);
    assert.equal(row?.getAttribute("data-removing"), "");
    hold();
    await tick();
    assert.equal(list.querySelector("li"), null);
});
