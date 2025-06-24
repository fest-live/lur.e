import { makeObjectAssignable, makeReactive, subscribe } from "u2re/object";
import { redirectCell } from "u2re/dom";

//
export const reflectCell = async (newItem: any, pArgs: any, withAnimate = false)=>{ // @ts-ignore
    const layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
    const {item, list, items} = pArgs;
    await new Promise((r)=>requestAnimationFrame(r));
    subscribe?.(item, (state, property)=>{
        const gridSystem = newItem?.parentElement;
        layout[0] = parseInt(gridSystem?.style?.getPropertyValue?.("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem?.style?.getPropertyValue?.("--layout-r")) || layout[1];
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        if (item && !item?.cell) { item.cell = makeObjectAssignable(makeReactive([0, 0])); }; // @ts-ignore
        if (item && args) { const nc = redirectCell(item?.cell, args);
        if (nc[0] != item?.cell?.[0] || nc[1] != item?.cell?.[1]) { item.cell = nc; } }; // @ts-ignore
        if (property == "cell") { redirectCell(item?.cell, args); }
    });
}
