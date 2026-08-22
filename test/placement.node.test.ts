import assert from "node:assert/strict";
import test from "node:test";

const { placeOverlay, resolvePlacement } = await import("../src/design/anchor/Placement");
const { createFixedOverlayViewport } = await import("../../dom.ts/src/agate/Viewport");

const viewport = {
    left: 0,
    top: 0,
    right: 100,
    bottom: 80,
    width: 100,
    height: 80,
};

class FakeStyle {
    #values = new Map<string, string>();

    setProperty(name: string, value: string): void {
        this.#values.set(name, value);
    }

    getPropertyValue(name: string): string {
        return this.#values.get(name) ?? "";
    }

    removeProperty(name: string): void {
        this.#values.delete(name);
    }
}

class FakeOverlay {
    readonly style = new FakeStyle();

    getBoundingClientRect() {
        return { width: 30, height: 20 };
    }
}

test("createFixedOverlayViewport exposes client-coordinate bounds", () => {
    assert.deepEqual(createFixedOverlayViewport(320, 480, 12, 16), {
        left: 12,
        top: 16,
        right: 332,
        bottom: 496,
        width: 320,
        height: 480,
    });
});

test("resolvePlacement flips an element submenu before clamping it", () => {
    const result = resolvePlacement({
        origin: {
            type: "element",
            rect: { left: 80, top: 20, right: 90, bottom: 30, width: 10, height: 10 },
        },
        overlay: { width: 30, height: 20 },
        placement: "right-start",
        fallbacks: ["left-start"],
        gap: 4,
        margin: 8,
        viewport,
    });

    assert.equal(result.placement, "left-start");
    assert.equal(result.left, 46);
    assert.equal(result.top, 20);
});

test("resolvePlacement flips and clamps a point menu into the fixed overlay viewport", () => {
    const result = resolvePlacement({
        origin: { type: "point", x: 95, y: 75 },
        overlay: { width: 30, height: 20 },
        placement: "bottom-start",
        gap: 4,
        margin: 8,
        viewport,
    });

    assert.equal(result.placement, "top-end");
    assert.equal(result.left, 62);
    assert.equal(result.top, 51);
});

test("placeOverlay applies and disposes its JavaScript fallback styles", () => {
    const overlay = new FakeOverlay();
    const handle = placeOverlay(overlay as unknown as HTMLElement, {
        origin: { type: "point", x: 95, y: 75 },
        placement: "bottom-start",
        viewport,
        strategy: "js",
    });

    assert.equal(handle.strategy, "js");
    assert.equal(overlay.style.getPropertyValue("left"), "62px");
    assert.equal(overlay.style.getPropertyValue("top"), "51px");

    handle.dispose();
    assert.equal(overlay.style.getPropertyValue("left"), "");
    assert.equal(overlay.style.getPropertyValue("top"), "");
});

test("placeOverlay uses CSS anchors progressively for element origins", () => {
    const previousCss = (globalThis as any).CSS;
    (globalThis as any).CSS = { supports: () => true };
    try {
        const anchor = new FakeOverlay();
        const overlay = new FakeOverlay();
        const handle = placeOverlay(overlay as unknown as HTMLElement, {
            origin: { type: "element", element: anchor as unknown as HTMLElement },
            placement: "right-start",
            strategy: "auto",
        });

        assert.equal(handle.strategy, "css-anchor");
        assert.match(anchor.style.getPropertyValue("anchor-name"), /^--fest-placement-/);
        assert.equal(
            overlay.style.getPropertyValue("position-anchor"),
            anchor.style.getPropertyValue("anchor-name"),
        );
        assert.equal(overlay.style.getPropertyValue("position-area"), "right span-bottom");

        handle.dispose();
        assert.equal(anchor.style.getPropertyValue("anchor-name"), "");
        assert.equal(overlay.style.getPropertyValue("position-anchor"), "");
    } finally {
        if (previousCss === undefined) delete (globalThis as any).CSS;
        else (globalThis as any).CSS = previousCss;
    }
});

test("placeOverlay uses JavaScript when anchor fallbacks are unsupported", () => {
    const previousCss = (globalThis as any).CSS;
    (globalThis as any).CSS = {
        supports: (query: string) => !query.includes("position-try-fallbacks"),
    };
    try {
        const anchor = new FakeOverlay();
        const overlay = new FakeOverlay();
        const handle = placeOverlay(overlay as unknown as HTMLElement, {
            origin: { type: "element", element: anchor as unknown as HTMLElement },
            placement: "right-start",
            viewport,
            strategy: "auto",
        });

        assert.equal(handle.strategy, "js");
        assert.equal(overlay.style.getPropertyValue("position-anchor"), "");
        handle.dispose();
    } finally {
        if (previousCss === undefined) delete (globalThis as any).CSS;
        else (globalThis as any).CSS = previousCss;
    }
});
