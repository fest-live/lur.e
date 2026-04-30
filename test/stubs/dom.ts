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
