import { addEvent, observeContentBox } from "fest/dom";

// Legacy style handlers API

//
export const handleByPointer = (cb, root = typeof document != "undefined" ? document?.documentElement : null)=>{
    if (!root) return () => { };
    let pointerId = -1;
    const rst = (ev)=>{ pointerId = -1; };
    const tgi = (ev)=>{ if (pointerId < 0) pointerId = ev.pointerId; if (pointerId == ev.pointerId) { cb?.(ev); } };
    const listening = [
        addEvent(root, "pointerup", rst),
        addEvent(root, "pointercancel", rst),
        addEvent(root, "pointermove", tgi)
    ];
    return ()=>{
        listening.forEach(ub=>ub?.());
    }
}

//
export const handleForFixPosition = (container, cb, root = typeof document != "undefined" ? document?.documentElement : null)=>{
    if (!root) return () => { };
    const ptu = (ev)=>cb?.(ev);
    const listening = [
        addEvent(container, "scroll", ptu),
        addEvent(root, "resize", ptu)
    ];
    const obs = observeContentBox(container, ptu);
    return ()=>{
        listening.forEach(ub=>ub?.());
        obs?.disconnect?.();
    }
}
