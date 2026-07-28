/*
 * Filename: layers.test.ts
 * FullPath: modules/projects/lur.e/test/suites/layers.test.ts
 * Change date and time: 05.12.00_29.07.2026
 * Reason for changes: DOM order + stackMode assertions for underlying/overlay layers.
 */

import { resolveLayerZIndex } from "../../src/design/layers/stacking";
import { appendAsUnderlying, appendAsOverlay } from "../../src/design/layers/AnchorOverlay";
import type { TestRunner as TestRunnerType } from "../index";

export function runLayersTests(TestRunner: typeof TestRunnerType) {
    console.log("\nCHAPTER: Underlying / Overlay Layers\n");

    TestRunner.setCategory("layers.stackMode");
    const probe = document.createElement("div");
    probe.style.zIndex = "5";
    TestRunner.assertEqual(
        resolveLayerZIndex(probe, { role: "underlying", stackMode: "shift" }),
        4,
        "resolve shift underlying",
    );
    TestRunner.assertEqual(
        resolveLayerZIndex(probe, { role: "overlaying", stackMode: "shift" }),
        6,
        "resolve shift overlaying",
    );
    TestRunner.assertEqual(
        resolveLayerZIndex(probe, { role: "underlying", stackMode: "order-equal" }),
        5,
        "resolve order-equal matches main",
    );

    TestRunner.setCategory("layers.dom-order");
    const parent = document.createElement("div");
    const a = document.createElement("div");
    a.className = "a";
    const main = document.createElement("div");
    main.className = "main";
    main.style.zIndex = "5";
    const b = document.createElement("div");
    b.className = "b";
    parent.append(a, main, b);
    document.body.appendChild(parent);

    const under = document.createElement("div");
    under.className = "under";
    const over = document.createElement("div");
    over.className = "over";
    appendAsUnderlying(main, under, { stackMode: "shift" });
    appendAsOverlay(main, over, null, { stackMode: "shift" });

    const kids = [...parent.children];
    TestRunner.assertEqual(
        kids.indexOf(under),
        kids.indexOf(main) - 1,
        "underlying is immediately before main",
    );
    TestRunner.assertEqual(
        kids.indexOf(over),
        kids.indexOf(main) + 1,
        "overlaying is immediately after main",
    );
    TestRunner.assertEqual(under.style.zIndex, "4", "underlying z = main - 1");
    TestRunner.assertEqual(over.style.zIndex, "6", "overlaying z = main + 1");
    parent.remove();
}
