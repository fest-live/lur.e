
import { importCdn } from "u2re/cdnImport";
import { ScrollBar } from "../fl.ui/ui/scrollbar/Scrollbar";
import { includeSelf } from "../fl.ui/core/Utils";

// @ts-ignore
const { observeBySelector } = await Promise.try(importCdn, ["u2re/dom"]);
export const doButtonAction = (button, input: HTMLInputElement)=>{
    if (button.matches(".u2-copy") && input?.matches?.("input") && (input?.selectionStart != input?.selectionEnd)) { navigator.clipboard.writeText(input.value.substring(input.selectionStart || 0, input.selectionEnd || input.selectionStart || 0)); }
    if (button.matches(".u2-paste") && input?.selectionStart != null) {
        navigator.clipboard.readText().then(
            (clipText) => {
                const oldStart = input?.selectionStart || 0;
                const paste = (input?.value?.substring(0, input?.selectionStart || 0) || "") + (clipText || "") + (input?.value?.substring?.(input?.selectionEnd || 0) || "");
                if (input) { input.value = paste; };

                //
                input?.setSelectionRange(
                    oldStart + (clipText?.length||0),
                    oldStart + (clipText?.length||0)
                );

                //
                input?.dispatchEvent(new Event("input", {
                    bubbles: true,
                    cancelable: true,
                }))
            },
        );
    }
}

//
export const holdFocus = (input)=>{
    let pointerId = -1;
    input?.addEventListener?.("pointerdown", (ev)=>{
        if (pointerId < 0) {
            input?.setPointerCapture?.(pointerId = ev?.pointerId);
        }
    });

    input?.addEventListener?.("blur", (ev)=>{
        if (pointerId >= 0) {
            input?.focus?.();
        }
    });

    document?.addEventListener?.("pointerup", (ev)=>{
        if (pointerId == ev?.pointerId) {
            input?.releasePointerCapture?.(pointerId);
            pointerId = -1;
        }
    });

    document?.addEventListener?.("pointercancel", (ev)=>{
        if (pointerId == ev?.pointerId) {
            input?.releasePointerCapture?.(pointerId);
            pointerId = -1;
        }
    });
}

//
export const makeInput = (host?: HTMLElement, ROOT = document.documentElement)=>{
    if (!host) return;

    //
    const input = host?.querySelector?.("input");
    holdFocus(input);

    //
    const weak  = new WeakRef(host);
    const scp   = [0, 0];
    const scp_w = new WeakRef(scp);
    const enforceFocus = (ev)=>{
        const scrollable = weak?.deref?.();
        const element = ev?.target as HTMLElement;
        if (element?.matches?.("input[type=\"text\"], ui-longtext, ui-focustext") && (scrollable?.contains(element) || element?.contains?.(scrollable as Node))) {
            const input: HTMLInputElement | null = (element?.matches("input") ? element : element?.querySelector?.("input[type=\"text\"]")) as HTMLInputElement;
            if (input) {
                if (ev.type == "click" || ev.pointerType == "touch") {
                    ev?.preventDefault?.();
                    ev?.stopPropagation?.();
                }
                if (document.activeElement != input && ev.type == "click") {
                    input?.focus?.();
                }
            }
        }
    };

    //
    ROOT?.addEventListener?.("click", enforceFocus);
    ROOT?.addEventListener?.("select", enforceFocus);
    ROOT?.addEventListener?.("selectionchange", enforceFocus);
    ROOT?.addEventListener?.("selectstart", enforceFocus);

    //
    {
        const bar = host?.shadowRoot?.querySelector?.(".u2-scroll-box");
        const box = host?.shadowRoot?.querySelector?.(".u2-input-box") as HTMLElement;
        const scr_w = new WeakRef(box);
        const scrollPos = scp;

        //
        if (scrollPos) {
            scrollPos[0] = box?.scrollLeft || 0;
            scrollPos[1] = box?.scrollTop  || 0;
        }

        //
        document.addEventListener("wheel", (ev)=>{
            const scrollable = scr_w?.deref?.();
            if (scrollable?.matches?.(":where(:hover, :active)")) {
                ev.preventDefault();
                ev.stopPropagation();
                {   //
                    scrollable?.scrollBy?.({
                        left: ((ev?.deltaY || 0)+(ev?.deltaX || 0)), top: 0,
                        behavior: "smooth"
                    });
                }
            }
        }, {passive: false});

        //
        new ScrollBar({
            content: box,
            holder: host,
            scrollbar: bar
        }, 0);
    }

    //
    let selection = false;
    const whenCancel = (ev)=>{
        //const box = weak?.deref?.()?.shadowRoot?.querySelector?.(".u2-input-box") as HTMLElement;
        //const scrollPos = scp_w?.deref?.();
        /*if (selection) { box.scrollTo({
            left: scrollPos?.[0] || 0,
            top : scrollPos?.[1] || 0,
            behavior: "instant"
        }); };*/
        selection = false;
    }

    //
    ROOT?.addEventListener?.("pointerup", whenCancel, {capture: true, passive: true});
    ROOT?.addEventListener?.("pointercancel", whenCancel, {capture: true, passive: true});
    ROOT?.addEventListener?.("selectionchange", ()=>{
        const box = weak?.deref?.()?.querySelector(".u2-input-box") as HTMLElement;
        const scrollPos = scp_w?.deref?.();
        if (scrollPos) {
            scrollPos[0] = box?.scrollLeft || 0;
            scrollPos[1] = box?.scrollTop  || 0;
        }
        if (input?.selectionStart != input?.selectionEnd) {
            //selection = true;
        }
    }, {capture: true, passive: true});

    //
    const preventScroll = ()=>{
        const box = weak?.deref?.()?.shadowRoot?.querySelector(".u2-input-box") as HTMLElement;
        const scrollPos = [box.scrollLeft, box.scrollTop];
        /*if (selection) { box.scrollTo({
            left: scrollPos[0],
            top: scrollPos[1],
            behavior: "instant"
        }); };*/
    }

    //
    const toFocus = ()=>{ if (document.activeElement != input) { input?.focus?.(); } }
    const preventDrag = (ev)=>{ ev.preventDefault(); if (ev.dataTransfer) { ev.dataTransfer.dropEffect = "none"; } }
    {   //
        const box = host?.shadowRoot?.querySelector?.(".u2-input-box") as HTMLElement;
        box?.addEventListener?.("scroll"   , preventScroll, {capture: true, passive: true});
        box?.addEventListener?.("scrollend", preventScroll, {capture: true, passive: true});
        box?.addEventListener?.("dragstart", preventDrag);
        box?.addEventListener?.("focus", toFocus);
        host?.addEventListener?.("dragstart", preventDrag);
        host?.addEventListener?.("focus", toFocus);
        input?.addEventListener?.("dragstart", preventDrag);
    }
}

//
export const updateInput = (state, target)=>{
    const selector = "input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])";
    const input    = includeSelf(target, "input");
    const name     = input?.name || target?.dataset?.name || "";

    //
    if (state?.[name] != null) { // not exists not preferred...
        if (state && input?.matches?.(selector)) {
            if (input.value != state[name]) {
                input.value = state[name];
                input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, }));
            }
        }

        // setup radio boxes (requires wrapper)
        if (state) {
            const radio = includeSelf(target, `input:where([type=\"radio\"][name=\"${name}\"][value=\"${state?.[name]}\"])`);
            if (state && radio && state[name] == radio.value && !radio?.checked) { radio?.click?.(); };
        }

        // setup check boxes
        const checkbox = includeSelf(target, "input:where([type=\"checkbox\"])");
        if (state && checkbox) {
            if (state[name] != checkbox.checked) {
                checkbox.checked = !!state[name];
                checkbox.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, }))
            }
        }
    }
}

//
export const synchronizeInputs = (state, wrapper = ".u2-input", fields = document.documentElement, subscribe?: Function)=>{

    //
    const onChange = (ev)=>{
        const input  = ev?.target?.matches("input") ? ev?.target : ev?.target?.querySelector?.("input");
        const target = ev?.target?.matches(wrapper) ? ev?.target : input?.closest?.(wrapper);
        const name   = input?.name || target?.dataset?.name;

        //
        if (state?.[name] != null) { // not exists not preferred...
            if (input?.matches?.("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])")) {
                const value = (input.valueAsNumber != null && !isNaN(input.valueAsNumber)) ? input.valueAsNumber : input.value;
                if (state[name] != value) { state[name] = value; };
            }

            // any radio-box
            if (input?.matches?.("input[type=\"radio\"]")) {
                if (input?.checked && state[name] != input.value) { state[name] = input.value; };
            }

            // any check-box
            if (input?.matches?.("input[type=\"checkbox\"]")) {
                if (state[name] != input.checked) { state[name] = input.checked; };
            }
        }
    };

    //
    fields.addEventListener("input", onChange);
    fields.addEventListener("change", onChange);
    fields.addEventListener("u2-appear", ()=>requestIdleCallback(()=> fields.querySelectorAll(wrapper).forEach((target)=>updateInput(state, target)), {timeout: 100}));

    // cross-window or frame syncretism
    subscribe?.(state, (value, property)=>{ fields.querySelectorAll(wrapper).forEach((target)=>updateInput(state, target)); });
    requestIdleCallback(()=>{ fields.querySelectorAll(wrapper).forEach((target)=>updateInput(state, target)); }, {timeout: 100});
    observeBySelector(fields, wrapper, (mutations)=>{
        mutations.addedNodes.forEach((target)=>{
            requestIdleCallback(()=>{
                updateInput(state, target);
            }, {timeout: 100});
        });
    });
}
