import { ROOT, addEvents, agWrapEvent, doBorderObserve, doContentObserve } from "fest/dom";

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
        const n_coord: [number, number] = [ev.clientX, ev.clientY];
        if (ev?.pointerId >= 0) {
            (newItem as HTMLElement)?.setPointerCapture?.(ev?.pointerId);
        };

        //
        const shifting = agWrapEvent((evc_l: any)=>{
            const ev_l = evc_l;
            ev_l?.preventDefault?.();
            if (ev_l?.pointerId == ev?.pointerId) {
                const coord: [number, number] = [evc_l.clientX, evc_l.clientY];
                const shift: [number, number] = [coord[0] - n_coord[0], coord[1] - n_coord[1]];
                if (Math.hypot(...shift) > 2) {
                    newItem.dataset.dragging = "";
                    newItem?.style?.setProperty?.("will-change", "inset, transform, translate, z-index");

                    //
                    unbind?.(ev_l);
                    callable?.(ev);
                }
            }
        });

        //
        const releasePointer = agWrapEvent((evc_l)=>{
            const ev_l = evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                (newItem as HTMLElement)?.releasePointerCapture?.(ev?.pointerId);
                unbind?.(ev_l);
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
            if (ev_l?.pointerId == ev?.pointerId) {
                bindings?.forEach(binding => binding?.());
            }
        });

        //
        const bindings = addEvents(ROOT, handler);
    }
});
