/*
 * Filename: StyleRules.ts
 * FullPath: modules/projects/lur.e/src/design/color/StyleRules.ts
 * Change date and time: 16.40.00_31.07.2026
 * Reason for changes: Bridge --primary → --color-primary / --base-color for veela/shell.
 */

import { E, localStorageRef, Q } from "@fest-lib/lure";
import { parse } from "culori";

//
export const isValidColor = (color: string): boolean => Boolean(parse(color));

//
export const registerColorProperty = (name: string, initialValue: string = "#5a9ec8")=>{
    try {
        CSS?.registerProperty?.({
            name,
            syntax: "<color>",
            inherits: true,
            initialValue,
        });
    } catch (error) {
        console.debug(error);
    }
}

/**
 * Set brand seed on `:root`. Prefer {@link applyThemeFromWallpaper} from `fest/image`
 * when the source is a wallpaper; this helper remains for manual / persisted overrides.
 */
export const updateThemeBase = async (originColor: string | null = null) => {
    const primaryRef = localStorageRef("--primary", originColor);
    if (originColor != null && primaryRef.value != originColor) primaryRef.value = originColor;
    const seed = String(primaryRef.value || originColor || "").trim();
    
    //
    if (!isValidColor(seed)) return;
    registerColorProperty("--color-primary", seed);
    registerColorProperty("--base-color", seed);
    registerColorProperty("--wf-md-primary", seed);
    registerColorProperty("--wf-md-seed", seed);
    E(document.documentElement, {
        style: {
            "--primary": primaryRef,
            ...(seed
                ? {
                      "--color-primary": seed,
                      "--base-color": seed,
                      "--wf-md-primary": seed,
                      "--wf-md-seed": seed,
                  }
                : {}),
        },
    });
    const globalQuery = Q("body, html, .wf-demo-root, ui-window, .view-explorer, [data-view='explorer'], .view-viewer, [data-view='viewer'], .view-settings, [data-view='settings'], .cw-network-view, .cw-network-view-host");
    globalQuery.style.setProperty("--color-primary", seed);
    globalQuery.style.setProperty("--base-color", seed);
    globalQuery.style.setProperty("--wf-md-primary", seed);
    globalQuery.style.setProperty("--wf-md-seed", seed);
    if (seed) {
        document.dispatchEvent(
            new CustomEvent("u2-theme-change", { detail: { source: "style-rules", primary: seed } })
        );
    }
    return [primaryRef];
};
