import assert from "node:assert/strict";
import test from "node:test";

const { numberRef } = await import("@fest-lib/object");
const { eventTrigger, makeLinker } = await import("../src/lure/core/Links");
const { bindTriggerHandlers, refTrigger, withTriggerModifiers } = await import("../src/lure/core/TriggerCore");

const wait = (ms = 0) => new Promise<void>((resolve) => setTimeout(resolve, ms));

test("withTriggerModifiers debounces and disposes a once trigger", async () => {
    const target = new EventTarget();
    let commits = 0;
    const trigger = withTriggerModifiers(eventTrigger("change"), { debounce: 5, once: true });
    const cleanup = trigger({
        source: target,
        ref: null,
        linker: null,
        forProp: "value",
        reason: "initial",
        commit: () => { commits++; },
    });

    target.dispatchEvent(new Event("change"));
    target.dispatchEvent(new Event("change"));
    await wait(15);
    assert.equal(commits, 1);

    target.dispatchEvent(new Event("change"));
    await wait(10);
    assert.equal(commits, 1);
    cleanup?.();
});

test("withTriggerModifiers prevents the source DOM event", () => {
    const target = new EventTarget();
    let commits = 0;
    const trigger = withTriggerModifiers(eventTrigger("submit"), { prevent: true, stop: true });
    const cleanup = trigger({
        source: target,
        ref: null,
        linker: null,
        forProp: "value",
        reason: "initial",
        commit: () => { commits++; },
    });
    const event = new Event("submit", { cancelable: true });
    target.dispatchEvent(event);

    assert.equal(event.defaultPrevented, true);
    assert.equal(commits, 1);
    cleanup?.();
});

test("eventTrigger accepts debounce and once modifiers in its options overload", async () => {
    const target = new EventTarget();
    let commits = 0;
    const cleanup = eventTrigger("change", { debounce: 5, once: true })({
        source: target,
        ref: null,
        linker: null,
        forProp: "value",
        reason: "initial",
        commit: () => { commits++; },
    });

    target.dispatchEvent(new Event("change"));
    assert.equal(commits, 0);
    target.dispatchEvent(new Event("change"));
    await wait(15);
    assert.equal(commits, 1);
    cleanup?.();
});

test("bindTriggerHandlers preserves handler lists and supports modifier tuples", () => {
    const target = new EventTarget();
    let plainCalls = 0;
    let modifiedCalls = 0;
    const cleanup = bindTriggerHandlers(target, {
        click: [
            () => { plainCalls++; },
            [() => { modifiedCalls++; }, { once: true, prevent: true }],
        ],
    });

    const first = new Event("click", { cancelable: true });
    target.dispatchEvent(first);
    target.dispatchEvent(new Event("click", { cancelable: true }));

    assert.equal(plainCalls, 2);
    assert.equal(modifiedCalls, 1);
    assert.equal(first.defaultPrevented, true);
    cleanup();
});

test("bindTriggerHandlers preserves EventListenerObject handlers", () => {
    const target = new EventTarget();
    let calls = 0;
    const cleanup = bindTriggerHandlers(target, {
        click: {
            handleEvent() { calls++; },
        } as EventListenerObject,
    });

    target.dispatchEvent(new Event("click"));
    assert.equal(calls, 1);
    cleanup();
});

test("refTrigger commits reactive setter changes and stops after cleanup", async () => {
    const source = numberRef(0);
    let commits = 0;
    const cleanup = refTrigger(source, "value", { affectTypes: ["setter"], triggerImmediately: false })({
        source: null,
        ref: source,
        linker: null,
        forProp: "value",
        reason: "initial",
        commit: () => { commits++; },
    });

    source.value = 1;
    await wait();
    assert.equal(commits, 1);

    cleanup?.();
    source.value = 2;
    await wait();
    assert.equal(commits, 1);
});

test("refTrigger drives makeLinker through the shared LinkTrigger contract", async () => {
    const refValue = numberRef(0);
    const source = { value: 42 };
    const linker = makeLinker<number>({
        source,
        ref: refValue,
        getter: ({ source: current }) => current.value,
        trigger: refTrigger(refValue, "value", { affectTypes: ["setter"], triggerImmediately: false }),
    }).bind();

    refValue.value = 1;
    await wait();
    assert.equal(refValue.value, 42);
    linker.unbind();
});
