import { dynamicNativeFrame, dynamicBgColors, dynamicTheme } from "./DynamicEngine.js";

//
export const colorScheme = async () => {
    dynamicNativeFrame();
    dynamicBgColors();
};

//
export default colorScheme;

/**
 * Opt-in autostart only.
 * This module is re-exported from `fest/lure` root, so unconditional side effects
 * here can start a competing theme-color loop in host apps.
 */
export const maybeStartThemeEngine = () => {
    if (typeof document === "undefined") return;
    if ((globalThis as any)?.__LURE_AUTO_THEME_ENGINE__ !== true) return;
    requestAnimationFrame(() => colorScheme?.());
    dynamicTheme?.();
};

maybeStartThemeEngine();
