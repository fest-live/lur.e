/**
 * LUR-E Demo / Quick Test
 *
 * This file provides a visual demo for quick testing.
 * For comprehensive tests, see test/index.ts and test/suites/*
 */

// @ts-ignore
import { observe, ref, numberRef } from "fest/object";
import { defineElement, GLitElement, property, S, E, H, M } from "fest/lure";
import { Vector2D, vector2Ref, operated, magnitude2D } from "../src/math/index";

// ============================================================================
// Demo 1: Web Component with Reactive Properties
// ============================================================================
@defineElement("x-block")
export class XBlock extends GLitElement() {
    constructor(...args: any[]) { super(...args); }

    @property({ source: "attr" }) tetris = 1;
    @property() opacity = 1;

    protected styles = function(this: XBlock) {
        return S`:host { opacity: ${this.opacity}; display: block; }`;
    }

    protected render() {
        // Update opacity based on tetris value
        this.opacity = this.tetris;
        return H`<slot>`; // Return slot for child content
    }

    protected onInitialize(): any {
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

console.log("✅ LUR-E Demo loaded successfully");
