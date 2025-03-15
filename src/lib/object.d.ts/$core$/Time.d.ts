export declare const UUIDv4: () => string;
export default class AxTime {
    #private;
    static looping: Map<string, Function>;
    static registry: FinalizationRegistry<unknown>;
    constructor();
    available(elapsed: any, fn?: () => boolean): boolean;
    static symbol(name?: string): symbol;
    static rafLoop(fn: any, ctx?: Document): Promise<boolean>;
    static get raf(): Promise<unknown>;
    static protect(fn: any, interval?: number): (...args: any[]) => any;
    static cached(fn: any, interval?: number): (...args: any[]) => any;
    cached(fn: any, interval?: number): (...args: any[]) => any;
    protect(fn: any, interval?: number): (...args: any[]) => any;
}
export { AxTime as Time };
export declare const defaultTimer: AxTime;
