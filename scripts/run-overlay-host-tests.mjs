import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, ".tmp-tests/overlay-host");
const entry = resolve(root, "test/overlay-host.node.test.ts");
const output = resolve(outDir, "overlay-host.node.test.mjs");

await rm(outDir, { recursive: true, force: true });

await build({
    root,
    configFile: false,
    logLevel: "warn",
    resolve: {
        alias: [
            { find: "@fest-lib/core", replacement: resolve(root, "../core.ts/src/index.ts") },
            { find: "@fest-lib/dom", replacement: resolve(root, "test/stubs/interactive-dom.ts") },
            { find: "@fest-lib/style-lib", replacement: resolve(root, "../style.ts/src/index.ts") },
            { find: "@fest-lib/object", replacement: resolve(root, "../object.ts/src/index.ts") },
        ],
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
            fileName: () => "overlay-host.node.test.mjs",
        },
        rollupOptions: {
            treeshake: {
                moduleSideEffects: true,
            },
            external: [/^node:/],
        },
    },
});

await new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, ["--test", output], {
        cwd: root,
        stdio: "inherit",
    });
    child.once("error", rejectRun);
    child.once("exit", (code) => code === 0 ? resolveRun(undefined) : rejectRun(new Error(`node --test exited with ${code}`)));
});
