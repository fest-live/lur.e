type EventSpec = EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, AddEventListenerOptions?];

export const ROOT = typeof document !== "undefined" ? document.documentElement : null;

const asPair = (spec: EventSpec): [EventListenerOrEventListenerObject, AddEventListenerOptions | undefined] =>
    Array.isArray(spec) ? [spec[0], spec[1]] : [spec, undefined];

export const addEvent = (
    target: any,
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
) => {
    target?.addEventListener?.(event, listener, options);
    return () => target?.removeEventListener?.(event, listener, options);
};

export const removeEvent = (
    target: any,
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
) => target?.removeEventListener?.(event, listener, options);

export const addEvents = (target: any, events: Record<string, EventSpec>) =>
    Object.entries(events).map(([event, spec]) => {
        const [listener, options] = asPair(spec);
        return addEvent(target, event, listener, options);
    });

export const doBorderObserve = () => {};
export const doContentObserve = () => {};
export const handleStyleChange = () => {};
export const orientOf = () => 0;
export const getBoundingOrientRect = () => ({ left: 0, top: 0, width: 1, height: 1 });
export const readFixedOverlayViewport = () => ({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
});
