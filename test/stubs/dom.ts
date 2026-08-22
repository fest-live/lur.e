export const boundBehaviors = {};
export const getCorrectOrientation = () => 0;
export const orientationNumberMap = [0, 90, 180, 270];
export const whenAnyScreenChanges = () => () => {};
export const getPadding = () => 0;
export const addEvent = (target: any, event: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) => {
    target?.addEventListener?.(event, listener, options);
    return () => target?.removeEventListener?.(event, listener, options);
};
export const setChecked = (element: any, value: any) => {
    if (element) element.checked = !!value;
};
export const handleHidden = (element: any, attribute: string, value: any) => {
    if (!element) return;
    if (value) element.removeAttribute?.(attribute);
    else element.setAttribute?.(attribute, "");
};
export const handleAttribute = (element: any, attribute: string, value: any) => {
    if (!element || !attribute) return;
    if (value == null || value === false) element.removeAttribute?.(attribute);
    else element.setAttribute?.(attribute, value === true ? "" : String(value));
};
export const handleDataset = (element: any, key: string, value: any) => {
    if (!element?.dataset || !key) return;
    if (value == null || value === false) delete element.dataset[key];
    else element.dataset[key] = String(value);
};
export const handleStyleChange = (element: any, property: string, value: any) => {
    if (!element?.style || !property) return;
    if (value == null) element.style.removeProperty?.(property);
    else element.style.setProperty?.(property, String(value));
};
export const handleProperty = (element: any, property: string, value: any) => {
    if (element && property) element[property] = value?.value ?? value;
    return element;
};
export const namedStoreMaps = {};
export const observeAttribute = () => () => {};
export const observeBySelector = () => ({ disconnect() {} });
export const includeSelf = (element: any, selector: string) =>
    element?.matches?.(selector) ? element : element?.querySelector?.(selector) ?? null;
export const getEventTarget = (event: any) => event?.target ?? null;
export const makeRAFCycle = () => ({ cancel() {}, shedule() {} });
export const setProperty = (element: any, property: string, value: any) => {
    if (element?.style?.setProperty) element.style.setProperty(property, String(value));
};
