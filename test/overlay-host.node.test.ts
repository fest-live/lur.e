import assert from "node:assert/strict";
import test from "node:test";

const { closeHighestPriority, getActiveCloseable } = await import("../src/interactive/tasking/BackNavigation");
const { registerTransientOverlay, resolveOverlayHost } = await import("../src/design/overlays/OverlayHost");

test("resolveOverlayHost uses explicit, shell, app-layer, then body precedence", () => {
    const body = { id: "body" };
    const appLayer = { id: "app-layer" };
    const shellLayer = { id: "shell-layer" };
    const explicit = { id: "explicit" };
    const documentLike = {
        body,
        querySelector(selector: string) {
            if (selector === "[data-env-shell-overlays]") return shellLayer;
            if (selector === '[data-app-layer="overlay"]') return appLayer;
            return null;
        },
    };

    assert.equal(resolveOverlayHost({ document: documentLike as unknown as Document }), shellLayer);
    assert.equal(resolveOverlayHost({ host: explicit as unknown as HTMLElement, document: documentLike as unknown as Document }), explicit);

    const appOnlyDocument = {
        body,
        querySelector(selector: string) {
            return selector === '[data-app-layer="overlay"]' ? appLayer : null;
        },
    };
    assert.equal(resolveOverlayHost({ document: appOnlyDocument as unknown as Document }), appLayer);
    assert.equal(resolveOverlayHost({ document: { body, querySelector: () => null } as unknown as Document }), body);
});

test("registerTransientOverlay closes once and unregisters idempotently", () => {
    const element = {};
    let active = true;
    let closes = 0;
    const unregister = registerTransientOverlay({
        id: "overlay-host-test",
        kind: "context-menu",
        element: element as HTMLElement,
        isActive: () => active,
        close: () => {
            closes++;
            active = false;
            return true;
        },
    });

    assert.equal(getActiveCloseable()?.id, "overlay-host-test");
    assert.equal(closeHighestPriority()?.id, "overlay-host-test");
    assert.equal(closes, 1);

    unregister();
    unregister();
    assert.equal(getActiveCloseable(), null);
});

test("registerTransientOverlay closes nested modals in LIFO order", () => {
    const order: string[] = [];
    let outerActive = true;
    let innerActive = true;
    const disposeOuter = registerTransientOverlay({
        id: "outer-modal",
        kind: "modal",
        element: {} as HTMLElement,
        isActive: () => outerActive,
        close: () => {
            order.push("outer");
            outerActive = false;
            return true;
        },
    });
    const disposeInner = registerTransientOverlay({
        id: "inner-modal",
        kind: "modal",
        element: {} as HTMLElement,
        isActive: () => innerActive,
        close: () => {
            order.push("inner");
            innerActive = false;
            return true;
        },
    });

    assert.equal(closeHighestPriority()?.id, "inner-modal");
    assert.equal(closeHighestPriority()?.id, "outer-modal");
    assert.deepEqual(order, ["inner", "outer"]);
    disposeInner();
    disposeOuter();
});
