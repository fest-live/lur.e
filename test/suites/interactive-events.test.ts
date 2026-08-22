/*
 * Filename: interactive-events.test.ts
 * FullPath: modules/projects/lur.e/test/suites/interactive-events.test.ts
 * Reason for changes: Cover browser-native event hubs and composed-path dismissal.
 */

import { lazyAddEventListener, makeClickOutsideTrigger } from "../../src/index";
import type { TestRunner as TestRunnerType } from "../index";

export function runInteractiveEventTests(TestRunner: typeof TestRunnerType) {
    if (typeof document === "undefined") return;

    TestRunner.setCategory("8.1 Interactive event lifecycle");
    const hubTarget = document.createElement("button");
    let calls = 0;
    const handler = () => { calls++; };
    const first = lazyAddEventListener(hubTarget, "click", handler);
    const second = lazyAddEventListener(hubTarget, "click", handler);

    first();
    hubTarget.click();
    TestRunner.assertEqual(calls, 1, "shared event hub retains a duplicate subscriber until its final cleanup");
    second();

    TestRunner.setCategory("8.2 Composed-path outside click");
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const surface = document.createElement("button");
    shadow.append(surface);
    document.body.append(host);

    const isOpen = { value: true };
    makeClickOutsideTrigger(isOpen, null, surface, {
        root: document.documentElement,
        closeEvents: ["click"],
    });

    surface.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    TestRunner.assertEqual(isOpen.value, true, "inside shadow-root click does not dismiss its surface");

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    TestRunner.assertEqual(isOpen.value, false, "outside click dismisses the surface");

    (isOpen as any)[Symbol.dispose]?.();
    host.remove();
}
