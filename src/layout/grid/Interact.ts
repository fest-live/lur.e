import { RAFBehavior, orientOf, getBoundingOrientRect, setStyleProperty } from "fest/dom";
import { makeObjectAssignable, observe, affected, numberRef } from "fest/object";
import { makeShiftTrigger, LongPressHandler, clampCell, floorCell, bindDraggable } from "fest/lure";
import { convertOrientPxToCX, redirectCell, cvt_cs_to_os } from "fest/core";
import type { GridArgsType as GridArgsType, GridItemType } from "fest/core";

//
// Track registered CSS properties to avoid duplicate registration errors during HMR
const registeredCSSProperties = new Set<string>();

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
    if (typeof CSS != "undefined" && !registeredCSSProperties.has(options.name)) {
        try {
            CSS?.registerProperty?.(options);
            registeredCSSProperties.add(options.name);
        } catch (e) {
            // Silently ignore duplicate registration errors (common during HMR)
        }
    }
});

//
//const setStyleProperty = (item, prop, value) => {
    /*if (value == null || item?.style?.getPropertyValue?.(prop) === String(value)) { return; }
    return item?.style?.setProperty?.(prop, value);*/
//}

//
//const computed = Symbol("@computed");
const normalizeOrient = (value: unknown): number => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    const rounded = Math.round(parsed);
    return ((rounded % 4) + 4) % 4;
};

const depAxis  = (axis: string = "x", orient: number = 0)=> {
    const normalized = normalizeOrient(orient);
    const isSwapped = normalized % 2 === 1;
    if (isSwapped) {
        return axis === "x" ? "r" : "c";
    }
    return axis === "x" ? "c" : "r";
}

export const resolveGridCellFromClientPoint = (
    gridSystem: HTMLElement | null | undefined,
    clientPoint: [number, number],
    args?: Partial<GridArgsType>,
    mode: "floor" | "round" = "floor"
): [number, number] => {
    if (!gridSystem) return [0, 0];
    const rect = gridSystem.getBoundingClientRect?.();
    if (!rect) return [0, 0];

    const layout: [number, number] = [
        parseInt(gridSystem.getAttribute?.("data-grid-columns") || "", 10)
            || (args?.layout as any)?.columns
            || (args?.layout as any)?.[0]
            || 4,
        parseInt(gridSystem.getAttribute?.("data-grid-rows") || "", 10)
            || (args?.layout as any)?.rows
            || (args?.layout as any)?.[1]
            || 8
    ];

    const orient = orientOf(gridSystem);
    const size: [number, number] = [
        rect.width || gridSystem.clientWidth || 1,
        rect.height || gridSystem.clientHeight || 1
    ];
    const csCoord: [number, number] = [
        (clientPoint?.[0] || 0) - rect.left,
        (clientPoint?.[1] || 0) - rect.top
    ];
    const osCoord = cvt_cs_to_os(csCoord, size, orient);
    const normalizedArgs = {
        item: (args as any)?.item || ({} as GridItemType),
        list: (args as any)?.list || [],
        items: (args as any)?.items || new Map(),
        layout,
        size
    } as GridArgsType;
    const projected = convertOrientPxToCX(osCoord, normalizedArgs, orient);
    const normalizedCell: [number, number] = mode === "round"
        ? [Math.round(projected[0]), Math.round(projected[1])]
        : [Math.floor(projected[0]), Math.floor(projected[1])];
    const redirected = redirectCell(normalizedCell, normalizedArgs);
    const clamped = clampCell(redirected, layout);
    return [clamped.x.value, clamped.y.value];
};

// DragCoord
export const animationSequence = (DragCoord = 0, axis = "x", orient = 0) => {
    const drag = "--drag-" + axis;
    const csDrag = "--cs-drag-" + axis;
    const axisKey = depAxis(axis, orient);
    const rvProp = `--rv-grid-${axisKey}`;
    const gridProp = `--cs-grid-${axisKey}`;
    const prevGridProp = `--cs-p-grid-${axisKey}`;
    return [
        { [rvProp]: `var(${prevGridProp})`, [drag]: DragCoord, [csDrag]: `${DragCoord}px` }, // starting...
        { [rvProp]: `var(${gridProp})`, [drag]: 0, [csDrag]: "0px" }
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
    const distance = Math.abs(dragCoord || 0);
    const duration = Math.max(120, Math.min(240, 120 + distance * 0.45));
    const gridSystem = newItem?.parentElement as HTMLElement | null;
    const orient = normalizeOrient(orientOf(gridSystem || newItem));
    const animation = animate && !matchMedia("(prefers-reduced-motion: reduce)")?.matches ? newItem.animate(animationSequence(dragCoord, axis, orient), {
        fill: "none",
        duration,
        easing: "cubic-bezier(0.22, 0.8, 0.3, 1)"
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
    return affected?.(item, (state, property)=>{
        const gridSystem = newItem?.parentElement;
        layout[0] = parseInt(gridSystem?.getAttribute?.("data-grid-columns") || "4") || layout[0];
        layout[1] = parseInt(gridSystem?.getAttribute?.("data-grid-rows") || "8") || layout[1];
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        if (item && !item?.cell) { item.cell = makeObjectAssignable(observe([0, 0])); }; // @ts-ignore
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
        const flooredCell = floorCell(projected as [number, number]);
        const redirectedCell = redirectCell([flooredCell.x.value, flooredCell.y.value], args);
        const clampedCell = clampCell(redirectedCell, layoutSnapshot as [number, number]);
        return {
            inset: [inset[0] - dragging?.[0]?.value, inset[1] - dragging?.[1]?.value],
            cell: [clampedCell.x.value, clampedCell.y.value] // Convert Vector2D back to array
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
        const redirectedCell = redirectCell(cell, args as GridArgsType);
        const clampedCell = clampCell(redirectedCell, layout as [number, number]);
        cell = [clampedCell.x.value, clampedCell.y.value]; // Convert Vector2D back to array
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
            newItem?.dispatchEvent?.(new CustomEvent("m-dragsettled", {
                bubbles: true,
                detail: {
                    cell: cell ? [cell[0], cell[1]] : null
                }
            }));
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
    const immediateDragStyles = Boolean(pArgs?.immediateDragStyles);
    const dragging: [any, any] = [ numberRef(0, RAFBehavior()), numberRef(0, RAFBehavior()) ], currentCell: [any, any] = [ numberRef(item?.cell?.[0] || 0), numberRef(item?.cell?.[1] || 0) ];

    //
    setStyleProperty(newItem, "--cell-x", currentCell?.[0]?.value || 0);
    setStyleProperty(newItem, "--cell-y", currentCell?.[1]?.value || 0);

    //
    const applyDragStyles = (): void => {
        if (dragging?.[0]?.value != null) {
            const dx = dragging?.[0]?.value || 0;
            setStyleProperty(newItem, "--drag-x", dx);
            // Keep cs-drag vars in sync explicitly to avoid relying on downstream calc() cascade.
            setStyleProperty(newItem, "--cs-drag-x", `${dx}px`);
        }
        if (dragging?.[1]?.value != null) {
            const dy = dragging?.[1]?.value || 0;
            setStyleProperty(newItem, "--drag-y", dy);
            // Keep cs-drag vars in sync explicitly to avoid relying on downstream calc() cascade.
            setStyleProperty(newItem, "--cs-drag-y", `${dy}px`);
        }
    };

    //
    let dragStyleRaf = 0, lastRaf: any = null;
    const syncDragStyles = (flush = false): void => {
        if (immediateDragStyles) {
            applyDragStyles();
            if (lastRaf) { cancelAnimationFrame(lastRaf); }
            dragStyleRaf = 0;
            lastRaf = null;
            return;
        }
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
    affected([dragging?.[0], "value"], (val, prop) => { if (prop == "value") { syncDragStyles(); } });
    affected([dragging?.[1], "value"], (val, prop) => { if (prop == "value") { syncDragStyles(); } });
    syncDragStyles(true);

    //
    affected([currentCell?.[0], "value"], (val, prop) => {
        if (prop == "value" && item.cell != null && val != null) {
            setStyleProperty(newItem, "--cell-x", (item.cell[0] = val) || 0);
        }
    });

    //
    affected([currentCell?.[1], "value"], (val, prop) => {
        if (prop == "value" && item.cell != null && val != null) {
            setStyleProperty(newItem, "--cell-y", (item.cell[1] = val) || 0);
        }
    });

    // Prevent stale settle offsets from bleeding into the next drag start.
    if (!newItem.dataset.dragResetBound) {
        newItem.dataset.dragResetBound = "1";
        newItem.addEventListener("m-dragstart", () => {
            setStyleProperty(newItem, "--cs-transition-c", "0px");
            setStyleProperty(newItem, "--cs-transition-r", "0px");
        });
    }

    //
    makeDragEvents(newItem, {layout: layout as [number, number], currentCell, dragging, syncDragStyles}, {item, items, list});
    return currentCell as [any, any];
}
