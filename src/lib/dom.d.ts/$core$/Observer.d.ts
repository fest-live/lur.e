export declare const getPxValue: (element: any, name: any) => any;
export declare const observeContentBox: (element: any, cb: any) => void;
export declare const observeBorderBox: (element: any, cb: any) => void;
export declare const observeAttribute: (element: any, attribute: any, cb: any) => MutationObserver;
export declare const observeAttributeBySelector: (element: any, selector: any, attribute: any, cb: any) => MutationObserver;
export declare const observeBySelector: (element: any, selector?: string, cb?: (mut: any, obs: any) => void) => MutationObserver;
