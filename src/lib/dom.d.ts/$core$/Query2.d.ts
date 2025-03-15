export default class AxQuery2 {
    #private;
    constructor(selector?: string, rootElement?: HTMLElement);
    observeAttribute(attribute: any, fx: any): MutationObserver;
    observeNodes(fx: any): MutationObserver;
    get query(): Element | null;
    get queryAll(): Element[];
    delegated(name: any, cb: any, options: any): void;
    directly(name: any, cb: (ev: MouseEvent | PointerEvent | TouchEvent) => any, options: any): void;
}
export declare const $$: (selector?: string, rootElement?: HTMLElement) => AxQuery2;
