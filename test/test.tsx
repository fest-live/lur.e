/**
 * LUR-E Demo / Quick Test
 *
 * This file provides a visual demo for quick testing.
 * For comprehensive tests, see test/index.ts and test/suites/*
 */

// @ts-ignore
import { observe, ref, numberRef } from "@fest-lib/object";
import {
    defineElement,
    GLitElement,
    property,
    S,
    E,
    H,
    M,
    animatable,
    cssVarRef,
    datasetRef,
    grabForDrag,
    refTrigger,
    lazyAddEventListener,
    makeClickOutsideTrigger,
    makeShiftTrigger,
} from "@fest-lib/lure";
import { Vector2D, vector2Ref, operated, magnitude2D } from "../src/utils/math/index";
import { appendAsUnderlying, appendAsOverlay } from "../src/design/layers/AnchorOverlay";

// ============================================================================
// Demo 1: Web Component with Reactive Properties
// ============================================================================
@defineElement("x-block")
export class XBlock extends GLitElement() {
    constructor(...args: any[]) { super(...args); }

    @property({ source: "attr" }) tetris = 1;
    @property() opacity = 1;

    // INVARIANT: GLitElementInstance.styles is public; keep visibility compatible.
    styles = function(this: XBlock) {
        return S`:host { opacity: ${this.opacity}; display: block; }`;
    }

    // INVARIANT: GLitElementInstance.render / onInitialize are public.
    render() {
        // Update opacity based on tetris value
        this.opacity = this.tetris;
        return H`<slot>`; // Return slot for child content
    }

    onInitialize(): any {
        super.onInitialize?.();
        return this;
    }
}

// ============================================================================
// Demo 2: Reactive Styling
// ============================================================================
const children = observe(["🎮 LUR-E Demo"]);
const style = observe({
    backgroundColor: "hsl(200, 70%, 35%)",
    color: "white",
    inlineSize: "200px",
    blockSize: "100px",
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    fontFamily: '"Fira Code", monospace',
    fontSize: "0.9em",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease"
});

// Create demo element
const demoBlock = (
    <x-block
        id="demo"
        class="demo-block"
        on:click={() => alert("🎉 LUR-E is working!")}
        style={style}
    >
        <span>{children}</span>
    </x-block>
);

// ============================================================================
// Demo 3: Reactive Vector Math
// ============================================================================
const position = vector2Ref(100, 100);
const velocity = vector2Ref(2, 1.5);

const speed = magnitude2D(velocity);
console.log("📐 Initial velocity magnitude:", speed.value);

// Physics update
const updatePhysics = () => {
    position.x.value += velocity.x.value;
    position.y.value += velocity.y.value;

    // Bounce off edges
    if (position.x.value > 300 || position.x.value < 0) velocity.x.value *= -1;
    if (position.y.value > 200 || position.y.value < 0) velocity.y.value *= -1;
};

// ============================================================================
// Demo 4: Reactive List
// ============================================================================
const items = observe(["Item A", "Item B", "Item C"]);
const listElement = H`
    <ul style="list-style: none; padding: 0; margin-top: 20px;">
        ${M(items, (item, i) => H`<li style="padding: 4px 8px; background: rgba(255,255,255,0.1); margin: 4px 0; border-radius: 4px;">📌 ${item}</li>`)}
    </ul>
`;

// ============================================================================
// Mount Demo
// ============================================================================
const container = H`
    <div style="padding: 20px; font-family: system-ui, sans-serif; color: #e0e0e0; min-height: 100vh; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
        <h1 style="margin: 0 0 20px 0; font-weight: 300;">🌀 LUR-E Demo</h1>
        ${demoBlock}
        <div id="vector-display" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
            Position: <span id="pos-x">${position.x.value}</span>, <span id="pos-y">${position.y.value}</span>
        </div>
        ${listElement}
        <p style="margin-top: 20px; font-size: 12px; opacity: 0.5;">
            For comprehensive tests, run: npm test or check test/index.ts
        </p>
    </div>
` as HTMLElement;

document.body.style.margin = "0";
document.body.append(container);

// ============================================================================
// Interactive Updates
// ============================================================================
let hue = 200;

// Color cycle on click
demoBlock.addEventListener?.("mouseenter", () => {
    hue = (hue + 30) % 360;
    style.backgroundColor = `hsl(${hue}, 70%, 40%)`;
    style.transform = "scale(1.05)";
});

demoBlock.addEventListener?.("mouseleave", () => {
    style.transform = "scale(1)";
});

// Add item on double-click
demoBlock.addEventListener?.("dblclick", () => {
    items.push(`Item ${String.fromCharCode(65 + items.length)}`);
    children[0] = `🎯 ${items.length} items`;
});

// Physics animation loop
const posXDisplay = container.querySelector("#pos-x");
const posYDisplay = container.querySelector("#pos-y");

const animate = () => {
    updatePhysics();
    if (posXDisplay) posXDisplay.textContent = position.x.value.toFixed(1);
    if (posYDisplay) posYDisplay.textContent = position.y.value.toFixed(1);
    requestAnimationFrame(animate);
};

animate();

// ============================================================================
// Demo 5: Underlying / Overlay layers smoke
// ============================================================================
const layerDemo = document.createElement("div");
layerDemo.style.cssText = "position:relative;margin:1rem 0;isolation:isolate;padding:8px;";
const mainEl = document.createElement("div");
mainEl.textContent = "Main (z=3) — under blur + overlay label";
mainEl.style.cssText =
    "position:relative;z-index:3;padding:1rem;background:#246;color:#fff;border-radius:12px;";
const underEl = document.createElement("div");
underEl.style.cssText =
    "background:rgba(255,200,0,.45);filter:blur(10px);border-radius:12px;";
const overEl = document.createElement("div");
overEl.textContent = "overlay";
overEl.style.cssText =
    "display:flex;align-items:end;justify-content:end;padding:4px;color:#6ee7b7;font:12px monospace;pointer-events:none;";
layerDemo.appendChild(mainEl);
container.appendChild(layerDemo);
appendAsUnderlying(mainEl, underEl, { stackMode: "shift" });
appendAsOverlay(mainEl, overEl, null, { stackMode: "shift", placement: "fill" });

console.log("✅ LUR-E Demo loaded successfully");

// animation testing
const withAnimatedStyle = () => {
    const opacity = animatable([0.5, 1], { duration: 1000, trigger: "hover", fill: "both" });
    return E("div", { style: S`opacity: ${opacity};inline-size:100px;block-size:100px;background:black;` }, "Hello");
}
container.appendChild(withAnimatedStyle()?.element);

// ============================================================================
// Demo 6: Interactive trigger lifecycle
// ============================================================================
const interactionDemo = document.createElement("section");
interactionDemo.style.cssText =
    "margin-top:1.25rem;padding:1rem;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(255,255,255,.06);";
const interactionTitle = document.createElement("h2");
interactionTitle.textContent = "Interactive triggers";
interactionTitle.style.cssText = "margin:0 0 .75rem;font-size:1rem;";

const panelToggle = document.createElement("button");
const panel = document.createElement("div");
const panelState = { value: true };
panelToggle.type = "button";
panel.style.cssText =
    "margin-top:.5rem;padding:.6rem .75rem;border-radius:8px;background:rgba(110,231,183,.14);outline:1px solid rgba(110,231,183,.4);";
panel.textContent = "Click outside this surface to dismiss it.";
const reflectPanelState = () => {
    panel.hidden = !panelState.value;
    panelToggle.textContent = panelState.value ? "Dismissible surface is open" : "Open dismissible surface";
};
makeClickOutsideTrigger(panelState, panelToggle, panel, {
    root: document.documentElement,
    closeEvents: ["pointerdown"],
});
lazyAddEventListener(document.documentElement, "pointerdown", () => queueMicrotask(reflectPanelState));
panelToggle.addEventListener("click", () => {
    panelState.value = !panelState.value;
    reflectPanelState();
});
reflectPanelState();

const dragStatus = document.createElement("p");
dragStatus.textContent = "Move the tile more than 2px to start dragging.";
dragStatus.style.cssText = "margin:.9rem 0 .4rem;font-size:.8rem;opacity:.8;";
const dragSurface = document.createElement("div");
dragSurface.style.cssText =
    "position:relative;block-size:8rem;border-radius:8px;background:rgba(0,0,0,.2);overflow:hidden;";
const dragTile = document.createElement("button");
dragTile.type = "button";
dragTile.textContent = "Threshold drag";
dragTile.style.cssText =
    "position:absolute;inset:3rem auto auto 1rem;padding:.5rem .75rem;border:0;border-radius:999px;background:#6ee7b7;color:#10231c;font-weight:700;cursor:grab;touch-action:none;";
const startThresholdDrag = makeShiftTrigger((downEvent: PointerEvent) => {
    dragStatus.textContent = "Drag started — m-dragstart dispatched.";
    grabForDrag(dragTile, downEvent).catch(console.warn);
}, dragTile);
dragTile.addEventListener("pointerdown", startThresholdDrag);
dragTile.addEventListener("m-dragging", (event) => {
    const [x = 0, y = 0] = (event as any).modified ?? [0, 0];
    dragTile.style.transform = `translate(${x}px, ${y}px)`;
    dragStatus.textContent = `Dragging: ${Math.round(x)}, ${Math.round(y)}`;
});
dragTile.addEventListener("m-dragend", (event) => {
    dragStatus.textContent = (event as any).canceled
        ? "Drag cancelled — pointer capture released."
        : "Drag completed — pointer capture released.";
    window.setTimeout(() => { dragTile.style.transform = ""; }, 300);
});
dragSurface.append(dragTile);
interactionDemo.append(interactionTitle, panelToggle, panel, dragStatus, dragSurface);
container.appendChild(interactionDemo);

// ============================================================================
// Demo 7: Link Trigger Core
// ============================================================================
const triggerCoreDemo = document.createElement("section");
triggerCoreDemo.style.cssText =
    "margin-top:1.25rem;padding:1rem;border:1px solid rgba(110,231,183,.35);border-radius:12px;background:rgba(110,231,183,.06);";
const triggerCoreTitle = document.createElement("h2");
triggerCoreTitle.textContent = "Link Trigger Core";
triggerCoreTitle.style.cssText = "margin:0 0 .75rem;font-size:1rem;";
const modifierButton = document.createElement("button");
modifierButton.type = "button";
modifierButton.textContent = "Once + prevent click";
const triggerCoreStatus = document.createElement("p");
triggerCoreStatus.style.cssText = "margin:.65rem 0;font:0.8rem ui-monospace,monospace;color:#9bb6df;";
let modifierCalls = 0;
E(modifierButton, {
    on: {
        click: [() => {
            modifierCalls++;
            triggerCoreStatus.textContent = `DOM modifier handler called: ${modifierCalls}`;
        }, { once: true, prevent: true }],
    },
});

const refButton = document.createElement("button");
refButton.type = "button";
refButton.textContent = "Emit reactive ref change";
const refState = numberRef(0);
let refCommits = 0;
refTrigger(refState, "value", { affectTypes: ["setter"], triggerImmediately: false })({
    source: null,
    ref: refState,
    linker: null,
    forProp: "value",
    reason: "initial",
    commit: () => {
        refCommits++;
        triggerCoreStatus.textContent = `Reactive trigger: value=${refState.value}, commits=${refCommits}`;
    },
});
refButton.addEventListener("click", () => { refState.value++; });
triggerCoreDemo.append(triggerCoreTitle, modifierButton, refButton, triggerCoreStatus);
container.appendChild(triggerCoreDemo);

// ============================================================================
// Demo 8: Explicit CSS / dataset links
// ============================================================================
const cssDomDemo = document.createElement("section");
cssDomDemo.style.cssText =
    "margin-top:1.25rem;padding:1rem;border:1px solid rgba(147,197,253,.35);border-radius:12px;background:rgba(147,197,253,.06);";
const cssDomTitle = document.createElement("h2");
cssDomTitle.textContent = "CSS DOM Links";
cssDomTitle.style.cssText = "margin:0 0 .75rem;font-size:1rem;";
const cssDomTarget = document.createElement("div");
cssDomTarget.style.cssText =
    "inline-size:var(--demo-width,8rem);block-size:2.5rem;display:grid;place-items:center;border-radius:8px;background:#60a5fa;color:#10213e;transition:inline-size 160ms ease;";
const cssDomStatus = document.createElement("p");
cssDomStatus.style.cssText = "margin:.65rem 0;font:0.8rem ui-monospace,monospace;color:#bfdbfe;";
const datasetState = datasetRef(cssDomTarget, "demoState");
const widthState = cssVarRef(cssDomTarget, "--demo-width");
datasetState.value = "initial";
widthState.value = "8rem";
const reflectCssDomStatus = () => {
    cssDomTarget.textContent = `data-demo-state: ${datasetState.value || "(empty)"}`;
    cssDomStatus.textContent = `dataset=${datasetState.value} · --demo-width=${widthState.value}`;
};
const mutateDataset = document.createElement("button");
mutateDataset.type = "button";
mutateDataset.textContent = "Mutate data-* from DOM";
mutateDataset.addEventListener("click", () => {
    cssDomTarget.setAttribute("data-demo-state", `dom-${Date.now() % 1000}`);
    queueMicrotask(reflectCssDomStatus);
});
const growCssVar = document.createElement("button");
growCssVar.type = "button";
growCssVar.textContent = "Update CSS var from ref";
growCssVar.addEventListener("click", () => {
    const width = (parseFloat(widthState.value || "8") || 8) + 1;
    widthState.value = `${width}rem`;
    queueMicrotask(reflectCssDomStatus);
});
reflectCssDomStatus();
cssDomDemo.append(cssDomTitle, mutateDataset, growCssVar, cssDomStatus, cssDomTarget);
container.appendChild(cssDomDemo);
