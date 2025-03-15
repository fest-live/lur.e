export type StyleTuple = [selector: string, sheet: object];
export declare const setStyleRule: (selector: string, sheet: object) => void;
export declare const setStyleRules: (classes: StyleTuple[]) => void[];
export declare const hash: (string: string) => Promise<string>;
export declare const loadStyleSheet: (inline: string, base?: [any, any], integrity?: string | Promise<string>) => Promise<void>;
export declare const loadBlobStyle: (inline: string) => HTMLLinkElement;
export declare const loadInlineStyle: (inline: string, rootElement?: HTMLHeadElement) => void;
