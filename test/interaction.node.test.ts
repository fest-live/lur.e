import assert from "node:assert/strict";
import test, { afterEach } from "node:test";

class FakeElement extends EventTarget {
    readonly dataset: Record<string, string> = {};
    readonly style = { setProperty() {}, removeProperty() {} };
    readonly captures = new Set<number>();
    #listeners = new Map<string, Set<EventListenerOrEventListenerObject>>();

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
        const listeners = this.#listeners.get(type) ?? new Set<EventListenerOrEventListenerObject>();
        listeners.add(listener);
        this.#listeners.set(type, listeners);
        super.addEventListener(type, listener, options);
    }

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void {
        this.#listeners.get(type)?.delete(listener);
        super.removeEventListener(type, listener, options);
    }

    listenerCount(type: string): number {
        return this.#listeners.get(type)?.size ?? 0;
    }

    clearListeners(): void {
        for (const [type, listeners] of this.#listeners) {
            for (const listener of listeners) {
                super.removeEventListener(type, listener);
            }
        }
        this.#listeners.clear();
    }

    contains(node: unknown): boolean {
        return node === this;
    }

    matches(): boolean {
        return false;
    }

    closest(): null {
        return null;
    }

    setPointerCapture(pointerId: number): void {
        this.captures.add(pointerId);
    }

    releasePointerCapture(pointerId: number): void {
        this.captures.delete(pointerId);
    }
}

class FakePointerEvent extends Event {
    readonly pointerId: number;
    readonly clientX: number;
    readonly clientY: number;
    readonly pointerType: string;

    constructor(type: string, init: Record<string, any> = {}) {
        super(type, { bubbles: init.bubbles ?? true, cancelable: init.cancelable ?? true });
        this.pointerId = init.pointerId ?? 0;
        this.clientX = init.clientX ?? 0;
        this.clientY = init.clientY ?? 0;
        this.pointerType = init.pointerType ?? "mouse";
    }
}

class FakeComposedEvent extends Event {
    constructor(type: string, readonly path: EventTarget[]) {
        super(type, { bubbles: true, cancelable: true });
    }

    composedPath(): EventTarget[] {
        return this.path;
    }
}

class FakeKeyboardEvent extends Event {
    constructor(readonly key: string) {
        super("keydown", { bubbles: true, cancelable: true });
    }
}

class SelectorElement extends FakeElement {
    constructor(private readonly selector: string) {
        super();
    }

    matches(value = ""): boolean {
        return value === this.selector;
    }

    closest(value = ""): SelectorElement | null {
        return this.matches(value) ? this : null;
    }
}

const root = new FakeElement();
(globalThis as any).document = { documentElement: root };
(globalThis as any).HTMLElement = FakeElement;
(globalThis as any).Node = FakeElement;
(globalThis as any).PointerEvent = FakePointerEvent;

const { LongPressHandler } = await import("../src/interactive/controllers/LongPress");
const { LongHoverHandler } = await import("../src/interactive/controllers/LongHover");
const { SwipeHandler } = await import("../src/interactive/controllers/Swipe");
const { lazyAddEventListener } = await import("../src/interactive/controllers/LazyEvents");
const { grabForDrag } = await import("../src/interactive/controllers/PointerAPI");
const { bindOutsideDismiss, makeClickOutsideTrigger, makeShiftTrigger } = await import("../src/interactive/controllers/Trigger");

afterEach(() => root.clearListeners());

test("LongPressHandler dispose removes its document listeners", () => {
    const holder = new FakeElement();
    const handler = new LongPressHandler(holder, { minHoldTime: 10, maxHoldTime: 20 });

    assert.equal(root.listenerCount("pointerdown"), 1);
    assert.equal(typeof (handler as any).dispose, "function");

    (handler as any).dispose();
    assert.equal(root.listenerCount("pointerdown"), 0);
    assert.equal(root.listenerCount("pointermove"), 0);
    assert.equal(root.listenerCount("pointerup"), 0);
    assert.equal(root.listenerCount("pointercancel"), 0);
});

test("LongHoverHandler dispose removes its document listeners", () => {
    const handler = new LongHoverHandler(new FakeElement(), { selector: ".target" });

    assert.equal(root.listenerCount("pointerover"), 1);
    assert.equal(typeof (handler as any).dispose, "function");

    (handler as any).dispose();
    assert.equal(root.listenerCount("pointerover"), 0);
    assert.equal(root.listenerCount("pointerdown"), 0);
    assert.equal(root.listenerCount("pointerout"), 0);
    assert.equal(root.listenerCount("pointerup"), 0);
    assert.equal(root.listenerCount("pointercancel"), 0);
});

test("SwipeHandler dispose removes its document listeners", () => {
    const holder = new FakeElement();
    const handler = new SwipeHandler(holder, { handler: holder, trigger() {} });

    assert.equal(root.listenerCount("pointerdown"), 1);
    assert.equal(typeof (handler as any).dispose, "function");

    (handler as any).dispose();
    assert.equal(root.listenerCount("pointerdown"), 0);
    assert.equal(root.listenerCount("pointermove"), 0);
    assert.equal(root.listenerCount("pointerup"), 0);
    assert.equal(root.listenerCount("pointercancel"), 0);
});

test("lazyAddEventListener keeps duplicate subscriptions alive until both unsubscribe", () => {
    const target = new FakeElement();
    let calls = 0;
    const handler = () => { calls++; };
    const first = lazyAddEventListener(target, "change", handler);
    const second = lazyAddEventListener(target, "change", handler);

    assert.equal(target.listenerCount("change"), 1);
    first();
    target.dispatchEvent(new Event("change"));
    assert.equal(calls, 1);

    second();
    assert.equal(target.listenerCount("change"), 0);
});

test("makeClickOutsideTrigger respects composed-path boundaries", () => {
    const surface = new FakeElement();
    const isOpen = { value: true };
    makeClickOutsideTrigger(isOpen, null, surface, { root, closeEvents: ["click"] });

    root.dispatchEvent(new FakeComposedEvent("click", [surface, root]));
    assert.equal(isOpen.value, true);

    root.dispatchEvent(new FakeComposedEvent("click", [new FakeElement(), root]));
    assert.equal(isOpen.value, false);
});

test("bindOutsideDismiss keeps composed exceptions and disposes root listeners", () => {
    const panel = new FakeElement();
    const anchor = new FakeElement();
    const selectorAnchor = new SelectorElement(".chrome-anchor");
    const outside = new FakeElement();
    const reasons: string[] = [];
    const dispose = bindOutsideDismiss({
        root,
        inside: panel,
        except: [anchor],
        exceptSelectors: [".chrome-anchor"],
        onDismiss: (reason) => { reasons.push(reason); },
    });

    root.dispatchEvent(new FakeComposedEvent("pointerdown", [panel, root]));
    root.dispatchEvent(new FakeComposedEvent("pointerdown", [anchor, root]));
    root.dispatchEvent(new FakeComposedEvent("pointerdown", [selectorAnchor, root]));
    assert.deepEqual(reasons, []);

    root.dispatchEvent(new FakeComposedEvent("pointerdown", [outside, root]));
    root.dispatchEvent(new FakeKeyboardEvent("Escape"));
    assert.deepEqual(reasons, ["outside", "escape"]);

    dispose();
    assert.equal(root.listenerCount("pointerdown"), 0);
    assert.equal(root.listenerCount("keydown"), 0);
});

test("bindOutsideDismiss accepts a custom containment predicate", () => {
    const panel = new FakeElement();
    const customInside = new FakeElement();
    const outside = new FakeElement();
    const reasons: string[] = [];
    const dispose = bindOutsideDismiss({
        root,
        inside: panel,
        isInside: (event) => event.composedPath().includes(customInside),
        onDismiss: (reason) => { reasons.push(reason); },
    });

    root.dispatchEvent(new FakeComposedEvent("pointerdown", [customInside, root]));
    root.dispatchEvent(new FakeComposedEvent("pointerdown", [outside, root]));
    assert.deepEqual(reasons, ["outside"]);
    dispose();
});

test("makeShiftTrigger waits for movement beyond its two-pixel threshold", () => {
    const holder = new FakeElement();
    let starts = 0;
    const trigger = makeShiftTrigger(() => { starts++; }, holder);

    trigger(new FakePointerEvent("pointerdown", { pointerId: 9, clientX: 10, clientY: 10 }));
    root.dispatchEvent(new FakePointerEvent("pointermove", { pointerId: 9, clientX: 12, clientY: 10 }));
    assert.equal(starts, 0);

    root.dispatchEvent(new FakePointerEvent("pointermove", { pointerId: 9, clientX: 13, clientY: 10 }));
    assert.equal(starts, 1);
});

test("grabForDrag marks a pointerup as completed rather than cancelled", async () => {
    const holder = new FakeElement();
    let endEvent: any = null;
    holder.addEventListener("m-dragend", (event) => { endEvent = event; });

    const result = grabForDrag(holder, new FakePointerEvent("pointerdown", { pointerId: 7 }));
    await Promise.resolve();
    holder.dispatchEvent(new FakePointerEvent("pointerup", { pointerId: 7 }));
    await result;

    assert.equal(endEvent?.canceled, false);
    assert.equal(holder.captures.has(7), false);
});

test("grabForDrag emits one cancelled terminal event and releases capture", async () => {
    const holder = new FakeElement();
    const endEvents: any[] = [];
    holder.addEventListener("m-dragend", (event) => { endEvents.push(event); });

    const result = grabForDrag(holder, new FakePointerEvent("pointerdown", { pointerId: 8 }));
    await Promise.resolve();
    assert.equal(holder.captures.has(8), true);

    holder.dispatchEvent(new FakePointerEvent("pointercancel", { pointerId: 8 }));
    holder.dispatchEvent(new FakePointerEvent("pointerup", { pointerId: 8 }));
    await result;

    assert.equal(endEvents.length, 1);
    assert.equal(endEvents[0]?.canceled, true);
    assert.equal(holder.captures.has(8), false);
});
