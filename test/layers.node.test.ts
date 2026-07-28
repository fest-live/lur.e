/*
 * Filename: layers.node.test.ts
 * FullPath: modules/projects/lur.e/test/layers.node.test.ts
 * Reason: Node-smoke for stacking rules (no fest alias / CSSOM dependency).
 *
 * Mirrors resolveLayerZIndex / defaultZIndexShift contracts from stacking.ts.
 */
import test from "node:test";
import assert from "node:assert/strict";

type LayerRole = "underlying" | "overlaying";
type StackMode = "shift" | "order-equal";

const defaultZIndexShift = (role: LayerRole): number =>
    role === "underlying" ? -1 : 1;

function resolveLayerZIndex(
    main: { style: { zIndex: string } },
    options: { role: LayerRole; stackMode?: StackMode; zIndexShift?: number },
): number | null {
    const role = options.role;
    const stackMode: StackMode = options.stackMode ?? "shift";
    const mainStyleZ = (main.style?.zIndex ?? "").trim();
    const mainIsAuto = !mainStyleZ || mainStyleZ === "auto";
    const mainZ = mainIsAuto ? 0 : Number(mainStyleZ) || 0;

    if (stackMode === "order-equal") {
        if (mainIsAuto) return null;
        return mainZ;
    }

    const shift = options.zIndexShift ?? defaultZIndexShift(role);
    return (mainIsAuto ? 0 : mainZ) + shift;
}

test("defaultZIndexShift signs", () => {
    assert.equal(defaultZIndexShift("underlying"), -1);
    assert.equal(defaultZIndexShift("overlaying"), 1);
});

test("resolveLayerZIndex shift / order-equal", () => {
    const main = { style: { zIndex: "5" } };
    assert.equal(resolveLayerZIndex(main, { role: "underlying", stackMode: "shift" }), 4);
    assert.equal(resolveLayerZIndex(main, { role: "overlaying", stackMode: "shift" }), 6);
    assert.equal(resolveLayerZIndex(main, { role: "underlying", stackMode: "order-equal" }), 5);
});

test("resolveLayerZIndex order-equal leaves auto unset", () => {
    const main = { style: { zIndex: "" } };
    assert.equal(resolveLayerZIndex(main, { role: "overlaying", stackMode: "order-equal" }), null);
    assert.equal(resolveLayerZIndex(main, { role: "overlaying", stackMode: "shift" }), 1);
});
