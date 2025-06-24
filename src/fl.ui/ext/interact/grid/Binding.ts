import { makeDragEvents } from "./Dragging";
import { makeObjectAssignable, makeReactive, ref, subscribe } from "u2re/object";
import { E } from "u2re/lure";
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
        if (item && !item?.cell) { item.cell = makeObjectAssignable(makeReactive([0, 0])); };
        if (item && args) { const nc = redirectCell(item?.cell, args); if (nc[0] != item?.cell?.[0] || nc[1] != item?.cell?.[1]) { item.cell = nc; } };
        if (property == "cell") { redirectCell(item?.cell, args); }
    });
}

// shifting - reactive basis
export const ROOT = document.documentElement;
export const bindInteraction = async (newItem: any, pArgs: any)=>{ // @ts-ignore
    //const { ref, subscribe } = await Promise.try(importCdn, ["u2re/object"]); // @ts-ignore
    //const { E } = await Promise.try(importCdn, ["u2re/lure"]);
    await new Promise((r)=>requestAnimationFrame(r));
    reflectCell(newItem, pArgs, true);

    //
    const {item, list, items} = pArgs, layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
    const dragging    = [ ref(0), ref(0) ];
    const currentCell = [ ref(item?.cell?.[0] || 0), ref(item?.cell?.[1] || 0) ];

    //
    E(newItem, { style: {
        "--cell-x": currentCell[0],
        "--cell-y": currentCell[1],
        "--drag-x": dragging[0],
        "--drag-y": dragging[1]
    } });
    subscribe([currentCell[0], "value"], (val)=> item.cell[0] = val);
    subscribe([currentCell[1], "value"], (val)=> item.cell[1] = val);
    makeDragEvents(newItem, {layout, currentCell, dragging}, {item, list, items});
    return currentCell;
}
