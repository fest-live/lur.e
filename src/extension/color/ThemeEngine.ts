import { dynamicNativeFrame, dynamicBgColors, dynamicTheme } from "./DynamicEngine.js";

//
export const colorScheme = async () => {
    dynamicNativeFrame();
    dynamicBgColors();
};

//
export default colorScheme;

//
if (typeof document != "undefined") {
    requestAnimationFrame(()=>colorScheme?.());
    dynamicTheme?.();
}
