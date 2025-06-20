import { agWrapEvent } from "u2re/dom";
import { ROOT } from "../../core/Utils";

//
function handleListeners(root, fn, handlers) {
    handlers.forEach(({ name, cb }) => fn.call(root, name, cb));
}

//
export const makeShiftTrigger = (callable, newItem?)=> agWrapEvent((evc)=>{
    const ev = evc?.detail || evc;
    newItem ??= ev?.target ?? newItem;
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
                if (Math.hypot(...shift) > 10) { newItem?.style?.setProperty?.("will-change", "transform", "important"); callable?.(ev); }
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
        const handler = {
            "pointermove": shifting,
            "pointercancel": releasePointer,
            "pointerup": releasePointer
        }

        //
        const unbind = agWrapEvent((evc_l)=>{
            const ev_l = evc_l?.detail || evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                handleListeners(ROOT, "removeEventListener", handler);
            }
        });

        //
        handleListeners(ROOT, "addEventListener", handler);
    }
});
