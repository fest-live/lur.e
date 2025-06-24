import { ref, subscribe } from "u2re/object";
import { reflectCell } from "./Reflect";
import { E } from "u2re/lure";
import { makeDragEvents } from "./Dragging";

// shifting - reactive basis
export const ROOT = document.documentElement;
export const bindInteraction = async (newItem: any, pArgs: any)=>{
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

    //
    subscribe([currentCell[0], "value"], (val)=> item.cell[0] = val);
    subscribe([currentCell[1], "value"], (val)=> item.cell[1] = val);
    makeDragEvents(newItem, {layout, currentCell, dragging}, {item, list, items});
    return currentCell;
}
