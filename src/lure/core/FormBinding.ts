/**
 * Lifecycle-aware form control bindings built on existing Linker presets.
 * Keeps form semantics in Links/object while Binding owns connection tracking.
 */

import { addToCallChain, booleanRef, numberRef, stringRef } from "@fest-lib/object";
import { bindWhileConnected } from "./Binding";
import {
    formLink,
    type FormKind,
    type FormLinkOptions,
} from "./Links";

export type FormControlOptions = FormLinkOptions & {
    /** Bind immediately (false) or follow element connection state (default). */
    connect?: boolean;
};

/**
 * Bind a control through the Linker presets, optionally tracking mount/unmount.
 * The returned disposer is also attached to a reactive ref's Symbol.dispose.
 */
export const bindFormControl = (
    element: Element | null | undefined,
    value: any,
    kind: FormKind = "text",
    options: FormControlOptions = {},
): (() => void) => {
    if (!element) return () => {};
    const bind = () => formLink(element, value, kind, options) ?? (() => {});
    const dispose = options.connect === false ? bind() : bindWhileConnected(element, bind);
    if (value && (typeof value === "object" || typeof value === "function")) {
        addToCallChain(value, Symbol.dispose, dispose);
    }
    return dispose;
};

/** Create a type-appropriate ref and bind it to a common form control family. */
export const formRef = (
    element: Element | null | undefined,
    kind: FormKind = "text",
    options: FormControlOptions = {},
) => {
    const initial = options.initial;
    const value = kind === "number"
        ? numberRef(Number(initial) || 0)
        : kind === "checked"
            ? booleanRef(Boolean(initial))
            : stringRef(initial == null ? "" : String(initial));
    bindFormControl(element, value, kind, options);
    return value;
};
