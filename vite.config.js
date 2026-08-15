/*
 * Filename: vite.config.js
 * FullPath: modules/projects/lur.e/vite.config.js
 * Change date and time: 21.00.00_15.08.2026
 * Reason for changes: Pass Vite `command` so serve keeps @fest-lib/* → src aliases
 * (otherwise demo imports resolve to dist/lure.js without named exports).
 * Demo port/origin come from shared initiate() — default :5173, no hardcoded :8434.
 */
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { defineConfig } from "vite";
import { initiate } from "../../shared/vite.config.js";

export const NAME = "lure";
export const __dirname = resolve(import.meta.dirname, "./");

export default defineConfig(async ({ command }) => {
    const tsconfig = JSON.parse(await readFile(resolve(__dirname, "./tsconfig.json"), { encoding: "utf8" }));
    return initiate(NAME, tsconfig, __dirname, command);
});
