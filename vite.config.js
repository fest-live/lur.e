import {resolve} from "node:path";
import createExternal from "vite-plugin-external";
import { compression } from 'vite-plugin-compression2';
import optimizer from 'vite-plugin-optimizer';
import { plugins } from "./rollup/rollup.config.js"
import civetVitePlugin from '@danielx/civet/vite'

//
export const NAME = "blue"; // TODO! rename to lure
export const __dirname = resolve(import.meta.dirname, "./");
export default {
    plugins: [
        optimizer({}),
        compression(),
        createExternal({
            interop: 'auto',
            externalizeDeps: [ "externals", "dist", "/externals", "/dist", "./externals", "./dist" ],
            externals: { "externals": "externals", "dist": "dist" }
        }),
    ],
    server: {
        port: 5173,
        open: false,
        origin: "http://localhost:5173",
    },
    build: {
        //chunkSizeWarningLimit: 1600,
        //assetsInlineLimit: 1024 * 1024,
        minify: false,///"terser",
        emptyOutDir: true,
        sourcemap: 'hidden',
        target: "esnext",
        name: NAME,
        lib: {
            formats: ["es"],
            entry: resolve(__dirname, './src/index.ts'),
            name: NAME,
            fileName: NAME,
        },
        rollupOptions: {
            plugins,
            treeshake: 'smallest',
            input: "./src/index.ts",
            external: (source) => {
                if (source.startsWith("/externals")) return true;
                return false;
            },
            output: {
                compact: true,
                globals: {},
                format: 'es',
                name: NAME,
                dir: './dist',
                exports: "auto"
            }
        }
    }
};
