import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, ".tmp-tests/linker");
const entry = resolve(root, "test/linker.node.test.ts");
const output = resolve(outDir, "linker.node.test.mjs");

await rm(outDir, { recursive: true, force: true });

await build({
    root,
    configFile: false,
    logLevel: "warn",
    resolve: {
        alias: [
            { find: "fest/core", replacement: resolve(root, "../core.ts/src/index.ts") },
            { find: "fest/dom", replacement: resolve(root, "test/stubs/dom.ts") },
            { find: "fest/object", replacement: resolve(root, "../object.ts/src/index.ts") },
            { find: "fest/lure", replacement: resolve(root, "src/index.ts") },
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
            fileName: () => "linker.node.test.mjs",
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
