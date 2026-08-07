import { bindWith } from "../core/Binding";
import { handleStyleChange } from "@fest-lib/dom";

type Cleanup = () => void;

type TypedStyleSlot = {
    marker: string;
    value: any;
    multipliedByUnit?: string;
};

type ReactiveStyleSlot = {
    marker: string;
    value: any;
    multipliedByUnit?: string;
};

type AttachedUnit = {
    authored: string;
    normalized: string;
    length: number;
};

type TypedOMLeaf = {
    slot: ReactiveStyleSlot;
    value: any;
};

type MutableTypedLeaf = TypedOMLeaf & {
    /** Declaration this leaf participates in (for styleMap re-set after .value mutation). */
    property: string;
    /** Persistent Typed OM root previously passed to styleMap.set(property, root). */
    root: any;
};

type NumericTreeResult = {
    root: any;
    leaves: TypedOMLeaf[];
};

type InlineStyleTemplateParts = {
    strings: string[];
    values: any[];
};

export type StyleBinding = [
    apply: (element: HTMLElement) => Cleanup,
    properties: string[],
    variables: Map<string, any>,
];

export type InlineStyleAttributePlan =
    | {
        kind: "static";
        cssText: string;
    }
    | {
        kind: "direct";
        value: any;
    }
    | {
        kind: "template";
        binding: StyleBinding;
    };

let styleTemplateId = 0;

const CSS_DIMENSION_UNITS = new Set([
    "%",

    "px",
    "cm",
    "mm",
    "q",
    "in",
    "pc",
    "pt",

    "em",
    "ex",
    "ch",
    "cap",
    "ic",
    "lh",

    "rem",
    "rex",
    "rch",
    "rcap",
    "ric",
    "rlh",

    "vw",
    "vh",
    "vi",
    "vb",
    "vmin",
    "vmax",

    "svw",
    "svh",
    "svi",
    "svb",
    "svmin",
    "svmax",

    "lvw",
    "lvh",
    "lvi",
    "lvb",
    "lvmin",
    "lvmax",

    "dvw",
    "dvh",
    "dvi",
    "dvb",
    "dvmin",
    "dvmax",

    "cqw",
    "cqh",
    "cqi",
    "cqb",
    "cqmin",
    "cqmax",

    "deg",
    "grad",
    "rad",
    "turn",

    "s",
    "ms",

    "hz",
    "khz",

    "dpi",
    "dpcm",
    "dppx",
    "x",

    "fr",
]);

/**
 * True when there is no declaration with a non-empty value.
 */
export const isEffectivelyEmptyStyleText = (
    cssText: string | null | undefined,
): boolean => {
    const source =
        typeof cssText === "string"
            ? cssText.trim()
            : "";

    if (!source) return true;

    for (const chunk of source.split(";")) {
        const declaration = chunk.trim();

        if (!declaration) continue;

        const colonIndex = declaration.indexOf(":");

        if (colonIndex < 0) {
            return false;
        }

        if (
            declaration
                .slice(colonIndex + 1)
                .trim()
                .length > 0
        ) {
            return false;
        }
    }

    return true;
};

/**
 * Removes a useless style attribute left by empty interpolation.
 */
export const pruneEmptyStyleAttribute = (
    element: HTMLElement | null | undefined,
): void => {
    if (element == null) return;

    const raw = element.getAttribute("style");

    if (raw == null) return;

    if (isEffectivelyEmptyStyleText(raw)) {
        element.style.cssText = "";
        element.removeAttribute("style");
    }
};

/**
 * Sets inline CSS or removes the style attribute when it is empty.
 */
export const applyNormalizedInlineStyle = (
    element: HTMLElement,
    cssText: string,
): void => {
    if (isEffectivelyEmptyStyleText(cssText)) {
        element.style.cssText = "";
        element.removeAttribute("style");
        return;
    }

    element.style.cssText = cssText;
};

/**
 * Detects CSSUnitValue, CSSMathValue and other CSSStyleValue
 * descendants, including values created in another Window.
 */
export const isNativeCSSStyleValue = (
    value: any,
): boolean => {
    if (
        value == null ||
        typeof value !== "object"
    ) {
        return false;
    }

    try {
        const CSSStyleValueCtor =
            (globalThis as any).CSSStyleValue;

        if (
            typeof CSSStyleValueCtor === "function" &&
            value instanceof CSSStyleValueCtor
        ) {
            return true;
        }

        for (
            let prototype = value;
            prototype;
            prototype = Object.getPrototypeOf(prototype)
        ) {
            if (
                prototype?.constructor?.name ===
                "CSSStyleValue"
            ) {
                return true;
            }
        }
    } catch {
        // Proxies may reject instanceof or getPrototypeOf.
    }

    return false;
};

/**
 * Detects the existing reactive `{ value: ... }` contract.
 *
 * Native CSSStyleValue must be checked first because CSSUnitValue
 * also contains a `value` property.
 */
export const isReactiveStyleValue = (
    value: any,
): boolean => {
    if (
        value == null ||
        typeof value !== "object" ||
        isNativeCSSStyleValue(value)
    ) {
        return false;
    }

    try {
        return "value" in value;
    } catch {
        return false;
    }
};

const isStaticStyleInterpolation = (
    value: any,
): boolean => {
    return (
        value == null ||
        (
            typeof value !== "object" &&
            typeof value !== "function"
        )
    );
};

const escapeRegExp = (
    value: string,
): string => {
    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
    );
};

const containsMarker = (
    cssValue: string,
    marker: string,
): boolean => {
    return new RegExp(
        `var\\(\\s*${escapeRegExp(marker)}\\s*\\)`,
    ).test(cssValue);
};

const readAttachedCSSUnit = (
    text: string,
): AttachedUnit | null => {
    const match = /^(%|[a-zA-Z]+)/.exec(text);

    if (!match) return null;

    const authored = match[0];
    const normalized = authored.toLowerCase();

    if (!CSS_DIMENSION_UNITS.has(normalized)) {
        return null;
    }

    return {
        authored,
        normalized,
        length: authored.length,
    };
};

const getCSSUnitFactoryName = (
    unit: string,
): string => {
    switch (unit.toLowerCase()) {
        case "%":
            return "percent";

        case "q":
            return "Q";

        case "hz":
            return "Hz";

        case "khz":
            return "kHz";

        case "fr":
            return "flex";

        default:
            return unit.toLowerCase();
    }
};

const getCSSUnitConstructorName = (
    unit: string,
): string => {
    switch (unit.toLowerCase()) {
        case "%":
            return "percent";

        default:
            return unit.toLowerCase();
    }
};

const getWindowConstructor = (
    win: any,
    name: string,
): any => {
    return (
        win?.[name] ??
        (globalThis as any)?.[name]
    );
};

/**
 * Creates CSS.px(value), CSS.deg(value), CSS.number(value), etc.
 */
const createTypedUnitValue = (
    win: any,
    unit: string,
    value: number,
): any => {
    const CSSNamespace = win?.CSS;
    const factoryName =
        getCSSUnitFactoryName(unit);
    const factory =
        CSSNamespace?.[factoryName];

    if (typeof factory === "function") {
        return factory.call(
            CSSNamespace,
            value,
        );
    }

    const CSSUnitValueCtor =
        getWindowConstructor(
            win,
            "CSSUnitValue",
        );

    if (
        typeof CSSUnitValueCtor !== "function"
    ) {
        throw new TypeError(
            `Typed OM does not support CSS unit "${unit}"`,
        );
    }

    return new CSSUnitValueCtor(
        value,
        getCSSUnitConstructorName(unit),
    );
};

const readReactiveNumber = (
    slot: ReactiveStyleSlot,
): number => {
    const current = slot.value?.value;

    const number =
        typeof current === "number"
            ? current
            : Number(current);

    if (!Number.isFinite(number)) {
        throw new TypeError(
            `Reactive CSS value "${String(current)}" is not finite`,
        );
    }

    return number;
};

const getReactiveInitialNumber = (
    value: any,
): number => {
    const number = Number(value?.value);

    return Number.isFinite(number)
        ? number
        : 0;
};

const replaceTypedMarkers = (
    cssValue: string,
    slots: readonly TypedStyleSlot[],
): string => {
    let result = cssValue;

    for (const slot of slots) {
        result = result.replace(
            new RegExp(
                `var\\(\\s*${escapeRegExp(slot.marker)}\\s*\\)`,
                "g",
            ),
            String(slot.value),
        );
    }

    return result;
};

const isDirectSlotValue = (
    cssValue: string,
    marker: string,
): boolean => {
    const escapedMarker =
        escapeRegExp(marker);

    return new RegExp(
        `^var\\(\\s*${escapedMarker}\\s*\\)$`,
    ).test(cssValue.trim());
};

const isDirectSlotUnitProduct = (
    cssValue: string,
    marker: string,
    unit: string | undefined,
): boolean => {
    if (!unit) return false;

    const escapedMarker =
        escapeRegExp(marker);
    const escapedUnit =
        escapeRegExp(unit);

    return new RegExp(
        `^calc\\(\\s*var\\(\\s*${escapedMarker}\\s*\\)` +
        `\\s*\\*\\s*1${escapedUnit}\\s*\\)$`,
        "i",
    ).test(cssValue.trim());
};

const setParsedTypedValue = (
    styleMap: any,
    CSSStyleValueCtor: any,
    property: string,
    cssValue: string,
): void => {
    if (
        typeof CSSStyleValueCtor?.parseAll ===
        "function"
    ) {
        const values =
            CSSStyleValueCtor.parseAll(
                property,
                cssValue,
            );

        styleMap.set(
            property,
            ...values,
        );

        return;
    }

    if (
        typeof CSSStyleValueCtor?.parse ===
        "function"
    ) {
        styleMap.set(
            property,
            CSSStyleValueCtor.parse(
                property,
                cssValue,
            ),
        );

        return;
    }

    styleMap.set(
        property,
        cssValue,
    );
};

type NumericToken =
    | {
        kind: "number";
        value: number;
        unit: string | null;
    }
    | {
        kind: "variable";
        marker: string;
    }
    | {
        kind: "identifier";
        value: string;
    }
    | {
        kind: "symbol";
        value:
            | "+"
            | "-"
            | "*"
            | "/"
            | "("
            | ")"
            | ",";
    };

const tokenizeNumericCSS = (
    source: string,
): NumericToken[] => {
    const tokens: NumericToken[] = [];
    let cursor = 0;

    while (cursor < source.length) {
        const rest = source.slice(cursor);

        const whitespace =
            /^\s+/.exec(rest);

        if (whitespace) {
            cursor += whitespace[0].length;
            continue;
        }

        const variable =
            /^var\(\s*(--[a-zA-Z0-9_-]+)\s*\)/.exec(rest);

        if (variable) {
            tokens.push({
                kind: "variable",
                marker: variable[1],
            });

            cursor += variable[0].length;
            continue;
        }

        const number =
            /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(rest);

        if (number) {
            cursor += number[0].length;

            const unitMatch =
                /^(%|[a-zA-Z]+)/.exec(
                    source.slice(cursor),
                );

            const unit =
                unitMatch?.[0] ?? null;

            if (unitMatch) {
                cursor += unitMatch[0].length;
            }

            tokens.push({
                kind: "number",
                value: Number(number[0]),
                unit:
                    unit == null
                        ? null
                        : unit.toLowerCase(),
            });

            continue;
        }

        const identifier =
            /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(rest);

        if (identifier) {
            tokens.push({
                kind: "identifier",
                value:
                    identifier[0].toLowerCase(),
            });

            cursor += identifier[0].length;
            continue;
        }

        const symbol =
            rest[0] as NumericToken extends {
                kind: "symbol";
                value: infer SymbolValue;
            }
                ? SymbolValue
                : never;

        if (
            symbol === "+" ||
            symbol === "-" ||
            symbol === "*" ||
            symbol === "/" ||
            symbol === "(" ||
            symbol === ")" ||
            symbol === ","
        ) {
            tokens.push({
                kind: "symbol",
                value: symbol,
            });

            cursor++;
            continue;
        }

        throw new SyntaxError(
            `Unsupported Typed OM numeric token near "${rest}"`,
        );
    }

    return tokens;
};

class NumericTypedOMParser {
    private index = 0;

    readonly leaves: TypedOMLeaf[] = [];

    constructor(
        private readonly tokens: NumericToken[],
        private readonly win: any,
        private readonly reactiveByMarker:
            ReadonlyMap<string, ReactiveStyleSlot>,
        private readonly typedByMarker:
            ReadonlyMap<string, TypedStyleSlot>,
    ) {}

    parse(): NumericTreeResult {
        const root = this.parseSum();

        if (this.index !== this.tokens.length) {
            throw new SyntaxError(
                "Unexpected trailing Typed OM expression",
            );
        }

        return {
            root,
            leaves: this.leaves,
        };
    }

    private current(): NumericToken | undefined {
        return this.tokens[this.index];
    }

    private consume(): NumericToken {
        const token = this.tokens[this.index];

        if (!token) {
            throw new SyntaxError(
                "Unexpected end of Typed OM expression",
            );
        }

        this.index++;
        return token;
    }

    private consumeSymbol(
        symbol: NumericToken extends {
            kind: "symbol";
            value: infer SymbolValue;
        }
            ? SymbolValue
            : never,
    ): void {
        const token = this.consume();

        if (
            token.kind !== "symbol" ||
            token.value !== symbol
        ) {
            throw new SyntaxError(
                `Expected "${symbol}"`,
            );
        }
    }

    private matchesSymbol(
        symbol: NumericToken extends {
            kind: "symbol";
            value: infer SymbolValue;
        }
            ? SymbolValue
            : never,
    ): boolean {
        const token = this.current();

        return (
            token?.kind === "symbol" &&
            token.value === symbol
        );
    }

    private createMath(
        name: string,
        ...values: any[]
    ): any {
        const Constructor =
            getWindowConstructor(
                this.win,
                name,
            );

        if (
            typeof Constructor !== "function"
        ) {
            throw new TypeError(
                `${name} is not supported`,
            );
        }

        return new Constructor(...values);
    }

    private parseSum(): any {
        let value = this.parseProduct();

        while (
            this.matchesSymbol("+") ||
            this.matchesSymbol("-")
        ) {
            const operator = this.consume();
            const right = this.parseProduct();

            if (
                operator.kind !== "symbol"
            ) {
                throw new SyntaxError(
                    "Expected a sum operator",
                );
            }

            if (operator.value === "+") {
                value = this.createMath(
                    "CSSMathSum",
                    value,
                    right,
                );
            } else {
                value = this.createMath(
                    "CSSMathSum",
                    value,
                    this.createMath(
                        "CSSMathNegate",
                        right,
                    ),
                );
            }
        }

        return value;
    }

    private parseProduct(): any {
        let value = this.parseUnary();

        while (
            this.matchesSymbol("*") ||
            this.matchesSymbol("/")
        ) {
            const operator = this.consume();
            const right = this.parseUnary();

            if (
                operator.kind !== "symbol"
            ) {
                throw new SyntaxError(
                    "Expected a product operator",
                );
            }

            if (operator.value === "*") {
                value = this.createMath(
                    "CSSMathProduct",
                    value,
                    right,
                );
            } else {
                value = this.createMath(
                    "CSSMathProduct",
                    value,
                    this.createMath(
                        "CSSMathInvert",
                        right,
                    ),
                );
            }
        }

        return value;
    }

    private parseUnary(): any {
        if (this.matchesSymbol("+")) {
            this.consume();
            return this.parseUnary();
        }

        if (this.matchesSymbol("-")) {
            this.consume();

            return this.createMath(
                "CSSMathNegate",
                this.parseUnary(),
            );
        }

        return this.parsePrimary();
    }

    private parsePrimary(): any {
        const token = this.consume();

        if (token.kind === "number") {
            return createTypedUnitValue(
                this.win,
                token.unit ?? "number",
                token.value,
            );
        }

        if (token.kind === "variable") {
            const reactive =
                this.reactiveByMarker.get(
                    token.marker,
                );

            if (reactive) {
                /*
                 * WHY: `${ref}px` is authored as calc(var(--fest-ref) * 1px).
                 * Collapse that product into one mutable CSS.px(ref.value) leaf
                 * instead of CSSMathProduct(CSS.number, CSS.px(1)).
                 */
                if (this.matchesSymbol("*")) {
                    const checkpoint = this.index;
                    this.consume();

                    const rhs = this.current();

                    if (
                        rhs?.kind === "number" &&
                        rhs.value === 1 &&
                        typeof rhs.unit === "string" &&
                        (
                            !reactive.multipliedByUnit ||
                            reactive.multipliedByUnit ===
                                rhs.unit.toLowerCase()
                        )
                    ) {
                        this.consume();

                        const leaf =
                            createTypedUnitValue(
                                this.win,
                                rhs.unit.toLowerCase(),
                                readReactiveNumber(
                                    reactive,
                                ),
                            );

                        this.leaves.push({
                            slot: reactive,
                            value: leaf,
                        });

                        return leaf;
                    }

                    this.index = checkpoint;
                }

                const leaf =
                    createTypedUnitValue(
                        this.win,
                        "number",
                        readReactiveNumber(
                            reactive,
                        ),
                    );

                this.leaves.push({
                    slot: reactive,
                    value: leaf,
                });

                return leaf;
            }

            const typed =
                this.typedByMarker.get(
                    token.marker,
                );

            if (typed) {
                return typed.value;
            }

            throw new SyntaxError(
                `Unknown style slot "${token.marker}"`,
            );
        }

        if (
            token.kind === "symbol" &&
            token.value === "("
        ) {
            const value = this.parseSum();

            this.consumeSymbol(")");

            return value;
        }

        if (token.kind === "identifier") {
            return this.parseFunction(
                token.value,
            );
        }

        throw new SyntaxError(
            "Expected a Typed OM numeric value",
        );
    }

    private parseFunction(
        name: string,
    ): any {
        this.consumeSymbol("(");

        if (name === "calc") {
            const value = this.parseSum();

            this.consumeSymbol(")");

            return value;
        }

        const values: any[] = [];

        if (!this.matchesSymbol(")")) {
            values.push(this.parseSum());

            while (this.matchesSymbol(",")) {
                this.consume();
                values.push(this.parseSum());
            }
        }

        this.consumeSymbol(")");

        if (name === "min") {
            if (values.length === 0) {
                throw new SyntaxError(
                    "min() requires a value",
                );
            }

            return this.createMath(
                "CSSMathMin",
                ...values,
            );
        }

        if (name === "max") {
            if (values.length === 0) {
                throw new SyntaxError(
                    "max() requires a value",
                );
            }

            return this.createMath(
                "CSSMathMax",
                ...values,
            );
        }

        if (name === "clamp") {
            if (values.length !== 3) {
                throw new SyntaxError(
                    "clamp() requires three values",
                );
            }

            return this.createMath(
                "CSSMathClamp",
                values[0],
                values[1],
                values[2],
            );
        }

        throw new SyntaxError(
            `Unsupported Typed OM function "${name}"`,
        );
    }
}

const buildNumericTypedOMTree = (
    cssValue: string,
    win: any,
    reactiveSlots: readonly ReactiveStyleSlot[],
    typedSlots: readonly TypedStyleSlot[],
): NumericTreeResult => {
    const reactiveByMarker =
        new Map<string, ReactiveStyleSlot>();

    const typedByMarker =
        new Map<string, TypedStyleSlot>();

    for (const slot of reactiveSlots) {
        reactiveByMarker.set(
            slot.marker,
            slot,
        );
    }

    for (const slot of typedSlots) {
        typedByMarker.set(
            slot.marker,
            slot,
        );
    }

    const parser =
        new NumericTypedOMParser(
            tokenizeNumericCSS(cssValue),
            win,
            reactiveByMarker,
            typedByMarker,
        );

    return parser.parse();
};

const isTransformStyleProperty = (
    property: string,
): boolean => {
    return property.trim().toLowerCase() === "transform";
};

/**
 * Builds CSSTransformValue from a transform list such as
 * `translate(calc(var(--fest-ref-0) * 1px), calc(var(--fest-ref-1) * 1px))`.
 *
 * INVARIANT: reactive `${ref}px` args become mutable CSS.px leaves (via the
 * numeric parser collapse), not leftover --fest-ref custom properties.
 */
const buildTransformTypedOMTree = (
    cssValue: string,
    win: any,
    reactiveSlots: readonly ReactiveStyleSlot[],
    typedSlots: readonly TypedStyleSlot[],
): NumericTreeResult => {
    const tokens = tokenizeNumericCSS(cssValue);
    const leaves: TypedOMLeaf[] = [];
    const components: any[] = [];

    const reactiveByMarker =
        new Map<string, ReactiveStyleSlot>();
    const typedByMarker =
        new Map<string, TypedStyleSlot>();

    for (const slot of reactiveSlots) {
        reactiveByMarker.set(slot.marker, slot);
    }

    for (const slot of typedSlots) {
        typedByMarker.set(slot.marker, slot);
    }

    const zeroPx = () =>
        createTypedUnitValue(win, "px", 0);
    const oneNumber = () =>
        createTypedUnitValue(win, "number", 1);

    let index = 0;

    const current = () => tokens[index];

    const consume = (): NumericToken => {
        const token = tokens[index];
        if (!token) {
            throw new SyntaxError(
                "Unexpected end of transform expression",
            );
        }
        index++;
        return token;
    };

    const consumeSymbol = (
        symbol: "+" | "-" | "*" | "/" | "(" | ")" | ",",
    ): void => {
        const token = consume();
        if (token.kind !== "symbol" || token.value !== symbol) {
            throw new SyntaxError(`Expected "${symbol}"`);
        }
    };

    const parseArgument = (): any => {
        const start = index;
        let depth = 0;

        while (index < tokens.length) {
            const token = tokens[index];

            if (
                token.kind === "symbol" &&
                token.value === "("
            ) {
                depth++;
                index++;
                continue;
            }

            if (
                token.kind === "symbol" &&
                token.value === ")"
            ) {
                if (depth === 0) break;
                depth--;
                index++;
                continue;
            }

            if (
                token.kind === "symbol" &&
                token.value === "," &&
                depth === 0
            ) {
                break;
            }

            index++;
        }

        const slice = tokens.slice(start, index);
        if (slice.length === 0) {
            throw new SyntaxError(
                "Empty transform function argument",
            );
        }

        const parser = new NumericTypedOMParser(
            slice,
            win,
            reactiveByMarker,
            typedByMarker,
        );
        const tree = parser.parse();
        leaves.push(...tree.leaves);
        return tree.root;
    };

    const parseArgumentList = (): any[] => {
        const args: any[] = [];
        consumeSymbol("(");

        if (
            !(
                current()?.kind === "symbol" &&
                current()?.value === ")"
            )
        ) {
            args.push(parseArgument());

            while (
                current()?.kind === "symbol" &&
                current()?.value === ","
            ) {
                consume();
                args.push(parseArgument());
            }
        }

        consumeSymbol(")");
        return args;
    };

    const createComponent = (
        name: string,
        args: any[],
    ): any => {
        const ctor = (className: string) => {
            const Ctor = getWindowConstructor(win, className);
            if (typeof Ctor !== "function") {
                throw new TypeError(
                    `${className} is not supported`,
                );
            }
            return Ctor;
        };

        switch (name) {
            case "translate": {
                const Translate = ctor("CSSTranslate");
                if (args.length === 1) {
                    return new Translate(args[0], zeroPx());
                }
                if (args.length === 2) {
                    return new Translate(args[0], args[1]);
                }
                if (args.length === 3) {
                    return new Translate(args[0], args[1], args[2]);
                }
                throw new SyntaxError("translate() expects 1..3 args");
            }

            case "translatex":
                return new (ctor("CSSTranslate"))(args[0], zeroPx());

            case "translatey":
                return new (ctor("CSSTranslate"))(zeroPx(), args[0]);

            case "translatez":
                return new (ctor("CSSTranslate"))(
                    zeroPx(),
                    zeroPx(),
                    args[0],
                );

            case "translate3d":
                if (args.length !== 3) {
                    throw new SyntaxError("translate3d() expects 3 args");
                }
                return new (ctor("CSSTranslate"))(
                    args[0],
                    args[1],
                    args[2],
                );

            case "scale": {
                const Scale = ctor("CSSScale");
                if (args.length === 1) {
                    return new Scale(args[0], args[0]);
                }
                if (args.length === 2) {
                    return new Scale(args[0], args[1]);
                }
                if (args.length === 3) {
                    return new Scale(args[0], args[1], args[2]);
                }
                throw new SyntaxError("scale() expects 1..3 args");
            }

            case "scalex":
                return new (ctor("CSSScale"))(args[0], oneNumber());

            case "scaley":
                return new (ctor("CSSScale"))(oneNumber(), args[0]);

            case "scalez":
                return new (ctor("CSSScale"))(
                    oneNumber(),
                    oneNumber(),
                    args[0],
                );

            case "scale3d":
                if (args.length !== 3) {
                    throw new SyntaxError("scale3d() expects 3 args");
                }
                return new (ctor("CSSScale"))(args[0], args[1], args[2]);

            case "rotate": {
                const Rotate = ctor("CSSRotate");
                if (args.length === 1) {
                    return new Rotate(args[0]);
                }
                if (args.length === 4) {
                    return new Rotate(args[0], args[1], args[2], args[3]);
                }
                throw new SyntaxError("rotate() expects 1 or 4 args");
            }

            case "rotatex":
                return new (ctor("CSSRotate"))(
                    oneNumber(),
                    createTypedUnitValue(win, "number", 0),
                    createTypedUnitValue(win, "number", 0),
                    args[0],
                );

            case "rotatey":
                return new (ctor("CSSRotate"))(
                    createTypedUnitValue(win, "number", 0),
                    oneNumber(),
                    createTypedUnitValue(win, "number", 0),
                    args[0],
                );

            case "rotatez":
                return new (ctor("CSSRotate"))(
                    createTypedUnitValue(win, "number", 0),
                    createTypedUnitValue(win, "number", 0),
                    oneNumber(),
                    args[0],
                );

            case "rotate3d":
                if (args.length !== 4) {
                    throw new SyntaxError("rotate3d() expects 4 args");
                }
                return new (ctor("CSSRotate"))(
                    args[0],
                    args[1],
                    args[2],
                    args[3],
                );

            case "skew": {
                const Skew = ctor("CSSSkew");
                if (args.length === 1) {
                    return new Skew(
                        args[0],
                        createTypedUnitValue(win, "deg", 0),
                    );
                }
                if (args.length === 2) {
                    return new Skew(args[0], args[1]);
                }
                throw new SyntaxError("skew() expects 1..2 args");
            }

            case "skewx":
                return new (ctor("CSSSkewX"))(args[0]);

            case "skewy":
                return new (ctor("CSSSkewY"))(args[0]);

            case "perspective":
                return new (ctor("CSSPerspective"))(args[0]);

            default:
                throw new SyntaxError(
                    `Unsupported transform function "${name}"`,
                );
        }
    };

    while (index < tokens.length) {
        const token = consume();

        if (token.kind !== "identifier") {
            throw new SyntaxError(
                "Expected a transform function name",
            );
        }

        const args = parseArgumentList();
        components.push(createComponent(token.value, args));
    }

    if (components.length === 0) {
        throw new SyntaxError("Empty transform list");
    }

    const CSSTransformValueCtor =
        getWindowConstructor(win, "CSSTransformValue");

    if (typeof CSSTransformValueCtor !== "function") {
        throw new TypeError(
            "CSSTransformValue is not supported",
        );
    }

    return {
        root: new CSSTransformValueCtor(components),
        leaves,
    };
};

const buildTypedOMStyleValue = (
    property: string,
    cssValue: string,
    win: any,
    reactiveSlots: readonly ReactiveStyleSlot[],
    typedSlots: readonly TypedStyleSlot[],
): NumericTreeResult => {
    if (isTransformStyleProperty(property)) {
        return buildTransformTypedOMTree(
            cssValue,
            win,
            reactiveSlots,
            typedSlots,
        );
    }

    return buildNumericTypedOMTree(
        cssValue,
        win,
        reactiveSlots,
        typedSlots,
    );
};

const addMutableLeaves = (
    target: Map<string, MutableTypedLeaf[]>,
    leaves: readonly MutableTypedLeaf[],
): void => {
    for (const leaf of leaves) {
        const current =
            target.get(leaf.slot.marker);

        if (current) {
            current.push(leaf);
        } else {
            target.set(
                leaf.slot.marker,
                [leaf],
            );
        }
    }
};

/**
 * Attach declaration identity onto parser leaves so reactive updates can
 * re-set attributeStyleMap after mutating CSSUnitValue.value.
 *
 * WHY: Chromium keeps the live CSSUnitValue identity, but does not refresh
 * the style map / serialization until styleMap.set() is called again.
 */
const attachLeafTargets = (
    leaves: readonly TypedOMLeaf[],
    property: string,
    root: any,
): MutableTypedLeaf[] => {
    return leaves.map((leaf) => ({
        slot: leaf.slot,
        value: leaf.value,
        property,
        root,
    }));
};

/**
 * Applies a parsed S-template.
 *
 * Typed OM objects and their mathematical trees are created once.
 * Reactive updates mutate existing CSSUnitValue leaves only.
 */
const applyStyleTemplate = (
    element: HTMLElement,
    cssText: string,
    typedSlots: readonly TypedStyleSlot[],
    reactiveSlots: readonly ReactiveStyleSlot[],
    variables: ReadonlyMap<string, any>,
): Cleanup => {
    const probe =
        element.ownerDocument.createElement("span");

    probe.style.cssText = cssText;

    applyNormalizedInlineStyle(
        element,
        "",
    );

    const target: any = element;

    const styleMap: any =
        target.attributeStyleMap ??
        target.styleMap;

    const win: any =
        element.ownerDocument.defaultView ??
        globalThis;

    const CSSStyleValueCtor =
        win?.CSSStyleValue ??
        (globalThis as any).CSSStyleValue;

    const mutableLeaves =
        new Map<string, MutableTypedLeaf[]>();

    const requiredCSSVariables =
        new Set<string>();

    const subscriptions: any[] = [];

    for (
        let index = 0;
        index < probe.style.length;
        index++
    ) {
        const property =
            probe.style.item(index);

        const parsedValue =
            probe.style.getPropertyValue(
                property,
            );

        const priority =
            probe.style.getPropertyPriority(
                property,
            );

        const usedTypedSlots =
            typedSlots.filter(slot =>
                containsMarker(
                    parsedValue,
                    slot.marker,
                ),
            );

        const usedReactiveSlots =
            reactiveSlots.filter(slot =>
                containsMarker(
                    parsedValue,
                    slot.marker,
                ),
            );

        if (
            usedTypedSlots.length === 0 &&
            usedReactiveSlots.length === 0
        ) {
            element.style.setProperty(
                property,
                parsedValue,
                priority,
            );

            continue;
        }

        const canUseTypedOM =
            styleMap?.set &&
            !priority &&
            !property.startsWith("--");

        let appliedThroughTypedOM = false;

        if (
            canUseTypedOM &&
            usedReactiveSlots.length > 0
        ) {
            try {
                const directSlot =
                    usedReactiveSlots.length === 1 &&
                    usedTypedSlots.length === 0
                        ? usedReactiveSlots[0]
                        : null;

                if (
                    directSlot &&
                    isDirectSlotUnitProduct(
                        parsedValue,
                        directSlot.marker,
                        directSlot.multipliedByUnit,
                    )
                ) {
                    /*
                     * `${ref}px`
                     *
                     * CSS.px() is called once. styleMap.set() is called
                     * once. The subscription later mutates only .value.
                     */
                    const linkedValue =
                        createTypedUnitValue(
                            win,
                            directSlot.multipliedByUnit!,
                            readReactiveNumber(
                                directSlot,
                            ),
                        );

                    styleMap.set(
                        property,
                        linkedValue,
                    );

                    addMutableLeaves(
                        mutableLeaves,
                        attachLeafTargets(
                            [{
                                slot: directSlot,
                                value: linkedValue,
                            }],
                            property,
                            linkedValue,
                        ),
                    );

                    appliedThroughTypedOM = true;
                } else if (
                    directSlot &&
                    isDirectSlotValue(
                        parsedValue,
                        directSlot.marker,
                    )
                ) {
                    /*
                     * Unitless `${ref}` becomes one persistent
                     * CSS.number(ref.value).
                     */
                    const linkedValue =
                        createTypedUnitValue(
                            win,
                            "number",
                            readReactiveNumber(
                                directSlot,
                            ),
                        );

                    styleMap.set(
                        property,
                        linkedValue,
                    );

                    addMutableLeaves(
                        mutableLeaves,
                        attachLeafTargets(
                            [{
                                slot: directSlot,
                                value: linkedValue,
                            }],
                            property,
                            linkedValue,
                        ),
                    );

                    appliedThroughTypedOM = true;
                } else {
                    /*
                     * Numeric calc()/min()/max()/clamp() and transform lists
                     * become one persistent Typed OM object graph.
                     *
                     * `${ref}px` args collapse to mutable CSS.px leaves.
                     */
                    const tree =
                        buildTypedOMStyleValue(
                            property,
                            parsedValue,
                            win,
                            usedReactiveSlots,
                            usedTypedSlots,
                        );

                    styleMap.set(
                        property,
                        tree.root,
                    );

                    addMutableLeaves(
                        mutableLeaves,
                        attachLeafTargets(
                            tree.leaves,
                            property,
                            tree.root,
                        ),
                    );

                    appliedThroughTypedOM = true;
                }
            } catch {
                // The declaration will use the CSS-variable fallback.
            }
        }

        if (appliedThroughTypedOM) {
            continue;
        }

        if (
            canUseTypedOM &&
            usedReactiveSlots.length === 0 &&
            usedTypedSlots.length > 0
        ) {
            try {
                const directSlot =
                    usedTypedSlots.length === 1
                        ? usedTypedSlots[0]
                        : null;

                if (
                    directSlot &&
                    isDirectSlotValue(
                        parsedValue,
                        directSlot.marker,
                    )
                ) {
                    styleMap.set(
                        property,
                        directSlot.value,
                    );

                    appliedThroughTypedOM = true;
                } else if (
                    directSlot &&
                    isDirectSlotUnitProduct(
                        parsedValue,
                        directSlot.marker,
                        directSlot.multipliedByUnit,
                    )
                ) {
                    const CSSMathProductCtor =
                        getWindowConstructor(
                            win,
                            "CSSMathProduct",
                        );

                    if (
                        typeof CSSMathProductCtor !==
                        "function"
                    ) {
                        throw new TypeError(
                            "CSSMathProduct is not supported",
                        );
                    }

                    const product =
                        new CSSMathProductCtor(
                            directSlot.value,
                            createTypedUnitValue(
                                win,
                                directSlot.multipliedByUnit!,
                                1,
                            ),
                        );

                    styleMap.set(
                        property,
                        product,
                    );

                    appliedThroughTypedOM = true;
                } else {
                    /*
                     * First try an object graph so original native
                     * CSSNumericValue / transform instances remain in the tree.
                     */
                    try {
                        const tree =
                            buildTypedOMStyleValue(
                                property,
                                parsedValue,
                                win,
                                [],
                                usedTypedSlots,
                            );

                        styleMap.set(
                            property,
                            tree.root,
                        );
                    } catch {
                        const reconstructed =
                            replaceTypedMarkers(
                                parsedValue,
                                usedTypedSlots,
                            );

                        setParsedTypedValue(
                            styleMap,
                            CSSStyleValueCtor,
                            property,
                            reconstructed,
                        );
                    }

                    appliedThroughTypedOM = true;
                }
            } catch {
                // Unsupported native Typed OM declaration uses text.
            }
        }

        if (appliedThroughTypedOM) {
            continue;
        }

        /*
         * Fallback:
         *
         * - native CSS.* markers are serialized;
         * - reactive markers remain var(--fest-ref-*);
         * - bindWith/handleStyleChange updates those custom properties.
         */
        const reconstructed =
            replaceTypedMarkers(
                parsedValue,
                usedTypedSlots,
            );

        element.style.setProperty(
            property,
            reconstructed,
            priority,
        );

        for (const slot of usedReactiveSlots) {
            requiredCSSVariables.add(
                slot.marker,
            );
        }
    }

    /*
     * One subscription per reactive slot.
     *
     * A slot may update:
     *
     * - one or more persistent CSSUnitValue leaves;
     * - a CSS custom property fallback;
     * - both, if the ref is used in different declarations.
     */
    for (const slot of reactiveSlots) {
        const leaves =
            mutableLeaves.get(slot.marker) ?? [];

        const needsCSSVariable =
            requiredCSSVariables.has(
                slot.marker,
            );

        if (
            leaves.length === 0 &&
            !needsCSSVariable
        ) {
            continue;
        }

        const subscription = bindWith(
            element,
            slot.marker,
            slot.value,
            function (
                this: any,
                ...args: any[]
            ): void {
                if (leaves.length > 0) {
                    try {
                        const nextValue =
                            readReactiveNumber(
                                slot,
                            );

                        const dirtyRoots =
                            new Map<string, any>();

                        for (const leaf of leaves) {
                            /*
                             * No new CSS.px() / CSSTransformValue /
                             * CSSMathProduct — mutate the live leaf only.
                             */
                            leaf.value.value =
                                nextValue;

                            dirtyRoots.set(
                                leaf.property,
                                leaf.root,
                            );
                        }

                        /*
                         * WHY: Chromium does not refresh attributeStyleMap
                         * serialization after in-place CSSUnitValue.value
                         * mutation; re-set the same Typed OM root.
                         */
                        if (styleMap?.set) {
                            for (const [
                                propertyName,
                                root,
                            ] of dirtyRoots) {
                                styleMap.set(
                                    propertyName,
                                    root,
                                );
                            }
                        }
                    } catch {
                        // Preserve the last valid Typed OM value.
                    }
                }

                if (needsCSSVariable) {
                    (
                        handleStyleChange as any
                    ).apply(
                        this,
                        args,
                    );
                }
            },
        );

        subscriptions.push(
            subscription,
        );
    }

    /*
     * Preserve existing fallback behavior when a variable did not
     * participate in a successfully parsed declaration.
     */
    for (const name of requiredCSSVariables) {
        if (
            reactiveSlots.some(
                slot => slot.marker === name,
            )
        ) {
            continue;
        }

        const value = variables.get(name);

        if (value == null) continue;

        subscriptions.push(
            bindWith(
                element,
                name,
                value,
                handleStyleChange,
            ),
        );
    }

    pruneEmptyStyleAttribute(element);

    return () => {
        for (const subscription of subscriptions) {
            subscription?.();
        }
    };
};

/**
 * Inline-style tagged template.
 */
export const S = (
    strings: TemplateStringsArray,
    ...values: any[]
): StyleBinding => {
    const templateId =
        styleTemplateId++;

    const properties: string[] = [];
    const variables =
        new Map<string, any>();

    const typedSlots:
        TypedStyleSlot[] = [];

    const reactiveSlots:
        ReactiveStyleSlot[] = [];

    const parts: string[] = [];

    /*
     * `${value}px` consumes "px" from the next static fragment.
     */
    const consumed =
        new Array(strings.length).fill(0);

    for (
        let index = 0;
        index < strings.length;
        index++
    ) {
        parts.push(
            strings[index].slice(
                consumed[index],
            ),
        );

        if (index >= values.length) {
            continue;
        }

        const value =
            values[index];

        const nextText =
            strings[index + 1] ?? "";

        const attachedUnit =
            readAttachedCSSUnit(
                nextText,
            );

        if (isNativeCSSStyleValue(value)) {
            const marker =
                `--fest-typed-${templateId}-${typedSlots.length}`;

            typedSlots.push({
                marker,
                value,
                multipliedByUnit:
                    attachedUnit?.normalized,
            });

            if (attachedUnit) {
                parts.push(
                    `calc(var(${marker}) * ` +
                    `1${attachedUnit.authored})`,
                );

                consumed[index + 1] +=
                    attachedUnit.length;
            } else {
                parts.push(
                    `var(${marker})`,
                );
            }

            continue;
        }

        if (isReactiveStyleValue(value)) {
            const marker =
                `--fest-ref-${templateId}-${reactiveSlots.length}`;

            reactiveSlots.push({
                marker,
                value,
                multipliedByUnit:
                    attachedUnit?.normalized,
            });

            if (attachedUnit) {
                /*
                 * Valid CSS fallback / probe authoring:
                 *
                 * calc(var(--fest-ref-*) * 1px)
                 *
                 * Typed OM collapses this to one persistent CSS.px(ref.value)
                 * (and for transform lists, CSSTransformValue + CSSTranslate).
                 */
                parts.push(
                    `calc(var(${marker}) * ` +
                    `1${attachedUnit.authored})`,
                );

                consumed[index + 1] +=
                    attachedUnit.length;
            } else {
                parts.push(
                    `var(${marker})`,
                );
            }

            const initialValue =
                getReactiveInitialNumber(
                    value,
                );

            properties.push(
                `@property ${marker} { ` +
                `syntax: "<number>"; ` +
                `initial-value: ${initialValue}; ` +
                `inherits: true; ` +
                `};`,
            );

            variables.set(
                marker,
                value,
            );

            continue;
        }

        if (
            typeof value !== "object" &&
            typeof value !== "function" &&
            value != null &&
            String(value).trim() !== ""
        ) {
            /*
             * Primitive interpolation retains ordinary template
             * semantics: `${10}px` becomes `10px`.
             */
            parts.push(
                String(value),
            );
        }
    }

    return [
        (element: HTMLElement): Cleanup => {
            return applyStyleTemplate(
                element,
                parts.join(""),
                typedSlots,
                reactiveSlots,
                variables,
            );
        },
        properties,
        variables,
    ];
};

export const css = (
    strings: TemplateStringsArray,
    ...values: any[]
): StyleBinding => {
    return S(
        strings,
        ...values,
    );
};

const splitInlineStylePlaceholders = (
    source: string,
    attributes: readonly any[],
): InlineStyleTemplateParts | null => {
    const strings: string[] = [];
    const values: any[] = [];

    const pattern = /#\{(\d+)\}/g;

    let cursor = 0;
    let match: RegExpExecArray | null;

    while (
        (match = pattern.exec(source)) != null
    ) {
        const attributeIndex =
            Number.parseInt(
                match[1],
                10,
            );

        if (
            !Number.isSafeInteger(
                attributeIndex,
            ) ||
            attributeIndex < 0
        ) {
            continue;
        }

        strings.push(
            source.slice(
                cursor,
                match.index,
            ),
        );

        values.push(
            attributes[attributeIndex],
        );

        cursor =
            match.index +
            match[0].length;
    }

    if (values.length === 0) {
        return null;
    }

    strings.push(
        source.slice(cursor),
    );

    return {
        strings,
        values,
    };
};

const joinStaticInlineStyle = (
    strings: readonly string[],
    values: readonly any[],
): string => {
    let result =
        strings[0] ?? "";

    for (
        let index = 0;
        index < values.length;
        index++
    ) {
        const value =
            values[index];

        if (value != null) {
            result += String(value);
        }

        result +=
            strings[index + 1] ?? "";
    }

    return result;
};

/**
 * Converts an H style attribute containing internal #{n}
 * placeholders into static CSS, a direct legacy binding, or S.
 */
export const compileInlineStyleAttribute = (
    source: string,
    attributes: readonly any[],
): InlineStyleAttributePlan | null => {
    const parsed =
        splitInlineStylePlaceholders(
            source,
            attributes,
        );

    if (!parsed) {
        return null;
    }

    const {
        strings,
        values,
    } = parsed;

    const isWholeAttributeValue =
        values.length === 1 &&
        (strings[0] ?? "").trim() === "" &&
        (strings[1] ?? "").trim() === "";

    /*
     * Preserve the existing style="${styleObject}" contract.
     * There is no <property>: <value> declaration to parse here.
     */
    if (
        isWholeAttributeValue &&
        !isStaticStyleInterpolation(values[0]) &&
        !isNativeCSSStyleValue(values[0])
    ) {
        return {
            kind: "direct",
            value: values[0],
        };
    }

    const containsDynamicValue =
        values.some(value =>
            isReactiveStyleValue(value) ||
            isNativeCSSStyleValue(value),
        );

    if (containsDynamicValue) {
        return {
            kind: "template",
            binding: S(
                strings as unknown as
                    TemplateStringsArray,
                ...values,
            ),
        };
    }

    /*
     * Primitive-only long style attributes remain one normal
     * attribute string without refs, subscriptions or Typed OM.
     */
    if (
        values.every(
            isStaticStyleInterpolation,
        )
    ) {
        return {
            kind: "static",
            cssText:
                joinStaticInlineStyle(
                    strings,
                    values,
                ),
        };
    }

    return {
        kind: "template",
        binding: S(
            strings as unknown as
                TemplateStringsArray,
            ...values,
        ),
    };
};

/**
 * Applies an S tuple or a standalone S applicator.
 */
export const bindStyle = (
    element: HTMLElement,
    styled:
        | StyleBinding
        | StyleBinding[0]
        | any,
): Cleanup => {
    const apply =
        Array.isArray(styled)
            ? styled[0]
            : styled;

    if (typeof apply !== "function") {
        return () => {};
    }

    const result =
        apply(element);

    return () => {
        if (typeof result === "function") {
            result();
            return;
        }

        result?.unbind?.();
    };
};