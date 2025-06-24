import { convertOrientPxToCX, bindDraggable, doAnimate, getBoundingOrientRect, orientOf, redirectCell, setProperty } from "u2re/dom";
import { makeShiftTrigger } from "../../interface/Trigger";
import { LongPressHandler } from "../../interface/LongPress";

//
export const makeDragEvents = async (newItem, {layout, dragging, currentCell}, {item, list, items})=>{ // @ts-ignore
    const $updateLayout = (newItem)=>{
        const gridSystem = newItem?.parentElement;
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];
        return layout;
    }

    //
    const setCellAxis = (cell, axis = 0)=> { if (currentCell?.[axis]?.value != cell?.[axis]) { try { currentCell[axis].value = cell[axis]; } catch(e){}; }; };
    const setCell = (cell)=>{ setCellAxis(cell, 0); setCellAxis(cell, 1); }
    const clamped = (CXa, layout): [number, number]=>[
        Math.max(Math.min(Math.floor(CXa[0]), layout[0]-1), 0),
        Math.max(Math.min(Math.floor(CXa[1]), layout[1]-1), 0)
    ];

    //
    const correctOffset = (dragging)=>{
        const gridSystem = newItem?.parentElement;
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel: [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        // compute correct cell
        const args = {layout: $updateLayout(newItem), size: [gridSystem?.clientWidth, gridSystem?.clientHeight]}; // @ts-ignore
        setCell(redirectCell(clamped(convertOrientPxToCX(rel, args, orientOf(gridSystem)), layout), args));

        //
        newItem.dataset.dragging = "";
        setProperty(newItem, "--p-cell-x", newItem.style.getPropertyValue("--cell-x") || 0);
        setProperty(newItem, "--p-cell-y", newItem.style.getPropertyValue("--cell-y") || 0);

        // reset dragging offset
        try { dragging[0].value = 0, dragging[1].value = 0; } catch(e) {};
        return [0, 0];
    };

    //
    const resolveDragging = (dragging) => {
        const gridSystem = newItem?.parentElement;
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect?.(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel : [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        // compute correct cell
        const args = {item, list, items, layout: $updateLayout(newItem), size: [gridSystem?.clientWidth, gridSystem?.clientHeight]}; // @ts-ignore
        const cell = redirectCell(clamped(convertOrientPxToCX(rel, args, orientOf(gridSystem)), layout), args);

        // set cell position and animate
        doAnimate(newItem, cell[0], "x", true)?.then?.(()=>setCellAxis(cell, 0));
        doAnimate(newItem, cell[1], "y", true)?.then?.(()=>setCellAxis(cell, 1));
        delete newItem.dataset.dragging; // unflag element dragging status

        // reset dragging coordinate
        try { dragging[0].value = 0, dragging[1].value = 0; } catch(e) {};
    };

    //
    const customTrigger = (doGrab)=>new LongPressHandler(newItem, {
        handler: "*",
        anyPointer: true,
        mouseImmediate: true,
        minHoldTime: 60 * 3600,
        maxHoldTime: 100
    }, makeShiftTrigger((ev)=>{correctOffset(dragging); doGrab?.(ev, newItem)}));;

    //
    return bindDraggable(customTrigger, resolveDragging, dragging);
};
