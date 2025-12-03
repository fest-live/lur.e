import { RAFBehavior, orientOf, getBoundingOrientRect, setStyleProperty } from "fest/dom";
import { makeObjectAssignable, makeReactive, subscribe, numberRef } from "fest/object";
import { LongPressHandler, makeShiftTrigger, E, bindDraggable } from "fest/lure";
import { convertOrientPxToCX, redirectCell, floorNearest, ceilNearest, roundNearest } from "fest/core";
import type { GridArgsType as GridArgsType, GridItemType } from "fest/core";

//
[   // @ts-ignore
    { name: "--drag-x", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--drag-y", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--grid-r", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--grid-c", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--resize-x", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--resize-y", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--shift-x", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--shift-y", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--cs-grid-r", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--cs-grid-c", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--cs-transition-r", syntax: "<length-percentage>", inherits: false, initialValue: "0px" },
    { name: "--cs-transition-c", syntax: "<length-percentage>", inherits: false, initialValue: "0px" },
    { name: "--cs-p-grid-r", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--cs-p-grid-c", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--os-grid-r", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--os-grid-c", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--rv-grid-r", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--rv-grid-c", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--cell-x", syntax: "<number>", inherits: false, initialValue: "0" },
    { name: "--cell-y", syntax: "<number>", inherits: false, initialValue: "0" },
].forEach((options: any) => {
    if (typeof CSS != "undefined") {
        try { CSS?.registerProperty?.(options); } catch (e) { console.warn(e); }
    }
});

//
//const setStyleProperty = (item, prop, value) => {
    /*if (value == null || item?.style?.getPropertyValue?.(prop) === String(value)) { return; }
    return item?.style?.setProperty?.(prop, value);*/
//}

//
//const computed = Symbol("@computed");
const depAxis  = (axis: string = "x")=>{ const m = /*matchMedia("(orientation: portrait)").matches*/true; return {["x"]: m?"c":"r", ["y"]: m?"r":"c"}[axis]; }
const swapped  = (axis: string = "x")=>{ const m = matchMedia("(orientation: portrait)").matches; return {["x"]: m?"x":"y", ["y"]: m?"y":"x"}[axis]; }

// DragCoord
export const animationSequence = (DragCoord = 0, axis = "x") => {
    const drag = "--drag-" + axis;
    const axisKey = depAxis(axis);
    const rvProp = `--rv-grid-${axisKey}`;
    const gridProp = `--cs-grid-${axisKey}`;
    const prevGridProp = `--cs-p-grid-${axisKey}`;
    return [
        { [rvProp]: `var(${prevGridProp})`, [drag]: DragCoord }, // starting...
        { [rvProp]: `var(${gridProp})`, [drag]: 0 }
    ];
};

//
export const doAnimate = async (newItem, axis: any = "x", animate = false, signal?: AbortSignal)=>{

    //
    //setProperty(newItem, "--cs-p-offset-" + swp, `${newItem?.[{"x": "offsetLeft", "y": "offsetTop"}[swp as any]] || 0}px`);
    //const oldOffset = `${newItem?.[{"x": "offsetLeft", "y": "offsetTop"}[swp as any]] || 0}px`;
    //setProperty(newItem, "--cs-p-grid-" + depAxis(axis), oldValue);
    const dragCoord = parseFloat(newItem?.style?.getPropertyValue?.("--drag-" + axis) || "0") || 0;

    //
    if (!animate) { await new Promise((r)=>requestAnimationFrame(r)); };

    //
    const animation = animate && !matchMedia("(prefers-reduced-motion: reduce)")?.matches ? newItem.animate(animationSequence(dragCoord, axis), {
        fill: "none",
        duration: 200,
        //duration: 150,
        easing: "linear"
    }) : null;

    //
    let shifted = false;
    const onShift: [any, any] = [(ev)=>{
        if (!shifted) {
            shifted = true;
            animation?.finish?.();
        }

        //
        newItem?.removeEventListener?.("m-dragstart", ...onShift);
        signal?.removeEventListener?.("abort", ...onShift);
    }, {once: true}];

    // not fact, but for animation
    signal?.addEventListener?.("abort", ...onShift);
    newItem?.addEventListener?.("m-dragstart", ...onShift);
    //await new Promise((r)=>requestAnimationFrame(r));
    return animation?.finished?.catch?.(console.warn.bind(console));
    //if (!shifted) { onShift?.[0]?.(); } // commit dragging result
}



//
export const reflectCell = async (newItem: HTMLElement, pArgs: GridArgsType, withAnimate = false): Promise<void> => {
    const layout: [number, number] = [(pArgs?.layout as any)?.columns || pArgs?.layout?.[0] || 4, (pArgs?.layout as any)?.rows || pArgs?.layout?.[1] || 8];
    const {item, list, items} = pArgs;
    await new Promise((r)=>queueMicrotask(()=>r(true)));
    return subscribe?.(item, (state, property)=>{
        const gridSystem = newItem?.parentElement;
        layout[0] = parseInt(gridSystem?.getAttribute?.("data-grid-columns") || "4") || layout[0];
        layout[1] = parseInt(gridSystem?.getAttribute?.("data-grid-rows") || "8") || layout[1];
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        if (item && !item?.cell) { item.cell = makeObjectAssignable(makeReactive([0, 0])); }; // @ts-ignore
        if (property == "cell") {
            const nc = redirectCell(item?.cell || [0, 0], args as GridArgsType);
            if (nc[0] != item?.cell?.[0] && item?.cell) { item.cell[0] = nc?.[0]; }
            if (nc[1] != item?.cell?.[1] && item?.cell) { item.cell[1] = nc?.[1]; }
            setStyleProperty(newItem, "--p-cell-x", nc?.[0]);
            setStyleProperty(newItem, "--p-cell-y", nc?.[1]);
            setStyleProperty(newItem, "--cell-x", nc?.[0]);
            setStyleProperty(newItem, "--cell-y", nc?.[1]);
        }
    });
}

//
const clampCell = (CXa: [number, number], layout: [number, number]): [number, number] => [
    Math.max(Math.min(CXa?.[0], (layout?.[0] || 1)-1), 0),
    Math.max(Math.min(CXa?.[1], (layout?.[1] || 1)-1), 0)
];

//
const floorCell = (CXa: [number, number], N = 1): [number, number] => [
    floorNearest(CXa?.[0] || 0, N),
    floorNearest(CXa?.[1] || 0, N)
];

//
const ceilCell = (CXa: [number, number], N = 1): [number, number] => [
    ceilNearest(CXa?.[0] || 0, N),
    ceilNearest(CXa?.[1] || 0, N)
];

//
const roundCell = (CXa: [number, number], N = 1): [number, number] => [
    roundNearest(CXa?.[0] || 0, N),
    roundNearest(CXa?.[1] || 0, N)
];

//
export const makeDragEvents = async (
    newItem: HTMLElement,
    { layout, dragging, currentCell, syncDragStyles }: {
        layout: [number, number],
        dragging: [any, any],
        currentCell: [any, any],
        syncDragStyles: (flush: boolean) => void
    },
    { item, items, list }: {
        item: GridItemType,
        items: Map<string, GridItemType> | Set<GridItemType> | GridItemType[],
        list: Set<string> | string[]
    }): Promise<{ dispose: () => void, draggable: any, process: (ev: MouseEvent, el: HTMLElement) => Promise<unknown> } | undefined> => {

    //
    const $updateLayout = (newItem: HTMLElement): [number, number] => {
        const gridSystem = newItem?.parentElement as HTMLElement | null;
        if (!gridSystem) { return layout; }
        layout[0] = parseInt(gridSystem.getAttribute?.("data-grid-columns") as string || "4") || layout[0];
        layout[1] = parseInt(gridSystem.getAttribute?.("data-grid-rows") as string || "8") || layout[1];
        return layout;
    };

    //
    const getSpanOffset = (bounds: DOMRect | null, layoutSnapshot: [number, number] | null, size: [number, number] | null, orient: number | null): [number, number] => {
        if (!bounds || !layoutSnapshot || !size || orient == null) { return [0, 0]; }
        const safeLayout: [number, number] = [
            Math.max(layoutSnapshot?.[0] || 0, 1),
            Math.max(layoutSnapshot?.[1] || 0, 1)
        ];
        const orientedSize: [number, number] = orient % 2 ? [size?.[1] || 1, size?.[0] || 1] : [size?.[0] || 1, size?.[1] || 1];
        const cellSize: [number, number] = [
            (orientedSize[0] || 1) / safeLayout[0],
            (orientedSize[1] || 1) / safeLayout[1]
        ];
        const spanX = Math.max((bounds?.width || cellSize[0]) / (cellSize[0] || 1), 1);
        const spanY = Math.max((bounds?.height || cellSize[1]) / (cellSize[1] || 1), 1);
        return [(spanX - 1) / 2, (spanY - 1) / 2];
    };

    //
    const computeCellFromBounds = (): { inset?: [number, number], cell?: [number, number] } | null => {
        const gridSystem = newItem?.parentElement as HTMLElement | null;
        if (!gridSystem) { return null; }

        //
        const orient = orientOf(gridSystem);
        const cbox = getBoundingOrientRect(newItem, orient) ?? newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect(gridSystem, orient) ?? gridSystem?.getBoundingClientRect?.();
        if (!cbox || !pbox) { return null; }

        //
        const layoutSnapshot = [...$updateLayout(newItem)] as [number, number];
        const parentRect = gridSystem.getBoundingClientRect?.();
        const gridSize: [number, number] = [
            gridSystem?.clientWidth || gridSystem?.offsetWidth || parentRect?.width || 1,
            gridSystem?.clientHeight || gridSystem?.offsetHeight || parentRect?.height || 1
        ];
        const inset: [number, number] = [
            //(cbox.left - pbox.left),
            //(cbox.top - pbox.top)
            (((cbox.left + cbox.right) / 2) - pbox.left),
            (((cbox.top + cbox.bottom) / 2) - pbox.top)
        ];
        const args = { item, items, list, layout: layoutSnapshot as [number, number], size: gridSize };
        const spanOffset = getSpanOffset(cbox as unknown as DOMRect, layoutSnapshot as [number, number], gridSize, orient);
        const projected = convertOrientPxToCX(inset, args, orient);
        projected[0] -= spanOffset[0];
        projected[1] -= spanOffset[1];
        return {
            inset: [inset[0] - dragging?.[0]?.value, inset[1] - dragging?.[1]?.value],
            cell: clampCell(redirectCell(floorCell(projected as [number, number]), args), layoutSnapshot as [number, number])
        } as { inset?: [number, number], cell?: [number, number] };
    };

    //
    const setCellAxis = (cell: [number, number] | null, axis = 0): void => {
        if (!cell) { return; }
        if (currentCell?.[axis]?.value != cell?.[axis]) {
            try { currentCell[axis].value = cell[axis]; } catch(e){};
        };
    };

    //
    const setCell = (cell: [number, number]): void => {
        const args = {item, items, list, layout, size: [newItem?.clientWidth || 0, newItem?.clientHeight || 0] as [number, number]};
        cell = clampCell(redirectCell(cell, args as GridArgsType), layout as [number, number]);
        setCellAxis(cell, 0); setCellAxis(cell, 1);
    };

    //
    const syncInsetVars = (inset?: [number, number]): void => {
        if (!inset) { return; }
        setStyleProperty(newItem, "--cs-inset-x", `${inset[0] || 0}px`);
        setStyleProperty(newItem, "--cs-inset-y", `${inset[1] || 0}px`);
    };

    //
    const correctOffset = (dragging: [any, any]): [number, number] => {
        // compute correct cell with span awareness
        const ctx = computeCellFromBounds() as { inset: [number, number], cell: [number, number] } | null;
        const cell = ctx?.cell;

        //
        if (cell) {
            syncInsetVars((ctx?.inset || [0, 0]) as [number, number]); setCell(cell);
            setStyleProperty(newItem, "--p-cell-x", cell?.[0] ?? currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
            setStyleProperty(newItem, "--p-cell-y", cell?.[1] ?? currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
            setStyleProperty(newItem, "--cell-x", cell?.[0] ?? currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
            setStyleProperty(newItem, "--cell-y", cell?.[1] ?? currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
        }

        // reset dragging offset
        if (dragging && Array.isArray(dragging)) {
            try { dragging[0].value = 0, dragging[1].value = 0; } catch (e) { };
        }
        syncDragStyles?.(true); newItem?.setAttribute?.("data-dragging", "");
        return [0, 0];
    };

    //
    const resolveDragging = (dragging: [any, any]): [number, number] => {
        // compute correct cell
        const ctx = computeCellFromBounds() as { inset: [number, number], cell: [number, number] } | null;
        const cell = ctx?.cell;

        //
        setStyleProperty(newItem, "--p-cell-x", currentCell?.[0]?.value ?? item?.cell?.[0] ?? cell?.[0]);
        setStyleProperty(newItem, "--p-cell-y", currentCell?.[1]?.value ?? item?.cell?.[1] ?? cell?.[1]);
        syncDragStyles?.(true);

        //
        if (cell) {
            setCell(cell);
            setStyleProperty(newItem, "--cell-x", cell?.[0] ?? currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
            setStyleProperty(newItem, "--cell-y", cell?.[1] ?? currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
        }

        //
        const animations = [
            doAnimate(newItem, "x", true),
            doAnimate(newItem, "y", true)
        ];

        //
        Promise.allSettled(animations).finally(()=>{
            if (dragging && Array.isArray(dragging)) {
                try { dragging[0].value = 0, dragging[1].value = 0; } catch (e) { };
            }

            //
            syncDragStyles?.(true);

            //
            if (cell) {
                setStyleProperty(newItem, "--p-cell-x", cell?.[0] ?? currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
                setStyleProperty(newItem, "--p-cell-y", cell?.[1] ?? currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
                setStyleProperty(newItem, "--cell-x", cell?.[0] ?? currentCell?.[0]?.value ?? item?.cell?.[0] ?? 0);
                setStyleProperty(newItem, "--cell-y", cell?.[1] ?? currentCell?.[1]?.value ?? item?.cell?.[1] ?? 0);
            }

            //
            newItem?.removeAttribute?.("data-dragging");
            delete newItem?.dataset?.dragging;
        });

        //
        return [0, 0];
    };

    //
    const customTrigger = (doGrab: (ev: MouseEvent, newItem: HTMLElement) => void): LongPressHandler => new LongPressHandler(newItem, {
        handler: "*",
        anyPointer: true,
        mouseImmediate: true,
        minHoldTime: 60 * 3600,
        maxHoldTime: 100
    }, makeShiftTrigger((ev)=>{correctOffset(dragging); doGrab?.(ev, newItem)}));

    //
    return bindDraggable(customTrigger, resolveDragging, dragging);
};

// shifting - reactive basis
export const ROOT = typeof document != "undefined" ? document?.documentElement : null;
export const bindInteraction = (newItem: HTMLElement, pArgs: any): [any, any] => {
    reflectCell(newItem, pArgs, true);

    //
    const { item, items, list } = pArgs, layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
    const dragging: [any, any] = [ numberRef(0, RAFBehavior()), numberRef(0, RAFBehavior()) ], currentCell: [any, any] = [ numberRef(item?.cell?.[0] || 0), numberRef(item?.cell?.[1] || 0) ];

    //
    setStyleProperty(newItem, "--cell-x", currentCell?.[0]?.value || 0);
    setStyleProperty(newItem, "--cell-y", currentCell?.[1]?.value || 0);

    //
    const applyDragStyles = (): void => {
        if (dragging?.[0]?.value != null) setStyleProperty(newItem, "--drag-x", dragging?.[0]?.value || 0);
        if (dragging?.[1]?.value != null) setStyleProperty(newItem, "--drag-y", dragging?.[1]?.value || 0);
    };

    //
    let dragStyleRaf = 0, lastRaf: any = null;
    const syncDragStyles = (flush = false): void => {
        if (flush) {
            applyDragStyles();
            dragStyleRaf = 0;
            if (lastRaf) { cancelAnimationFrame(lastRaf); }
            lastRaf = null;
        } else
        if (!dragStyleRaf) {
            dragStyleRaf = 1;
            lastRaf = requestAnimationFrame(() => {
                applyDragStyles();
                dragStyleRaf = 0;
                lastRaf = null;
            });
        }
    };

    //
    subscribe([dragging?.[0], "value"], (val, prop) => { if (prop == "value") { syncDragStyles(); } });
    subscribe([dragging?.[1], "value"], (val, prop) => { if (prop == "value") { syncDragStyles(); } });
    syncDragStyles(true);

    //
    subscribe([currentCell?.[0], "value"], (val, prop) => {
        if (prop == "value" && item.cell != null && val != null) {
            setStyleProperty(newItem, "--cell-x", (item.cell[0] = val) || 0);
        }
    });

    //
    subscribe([currentCell?.[1], "value"], (val, prop) => {
        if (prop == "value" && item.cell != null && val != null) {
            setStyleProperty(newItem, "--cell-y", (item.cell[1] = val) || 0);
        }
    });

    //
    makeDragEvents(newItem, {layout: layout as [number, number], currentCell, dragging, syncDragStyles}, {item, items, list});
    return currentCell as [any, any];
}
