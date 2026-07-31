/*
 * Filename: StyleRules.ts
 * FullPath: modules/projects/lur.e/src/design/color/StyleRules.ts
 * Change date and time: 16.40.00_31.07.2026
 * Reason for changes: Bridge --primary → --color-primary / --base-color for veela/shell.
 */

import { E, localStorageRef } from "fest/lure";

//
export type StyleTuple = [selector: string, sheet: object];

/**
 * Set brand seed on `:root`. Prefer {@link applyThemeFromWallpaper} from `fest/image`
 * when the source is a wallpaper; this helper remains for manual / persisted overrides.
 */
export const updateThemeBase = async (originColor: string | null = null) => {
    const primaryRef = localStorageRef("--primary", originColor);
    if (originColor != null && primaryRef.value != originColor) primaryRef.value = originColor;
    const seed = String(primaryRef.value || originColor || "").trim();
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
    if (seed) {
        document.dispatchEvent(
            new CustomEvent("u2-theme-change", { detail: { source: "style-rules", primary: seed } })
        );
    }
    return [primaryRef];
};
