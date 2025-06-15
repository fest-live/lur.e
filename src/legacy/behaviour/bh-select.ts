//
export const onItemSelect = (ev?: any, self?: any)=>{
    if (!self) return;
    if (ev?.target?.checked != null || ev == null) {
        const ownRadio: HTMLInputElement = (self.shadowRoot?.querySelector?.("input[type=\"radio\"]") ?? self.querySelector?.("input[type=\"radio\"]")) as HTMLInputElement;
        const ownCheckbox: HTMLInputElement = (self.shadowRoot?.querySelector?.("input[type=\"checkbox\"]") ?? self.querySelector?.("input[type=\"checkbox\"]")) as HTMLInputElement;

        //
        if (ownRadio) {
            if (ownRadio?.name == ev?.target?.name || ev == null) {
                // fix if was in internal DOM
                self.checked = (ownRadio?.checked /*= ev.target == ownRadio*/);
            }
        }

        //
        if (ownCheckbox) {
            if (ownCheckbox?.name == ev?.target?.name && ev?.target == ownCheckbox || ev == null) {
                self.checked = ownCheckbox?.checked;
            }
        }

        //
        self?.updateAttributes?.();
    }
}
