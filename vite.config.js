/*
 * Filename: vite.config.js
 * FullPath: modules/projects/lur.e/vite.config.js
 * Change date and time: 21.41.00_07.08.2026
 * Reason for changes: Call initiate(NAME) so dist emits lure.js, not subsystem.js.
 */
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { defineConfig } from "vite";
import { initiate } from "../../shared/vite.config.js";

export const NAME = "lure";
export const __dirname = resolve(import.meta.dirname, "./");

export default defineConfig(async () => {
    const tsconfig = JSON.parse(await readFile(resolve(__dirname, "./tsconfig.json"), { encoding: "utf8" }));
    return initiate(NAME, tsconfig, __dirname);
});
