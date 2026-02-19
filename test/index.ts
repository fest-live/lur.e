/**
 * LUR-E Test Suite
 *
 * Comprehensive test suite organized by categories/chapters:
 * 1. Math & Vectors - Point2D, Point3D, Point4D, Matrix operations
 * 2. Rectangle & Geometry - Rect2D, collision detection, transformations
 * 3. DOM & Node API - H, E, M functions, template parsing
 * 4. Reactive Refs - attrRef, valueRef, sizeRef, scrollRef, etc.
 * 5. Controllers & Extensions - Draggable, Resizable, Selection
 * 6. Integration - Combined reactive math + DOM examples
 */

// Test utilities
export const TestRunner = {
    passed: 0,
    failed: 0,
    categories: new Map<string, { passed: number; failed: number; tests: string[] }>(),

    currentCategory: "",

    setCategory(name: string) {
        this.currentCategory = name;
        if (!this.categories.has(name)) {
            this.categories.set(name, { passed: 0, failed: 0, tests: [] });
        }
    },

    assert(condition: boolean, testName: string, details?: string) {
        const cat = this.categories.get(this.currentCategory);
        if (condition) {
            this.passed++;
            if (cat) { cat.passed++; cat.tests.push(`✓ ${testName}`); }
            console.log(`  ✓ ${testName}`);
        } else {
            this.failed++;
            if (cat) { cat.failed++; cat.tests.push(`✗ ${testName}${details ? `: ${details}` : ""}`); }
            console.error(`  ✗ ${testName}${details ? `: ${details}` : ""}`);
        }
    },

    assertEqual<T>(actual: T, expected: T, testName: string) {
        const passed = actual === expected;
        this.assert(passed, testName, passed ? undefined : `Expected ${expected}, got ${actual}`);
    },

    assertApprox(actual: number, expected: number, tolerance: number, testName: string) {
        const passed = Math.abs(actual - expected) < tolerance;
        this.assert(passed, testName, passed ? undefined : `Expected ~${expected}, got ${actual}`);
    },

    assertThrows(fn: () => void, testName: string) {
        let threw = false;
        try { fn(); } catch { threw = true; }
        this.assert(threw, testName, threw ? undefined : "Expected function to throw");
    },

    summary() {
        console.log("\n" + "=".repeat(60));
        console.log("TEST SUMMARY");
        console.log("=".repeat(60));

        for (const [category, stats] of this.categories) {
            const total = stats.passed + stats.failed;
            const status = stats.failed === 0 ? "✓" : "✗";
            console.log(`\n${status} ${category}: ${stats.passed}/${total} passed`);
        }

        console.log("\n" + "-".repeat(60));
        const total = this.passed + this.failed;
        console.log(`TOTAL: ${this.passed}/${total} tests passed`);

        if (this.failed > 0) {
            console.log(`\n⚠ ${this.failed} test(s) failed!`);
        } else {
            console.log("\n🎉 All tests passed!");
        }
        console.log("=".repeat(60) + "\n");

        return this.failed === 0;
    },

    reset() {
        this.passed = 0;
        this.failed = 0;
        this.categories.clear();
        this.currentCategory = "";
    }
};

// Import all test modules
import { runMathTests } from "./suites/math.test";
import { runGeometryTests } from "./suites/geometry.test";
import { runDOMTests } from "./suites/dom.test";
import { runRefsTests } from "./suites/refs.test";
import { runIntegrationTests } from "./suites/integration.test";

// Main test runner
export async function runAllTests() {
    console.log("\n" + "=".repeat(60));
    console.log("LUR-E TEST SUITE");
    console.log("=".repeat(60) + "\n");

    TestRunner.reset();

    // Run all test categories
    runMathTests(TestRunner);
    runGeometryTests(TestRunner);
    runDOMTests(TestRunner);
    runRefsTests(TestRunner);
    runIntegrationTests(TestRunner);

    return TestRunner.summary();
}

// Auto-run if in browser context
if (typeof document !== "undefined") {
    // Create test output container
    const container = document.createElement("div");
    container.id = "test-output";
    container.style.cssText = `
        font-family: "JetBrains Mono", "Fira Code", monospace;
        font-size: 13px;
        padding: 20px;
        background: #1a1a2e;
        color: #e0e0e0;
        min-height: 100vh;
        white-space: pre-wrap;
    `;
    document.body.appendChild(container);

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const output: string[] = [];

    console.log = (...args) => {
        output.push(args.map(a => String(a)).join(" "));
        originalLog.apply(console, args);
    };
    console.error = (...args) => {
        output.push(`<span style="color:#ff6b6b">${args.map(a => String(a)).join(" ")}</span>`);
        originalError.apply(console, args);
    };

    // Run tests and display results
    runAllTests().then((success) => {
        container.innerHTML = output.join("\n").replace(/✓/g, '<span style="color:#4ecdc4">✓</span>').replace(/✗/g, '<span style="color:#ff6b6b">✗</span>');

        // Update page title with result
        document.title = success ? "✓ Tests Passed" : "✗ Tests Failed";
    });
}
