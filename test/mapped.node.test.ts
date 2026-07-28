/*
 * Filename: mapped.node.test.ts
 * FullPath: modules/projects/lur.e/test/mapped.node.test.ts
 * Change date and time: 22.12.00_28.07.2026
 * Reason for changes: Exercise Mapped mutations in a real DOM implementation.
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

const { observe, ref } = await import("fest/object");
const { M } = await import("../src/lure/node/Mapped");

const tick = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
};

const readItems = (list: HTMLElement): string[] =>
    Array.from(list.children).map((node) => node.textContent?.trim() || "");

const renderList = (items: any, options: any = null): HTMLElement => {
    const list = document.createElement("ul");
    const mappedOptions = options ? { ...options, boundParent: list } : null;
    const mapped: any = M(items, (item: string) => {
        const row = document.createElement("li");
        row.textContent = item;
        return row;
    }, mappedOptions);
    if (mappedOptions?.boundParent) {
        mapped.elementForPotentialParent(list);
    } else {
        list.append(mapped.element as Node);
        mapped.elementForPotentialParent(list);
    }
    return list;
};

test("Mapped preserves list contents through the mutation matrix", async () => {
    const items = observe(["A", "B", "C"]);
    const list = renderList(items);
    assert.deepEqual(readItems(list), ["A", "B", "C"]);

    items.push("D");
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C", "D"]);

    items.pop();
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C"]);

    items.splice(1, 0, "X");
    await tick();
    assert.deepEqual(readItems(list), ["A", "X", "B", "C"]);

    items.splice(1, 1);
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C"]);

    items[1] = "B2";
    await tick();
    assert.deepEqual(readItems(list), ["A", "B2", "C"]);

    items.reverse();
    await tick();
    assert.deepEqual(readItems(list), ["C", "B2", "A"]);

    items.splice(0, items.length, "R1", "R2", "R3", "R4");
    await tick();
    assert.deepEqual(readItems(list), ["R1", "R2", "R3", "R4"]);

    items.length = 0;
    await tick();
    assert.deepEqual(readItems(list), []);
});

test("Mapped updates when a ref replaces the entire source array", async () => {
    const source = ref(["old"], null);
    const list = renderList(source);
    assert.deepEqual(readItems(list), ["old"]);

    source.value = ["new-1", "new-2"];
    await tick();
    assert.deepEqual(readItems(list), ["new-1", "new-2"]);
});

test("Mapped renders and updates when bound to a parent at construction", async () => {
    const items = observe(["bound-a", "bound-b"]);
    const parent = document.createElement("ul");
    const mapped: any = M(items, (item: string) => {
        const row = document.createElement("li");
        row.textContent = item;
        return row;
    }, parent);

    await tick();
    assert.deepEqual(readItems(parent), ["bound-a", "bound-b"]);

    items.splice(0, 1, "bound-x");
    await tick();
    assert.deepEqual(readItems(parent), ["bound-x", "bound-b"]);

    mapped?.[Symbol.dispose]?.();
    assert.deepEqual(readItems(parent), []);
    items.push("after-dispose");
    await tick();
    assert.deepEqual(readItems(parent), []);
});

test("Mapped handles queue-preserving array mutations", async () => {
    const items = observe(["B", "C"]);
    const list = renderList(items);

    items.unshift("A");
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C"]);

    items.shift();
    await tick();
    assert.deepEqual(readItems(list), ["B", "C"]);

    items.sort();
    await tick();
    assert.deepEqual(readItems(list), ["B", "C"]);

    items.splice(0, items.length, "D", "C", "B", "A");
    await tick();
    items.sort();
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C", "D"]);
});

test("Mapped reconciles fill and copyWithin mutations", async () => {
    const items = observe(["A", "B", "C", "D"]);
    const list = renderList(items, { uniquePrimitives: false });

    items.fill("X", 1, 3);
    await tick();
    assert.deepEqual(readItems(list), ["A", "X", "X", "D"]);

    items.copyWithin(2, 0, 2);
    await tick();
    assert.deepEqual(readItems(list), ["A", "X", "A", "X"]);
});

test("Mapped tracks observable Map values through add, set, and delete", async () => {
    const source = observe(new Map([
        ["first", "A"],
        ["second", "B"]
    ]));
    const list = renderList(source);
    assert.deepEqual(readItems(list), ["A", "B"]);

    source.set("third", "C");
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C"]);

    source.set("second", "B2");
    assert.equal(source.get("second"), "B2");
    await tick();
    assert.deepEqual(readItems(list), ["A", "B2", "C"]);

    source.delete("first");
    await tick();
    assert.deepEqual(readItems(list), ["B2", "C"]);
});

test("Mapped preserves direct Map keys and duplicate primitive values", async () => {
    const source = observe(new Map([
        ["first", "A"],
        ["second", "A"]
    ]));
    const list = document.createElement("ul");
    const mapped: any = M(source, (value: string, key: string) => {
        const row = document.createElement("li");
        row.textContent = `${key}:${value}`;
        return row;
    }, { boundParent: list });

    await tick();
    assert.deepEqual(readItems(list), ["first:A", "second:A"]);

    source.set("first", "B");
    await tick();
    assert.deepEqual(readItems(list), ["first:B", "second:A"]);

    source.delete("second");
    await tick();
    assert.deepEqual(readItems(list), ["first:B"]);
    mapped?.[Symbol.dispose]?.();
});

test("Mapped preserves sibling position after an empty refill", async () => {
    const source = observe(["item"]);
    const parent = document.createElement("div");
    const before = document.createElement("i");
    before.textContent = "before";
    const after = document.createElement("i");
    after.textContent = "after";
    parent.append(before);

    const mapped: any = M(source, (value: string) => {
        const row = document.createElement("span");
        row.textContent = value;
        return row;
    });
    parent.append(mapped.element as Node);
    parent.append(after);
    mapped.elementForPotentialParent(parent);
    await tick();
    assert.deepEqual(readItems(parent), ["before", "item", "after"]);

    source.length = 0;
    await tick();
    assert.deepEqual(readItems(parent), ["before", "after"]);

    source.push("refilled");
    await tick();
    assert.deepEqual(readItems(parent), ["before", "refilled", "after"]);
});

test("Mapped binds an initially empty source when a parent is provided later", async () => {
    const source = observe<string[]>([]);
    const parent = document.createElement("div");
    const before = document.createElement("i");
    before.textContent = "before";
    const after = document.createElement("i");
    after.textContent = "after";
    parent.append(before);

    const mapped: any = M(source, (value: string) => {
        const row = document.createElement("span");
        row.textContent = value;
        return row;
    });
    parent.append(mapped.element as Node);
    parent.append(after);
    mapped.elementForPotentialParent(parent);
    assert.equal(mapped.boundParent, parent);

    source.push("late");
    await tick();
    assert.deepEqual(readItems(parent), ["before", "late", "after"]);
});

test("Mapped disposal disconnects a pending parent observer", async () => {
    const source = observe(["waiting"]);
    const parent = document.createElement("div");
    const mapped: any = M(source, (value: string) => {
        const row = document.createElement("span");
        row.textContent = value;
        return row;
    });

    mapped.elementForPotentialParent(parent);
    mapped[Symbol.dispose]();
    assert.equal(mapped.boundParent, null);
    parent.append(mapped.element as Node);
    source.push("after-dispose");
    await tick();
    assert.equal(mapped.boundParent, null);
    assert.deepEqual(readItems(parent), ["waiting"]);
});

test("Mapped prunes deleted Map entries before a same-key re-add", async () => {
    const source = observe(new Map([["key", "value"]]));
    const parent = document.createElement("div");
    let renderCount = 0;
    const mapped: any = M(source, (value: string) => {
        renderCount++;
        const row = document.createElement("span");
        row.textContent = value;
        return row;
    }, { boundParent: parent });

    await tick();
    const firstNode = parent.firstElementChild;
    assert.equal(renderCount, 1);

    source.delete("key");
    await tick();
    assert.deepEqual(readItems(parent), []);

    source.set("key", "value");
    await tick();
    assert.deepEqual(readItems(parent), ["value"]);
    assert.equal(renderCount, 2);
    assert.notEqual(parent.firstElementChild, firstNode);
    mapped?.[Symbol.dispose]?.();
});

test("Mapped tracks observable Set values through add and delete", async () => {
    const source = observe(new Set(["A", "B"]));
    const list = renderList(source);
    assert.deepEqual(readItems(list), ["A", "B"]);

    source.add("C");
    await tick();
    assert.deepEqual(readItems(list), ["A", "B", "C"]);

    source.delete("A");
    await tick();
    assert.deepEqual(readItems(list), ["B", "C"]);
});
