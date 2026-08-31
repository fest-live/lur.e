/**
 * Bundle the OPFS content-store contract with source aliases, then run it via
 * Node's native test runner without needing a browser filesystem.
 */
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, ".tmp-tests/opfs-content-store");
const entry = resolve(root, "test/opfs-content-store.node.test.ts");
const output = resolve(outDir, "opfs-content-store.node.test.mjs");

await rm(outDir, { recursive: true, force: true });

try {
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
                { find: "@fest-lib/lure", replacement: resolve(root, "src/index.ts") }
            ]
        },
        build: {
            target: "esnext",
            minify: false,
            sourcemap: "inline",
            outDir,
            emptyOutDir: true,
            lib: {
                entry,
                formats: ["es"],
                fileName: () => "opfs-content-store.node.test.mjs"
            },
            rollupOptions: {
                external: [/^node:/]
            }
        }
    });

    const exitCode = await new Promise((resolveExit, rejectRun) => {
        const child = spawn(process.execPath, ["--test", output], {
            cwd: root,
            stdio: "inherit"
        });
        child.once("error", rejectRun);
        child.once("exit", (code, signal) => {
            if (signal) rejectRun(new Error(`node --test terminated by ${signal}`));
            else resolveExit(code ?? 1);
        });
    });

    if (exitCode !== 0) process.exitCode = exitCode;
} finally {
    await rm(outDir, { recursive: true, force: true });
}
