/**
 * Bundle the IDB filesystem handle tests, then run them with Node's test runner.
 */
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, ".tmp-tests/idb-fs");
const entry = resolve(root, "test/idb-fs.node.test.ts");
const output = resolve(outDir, "idb-fs.node.test.mjs");

await rm(outDir, { recursive: true, force: true });

try {
    await build({
        root,
        configFile: false,
        logLevel: "warn",
        resolve: {
            alias: [
                { find: "@fest-lib/core", replacement: resolve(root, "../core.ts/src/index.ts") },
                { find: "@fest-lib/uniform/mounted-fs", replacement: resolve(root, "../uniform.ts/src/newer/messaging/MountedFs.ts") }
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
                fileName: () => "idb-fs.node.test.mjs"
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
