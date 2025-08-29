import { ROOT, addEvents, agWrapEvent, doBorderObserve, doContentObserve, removeEvents } from "fest/dom";

//
export const doObserve = (holder, parent)=>{
    if (!holder) { throw Error("Element is null..."); };
    if ( parent) { doContentObserve(parent); };
    doBorderObserve(holder);
}

//
export const makeShiftTrigger = (callable, newItem?)=> agWrapEvent((evc)=>{
    const ev = evc;
    newItem ??= ev?.target ?? newItem;
    if (!newItem.dataset.dragging) {
        const n_coord: [number, number] = (ev.orient ? [...ev.orient] : [ev?.layerX || 0, ev?.layerY || 0]) as [number, number];
        if (ev?.pointerId >= 0) {
            (newItem as HTMLElement)?.setPointerCapture?.(ev?.pointerId);
        };

        //
        const shifting = agWrapEvent((evc_l: any)=>{
            const ev_l = evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                const coord: [number, number] = (ev_l.orient ? [...ev_l.orient] : [ev_l?.layerX || 0, ev_l?.layerY || 0]) as [number, number];
                const shift: [number, number] = [coord[0] - n_coord[0], coord[1] - n_coord[1]];
                if (Math.hypot(...shift) > 2) {
                    newItem?.style?.setProperty?.("will-change", "transform", "important");
                    releasePointer?.(evc_l); callable?.(ev);
                }
            }
        });

        //
        const releasePointer = agWrapEvent((evc_l)=>{
            const ev_l = evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                (newItem as HTMLElement)?.releasePointerCapture?.(ev?.pointerId);
                unbind(ev_l);
            }
        });

        //
        const handler = {
            "pointermove": shifting,
            "pointercancel": releasePointer,
            "pointerup": releasePointer
        }

        //
        const unbind = agWrapEvent((evc_l)=>{
            const ev_l = evc_l;
            if (ev_l?.pointerId == ev?.pointerId)
                { removeEvents(ROOT, handler); }
        });

        //
        addEvents(ROOT, handler);
    }
});
