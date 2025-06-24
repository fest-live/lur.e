import { setAttributes } from "../../fl.ui/core/Utils";

//
export const doIndication = (ev?: any, self?: HTMLElement, input?: HTMLInputElement)=>{
    if (!self) return;

    //
    if (input?.type == "radio" && input?.checked) {
        const index = Array.from(self.querySelectorAll?.("input[type=\"radio\"]"))?.indexOf?.(input);
        if (index >= 0) { self.style?.setProperty?.("--value", `${index}`); };
    }

    //
    if (input?.type == "checkbox" && input?.checked != null) {
        const checked = input?.checked;
        self.style.setProperty("--value", `${checked ? 1 : 0}`);
    }

    //
    if (input?.type == "number") {
        const value = input?.valueAsNumber || parseFloat(input?.value) || 0;
        const index = value - (parseFloat(input?.min) || 0);

        //
        if (index >= 0 && ev?.type != "input") { self.style?.setProperty?.("--value", `${index}`); };
        self.style.setProperty("--max-value", `${((parseFloat(input?.max)||0) - (parseFloat(input?.min)||0))}`, "");
    };

    //
    const indicator = self?.querySelector?.(".ui-indicator");
    if (input?.type == "number" && indicator) {
        const value = input?.valueAsNumber || parseFloat(input?.value) || 0;
        indicator.innerHTML = "" + value?.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        });
    }

    //
    if (input?.type == "checkbox") {
        const icon = self.querySelector("ui-icon");
        if (icon) { icon.setAttribute("icon", input?.checked ? "badge-check" : "badge"); }

        //
        const thumb = self.shadowRoot?.querySelector?.(".ui-thumb");
        setAttributes(thumb, {
            "data-highlight": input?.checked ? 3 : 8,
            "data-highlight-hover": input?.checked ? 0 : 5
        });
    }
}
