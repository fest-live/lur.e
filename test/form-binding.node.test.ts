import assert from "node:assert/strict";
import test from "node:test";

class FakeControl extends EventTarget {
    isConnected = true;
    value = "";
    valueAsNumber = 0;
    checked = false;
    type = "select-one";
    name = "";
    dataset: Record<string, string> = {};

    matches(selector = ""): boolean {
        return selector.includes("select") || selector.includes("input");
    }
}

(globalThis as any).Node = FakeControl;
(globalThis as any).HTMLElement = FakeControl;
(globalThis as any).document = { documentElement: new FakeControl() };
(globalThis as any).MutationObserver = class {
    constructor(_callback: Function) {}
    observe() {}
    disconnect() {}
};

const { stringRef } = await import("@fest-lib/object");
const { bindFormControl, formRef } = await import("../src/lure/core/FormBinding");

const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

test("bindFormControl synchronizes a select and cleans up", async () => {
    const control = new FakeControl();
    const selected = stringRef("one");
    const dispose = bindFormControl(control, selected, "select", { connect: false });

    await tick();
    assert.equal(control.value, "one");
    control.value = "two";
    control.dispatchEvent(new Event("change"));
    await tick();
    assert.equal(selected.value, "two");

    dispose();
    control.value = "three";
    control.dispatchEvent(new Event("change"));
    await tick();
    assert.equal(selected.value, "two");
});

test("formRef chooses a type-compatible ref factory", () => {
    const select = new FakeControl();
    const selected = formRef(select, "select", { connect: false, initial: "alpha" });
    assert.equal(selected.value, "alpha");
    (selected as any)[Symbol.dispose]?.();
});
