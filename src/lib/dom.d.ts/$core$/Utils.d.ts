export type Point = DOMPoint;
export declare function parseOrigin(origin: string, element: Element): Point;
export declare function parseLength(value: string, size: () => number): number;
export declare function getOffsetParent(element: Element): Element | null;
export declare function getOffsetParentChain(element: Element): Element[];
export declare const url: (type: any, ...source: any[]) => string;
export declare const html: (source: any, type?: DOMParserSupportedType) => HTMLTemplateElement | null;
export declare const MOC: (element: HTMLElement | null, selector: string) => boolean;
export declare const MOCElement: (element: HTMLElement | null, selector: string) => HTMLElement | null;
