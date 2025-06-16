import { ROOT } from "../../core/Utils";

//
export const makeDragTrigger = (newItem, {dragging}, {grabForDrag, agWrapEvent})=> agWrapEvent((evc)=>{
    const ev = evc?.detail || evc;
    if (!newItem.dataset.dragging) {
        const n_coord: [number, number] = (ev.orient ? [...ev.orient] : [ev?.clientX || 0, ev?.clientY || 0]) as [number, number];
        if (ev?.pointerId >= 0) {
            ev?.capture?.(newItem);
            if (!ev?.capture) {
                (newItem as HTMLElement)?.setPointerCapture?.(ev?.pointerId);
            }
        }

        //
        const shifting = agWrapEvent((evc_l: any)=>{
            const ev_l = evc_l?.detail || evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                const coord: [number, number] = (ev_l.orient ? [...ev_l.orient] : [ev_l?.clientX || 0, ev_l?.clientY || 0]) as [number, number];
                const shift: [number, number] = [coord[0] - n_coord[0], coord[1] - n_coord[1]];
                if (Math.hypot(...shift) > 10) {
                    dragging[0].value = 0, dragging[1].value = 0;
                    ROOT.removeEventListener("pointermove", shifting);
                    grabForDrag(newItem, ev_l, {
                        result: dragging,
                        shifting: [0, 0]
                    });
                }
            }
        });

        //
        const releasePointer = agWrapEvent((evc_l)=>{
            const ev_l = evc_l?.detail || evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                unbind(ev_l);
                ev_l?.release?.();
            }
        });

        //
        const unbind = agWrapEvent((evc_l)=>{
            const ev_l = evc_l?.detail || evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                ROOT.removeEventListener("pointermove", shifting);
                ROOT.removeEventListener("pointercancel", releasePointer);
                ROOT.removeEventListener("pointerup", releasePointer);
            }
        });

        //
        ROOT.addEventListener("pointermove", shifting);
        ROOT.addEventListener("pointercancel", releasePointer);
        ROOT.addEventListener("pointerup", releasePointer);
    }
});
