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
            externalizeDeps: [ "externals", "dist", "u2re", "/externals", "/dist", "./externals", "./dist", "../" ],
            externals: { "externals": "externals", "dist": "dist", "u2re": "u2re", "u2re-src": "u2re-src" }
        }),
    ],
    resolve: {
        alias: {
            'u2re-src/': resolve(__dirname, '../'),
            'u2re/': resolve(__dirname, '/externals/modules/'),
            "u2re/cdnImport": resolve(__dirname, '../cdnImport.mjs'),
            "u2re/dom": resolve(__dirname, "../dom.ts/src/index.ts"),
            "u2re/lure": resolve(__dirname, "../BLU.E/src/index.ts"),
            "u2re/object": resolve(__dirname, "../object.ts/src/index.ts"),
            "u2re/uniform": resolve(__dirname, "../uniform.ts/src/index.ts"),
            "u2re/theme": resolve(__dirname, "../theme.core/src/index.ts"),
        },
    },
    server: {
        port: 5173,
        open: false,
        origin: "http://localhost:5173",
        fs: {
            allow: ['..', resolve(__dirname, '../') ]
        },
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
