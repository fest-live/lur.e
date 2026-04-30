import test from "node:test";
import assert from "node:assert/strict";

class FakeNode extends EventTarget {
    isConnected = true;
    parentNode: any = null;
    children: any[] = [];
    contains(node: any) { return node === this; }
    append(...nodes: any[]) {
        for (const node of nodes) {
            node.parentNode = this;
            this.children.push(node);
        }
    }
    matches(_selector = "") { return false; }
    querySelector(selector = "") { return this.querySelectorAll(selector)[0] ?? null; }
    querySelectorAll(selector = "") {
        return this.children.flatMap((child) => [child, ...(child.querySelectorAll?.(selector) ?? [])]).filter((item) => {
            if (selector.includes("radio") && item.type != "radio") return false;
            if (selector.includes("checkbox") && item.type != "checkbox") return false;
            if (selector.includes(":checked") && !item.checked) return false;
            const nameMatch = selector.match(/\[name="([^"]+)"\]/);
            if (nameMatch && item.name != nameMatch[1]) return false;
            if (selector.includes("[name=") && !nameMatch) return false;
            return item instanceof FakeInput;
        });
    }
}

class FakeInput extends FakeNode {
    type = "text";
    value = "";
    valueAsNumber = 0;
    checked = false;
    attributes = new Map<string, string>();
    dataset: Record<string, any> = {};

    closest() { return this.parentNode ?? this; }
    matches(selector = "") {
        if (selector.includes("radio")) return this.type == "radio";
        if (selector.includes("checkbox")) return this.type == "checkbox";
        if (selector.includes(":checked")) return !!this.checked;
        if (selector == "input") return true;
        return true;
    }
    querySelector(selector = "") { return this.querySelectorAll(selector)[0] ?? null; }
    querySelectorAll(selector = "") {
        const all = [this, ...this.children.flatMap((child) => [child, ...(child.querySelectorAll?.(selector) ?? [])])];
        return all.filter((item) => {
            if (selector.includes("radio") && item.type != "radio") return false;
            if (selector.includes("checkbox") && item.type != "checkbox") return false;
            if (selector.includes(":checked") && !item.checked) return false;
            const nameMatch = selector.match(/\[name="([^"]+)"\]/);
            if (nameMatch && item.name != nameMatch[1]) return false;
            if (selector.includes("[name=") && !nameMatch) return false;
            return item instanceof FakeInput;
        });
    }
    scrollTo(options: any) {
        if (typeof options?.top == "number") (this as any).scrollTop = options.top;
        if (typeof options?.left == "number") (this as any).scrollLeft = options.left;
    }
    getAttribute(name: string) { return this.attributes.get(name) ?? null; }
    setAttribute(name: string, value: any) {
        this.attributes.set(name, String(value));
        FakeMutationObserver.flush(this, name);
    }
    removeAttribute(name: string) {
        this.attributes.delete(name);
        FakeMutationObserver.flush(this, name);
    }
}

class FakeMutationObserver {
    static observers: FakeMutationObserver[] = [];
    target: any = null;
    options: any = null;
    constructor(private callback: (records: any[]) => void) {
        FakeMutationObserver.observers.push(this);
    }
    observe(target: any, options: any) {
        this.target = target;
        this.options = options;
    }
    disconnect() {
        FakeMutationObserver.observers = FakeMutationObserver.observers.filter((observer) => observer !== this);
    }
    static flush(target: any, attributeName: string) {
        for (const observer of FakeMutationObserver.observers) {
            if (observer.target === target && (!observer.options?.attributeFilter || observer.options.attributeFilter.includes(attributeName))) {
                observer.callback([{ type: "attributes", attributeName, target }]);
            }
        }
    }
}

(globalThis as any).Node = FakeNode;
(globalThis as any).HTMLElement = FakeNode;
(globalThis as any).MutationObserver = FakeMutationObserver;
(globalThis as any).OffscreenCanvas = class {
    getContext() { return null; }
};
Object.getPrototypeOf(new Set().values()).map ??= function (callback: Function) {
    return Array.from(this).map((value, index) => callback(value, index));
};

const { getOrInsert: installUpsertPolyfills } = await import("../../core.ts/src/utils/Upsert");
installUpsertPolyfills(new Map(), "__upsert_polyfill__", () => null);

const { stringRef } = await import("fest/object");
const { attrLink, checkedLink, eventTrigger, makeLinker, radioValueLink, valueLink } = await import("../src/lure/core/Links");

const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

test("makeLinker wires source trigger, store, setter, and cleanup", async () => {
    const input = new FakeInput();
    input.value = "source";
    const ref = stringRef("ref");

    const linker = makeLinker<string>({
        source: input,
        ref,
        getter: ({ source }) => source.value,
        setter: (value, { source }) => { source.value = value; },
        trigger: eventTrigger("input"),
    }).bind();

    await tick();
    assert.equal(input.value, "ref");

    input.value = "from-source";
    input.dispatchEvent(new Event("input"));
    await tick();
    assert.equal(ref.value, "from-source");

    ref.value = "from-ref";
    await tick();
    assert.equal(input.value, "from-ref");

    linker.unbind();
    input.value = "after-unbind";
    input.dispatchEvent(new Event("input"));
    await tick();
    assert.equal(ref.value, "from-ref");
});

test("makeLinker can target ref properties other than value", async () => {
    const input = new FakeInput();
    input.value = "source";
    const ref: any = { text: "ref" };

    const linker = makeLinker<string>({
        source: input,
        ref,
        forProp: "text",
        getter: ({ source }) => source.value,
        setter: (value, { source }) => { source.value = value; },
        trigger: eventTrigger("input"),
    }).bind();

    await tick();
    assert.equal(input.value, "ref");

    input.value = "from-source";
    input.dispatchEvent(new Event("input"));
    await tick();
    assert.equal(ref.text, "from-source");

    ref.text = "from-ref";
    linker.set(ref.text, undefined, "text");
    await tick();
    assert.equal(input.value, "from-ref");

    linker.unbind();
});

test("valueLink keeps old signature while using Linker internals", async () => {
    const input = new FakeInput();
    input.value = "initial";
    const ref = stringRef(null as any);
    const cleanup = valueLink(input, ref);

    await tick();
    assert.equal(ref.value, "initial");

    input.value = "changed";
    input.dispatchEvent(new Event("input"));
    await tick();
    assert.equal(ref.value, "changed");

    ref.value = "written";
    await tick();
    assert.equal(input.value, "written");

    cleanup?.();
});

test("attrLink and checkedLink preserve compatibility", async () => {
    const div = new FakeInput();
    div.setAttribute("title", "before");
    const title = stringRef(null as any);
    const cleanupAttr = attrLink(div, title, "title");

    await tick();
    assert.equal(title.value, "before");

    div.setAttribute("title", "after");
    await tick();
    assert.equal(title.value, "after");
    cleanupAttr?.();

    const checkbox = new FakeInput();
    checkbox.type = "checkbox";
    checkbox.checked = true;
    const checked = { value: null as any };
    const cleanupChecked = checkedLink(checkbox, checked);

    await tick();
    assert.equal(checked.value, true);

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
    await tick();
    assert.equal(checked.value, false);
    cleanupChecked?.();
});

test("radioValueLink reflects checked radio value by group name", async () => {
    const group = new FakeNode();
    (group as any).matches = () => false;
    const a = new FakeInput();
    const b = new FakeInput();
    a.type = b.type = "radio";
    (a as any).name = (b as any).name = "choice";
    a.value = "a";
    b.value = "b";
    a.checked = true;
    group.append(a, b);

    const ref = stringRef(null as any);
    const cleanup = radioValueLink(group, ref, "choice");
    await tick();
    assert.equal(ref.value, "a");

    a.checked = false;
    b.checked = true;
    group.dispatchEvent(new Event("change"));
    await tick();
    assert.equal(ref.value, "b");

    ref.value = "a";
    await tick();
    assert.equal(a.checked, true);

    cleanup?.();
});
