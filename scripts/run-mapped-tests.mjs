/*
 * Filename: run-mapped-tests.mjs
 * FullPath: modules/projects/lur.e/scripts/run-mapped-tests.mjs
 * Change date and time: 22.14.00_28.07.2026
 * Reason for changes: Bundle and run the Mapped mutation matrix with Node's native test runner.
 */

import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, ".tmp-tests/mapped");
const entry = resolve(root, "test/mapped.node.test.ts");
const output = resolve(outDir, "mapped.node.test.mjs");

await rm(outDir, { recursive: true, force: true });

await build({
    root,
    configFile: false,
    logLevel: "warn",
    resolve: {
        alias: [
            { find: "@fest-lib/core", replacement: resolve(root, "../core.ts/src/index.ts") },
            { find: "@fest-lib/dom", replacement: resolve(root, "../dom.ts/src/index.ts") },
            { find: "@fest-lib/style-lib", replacement: resolve(root, "../style.ts/src/index.ts") },
            { find: "@fest-lib/object", replacement: resolve(root, "../object.ts/src/index.ts") },
            { find: "@fest-lib/lure", replacement: resolve(root, "src/index.ts") },
            {
                find: resolve(root, "src/design/anchor/CSSAnimated.ts"),
                replacement: resolve(root, "test/stubs/css-animated.ts")
            }
        ]
    },
    build: {
        emptyOutDir: true,
        target: "esnext",
        minify: false,
        sourcemap: "inline",
        outDir,
        lib: {
            entry,
            formats: ["es"],
            fileName: () => "mapped.node.test.mjs"
        },
        rollupOptions: {
            external: [/^node:/, "jsdom"],
            treeshake: {
                moduleSideEffects: true
            }
        }
    }
});

await new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, ["--test", "--test-force-exit", output], {
        cwd: root,
        stdio: "inherit"
    });
    child.once("error", rejectRun);
    child.once("exit", (code) => code === 0
        ? resolveRun(undefined)
        : rejectRun(new Error(`node --test exited with ${code}`)));
});
