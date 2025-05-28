import {resolve} from "node:path";
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';


import { readFile } from "node:fs/promises";

//
export const NAME = "blue"; // TODO! rename to lure
export const __dirname = resolve(import.meta.dirname, "../");
export const terserOptions = {
    ecma: 2020,
    keep_classnames: false,
    keep_fnames: false,
    module: true,
    toplevel: true,
    mangle: {
        eval: true,
        keep_classnames: false,
        keep_fnames: false,
        module: true,
        toplevel: true,
        properties: {
            builtins: true,
            keep_quoted: "strict",
            undeclared: true,
            only_annotated: true,
            reserved: ["register", "resolve", "reject", "undefined"]
        }
    },
    compress: {
        ecma: 2020,
        keep_classnames: false,
        keep_fnames: false,
        keep_infinity: false,
        reduce_vars: true,
        reduce_funcs: true,
        pure_funcs: [],
        arguments: true,
        expression: true,
        inline: 3,
        module: true,
        passes: 3,
        side_effects: true,
        pure_getters: true,
        typeofs: true,
        toplevel: true,
        unsafe: true,
        unsafe_Function: true,
        unsafe_comps: true,
        unsafe_arrows: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_undefined: true,
        unsafe_methods: true,
        unsafe_regexp: true,
        unsafe_proto: true,
        warnings: true,
        unused: true,
        booleans_as_integers: true,
        hoist_funs: true,
        hoist_vars: true,
        properties: true,
        // don't use in debug mode
        //drop_console: true
    },
    format: {
        braces: false,
        comments: false,
        ecma: 2020,
        //indent_level: 0,
        semicolons: true,
        shebang: true,
        inline_script: true,
        quote_style: 0,
        wrap_iife: true,
        ascii_only: true,
    }
};

//
const tsconfig = await readFile(resolve(__dirname, "./tsconfig.json"), {encoding: "utf8"});
export const plugins = [
    terser(terserOptions),
];
