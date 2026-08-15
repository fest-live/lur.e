/**
 * LUR-E Demo / Quick Test
 *
 * This file provides a visual demo for quick testing.
 * For comprehensive tests, see test/index.ts and test/suites/*
 */

// @ts-ignore
import { observe, ref, numberRef } from "@fest-lib/object";
import { defineElement, GLitElement, property, S, E, H, M, animatable } from "@fest-lib/lure";
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
