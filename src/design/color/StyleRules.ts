import { E, Q, localStorageRef } from "fest/lure";

//
export type StyleTuple = [selector: string, sheet: object];
export const updateThemeBase = async (originColor: string|null = null)=>{
    const primaryRef = localStorageRef("--primary", originColor);
    if (originColor != null && primaryRef.value != originColor) primaryRef.value = originColor;
    E(document.documentElement, { style: { "--primary": primaryRef } })
    return [primaryRef];
}
