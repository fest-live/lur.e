import { addEvents } from "fest/dom";

//
const defaultOptions = {
    anyPointer: true,
    mouseImmediate: true,
    minHoldTime: 100,
    maxHoldTime: 2000,
    maxOffsetRadius: 10
};

//
const preventor: [(ev: PointerEvent) => void, AddEventListenerOptions] = [
    (ev: PointerEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
}, { once: true }]

//
export class LongPressHandler {
    #holder: HTMLElement;
    #preventedPointers: Set<number>;
    //
    constructor(holder,  options: any = {...defaultOptions}, fx?: (ev: PointerEvent) => void) {
        (this.#holder = holder)["@control"] = this;
        this.#preventedPointers = new Set();
        if (!holder) { throw Error("Element is null..."); }
        if (!options) { options = {...defaultOptions}; }
        const currentClone = {...options};
        Object.assign(options, defaultOptions, currentClone);
        if (options) { this.longPress(options, fx); }
    }

    //
    defaultHandler(ev, weakRef: WeakRef<HTMLElement>) {
        return weakRef?.deref()?.dispatchEvent?.(new PointerEvent("long-press", {...ev, bubbles: true}));
    }

    //
    longPress(options: any = {...defaultOptions}, fx?: (ev: PointerEvent) => void) {
        const ROOT = document.documentElement;
        const weakRef = new WeakRef(this.#holder);
        const actionState = this.initializeActionState();

        //
        this.holding = {
            actionState,
            options, fx: fx || ((ev) => this.defaultHandler(ev, weakRef))
        }

        // Event listeners
        const pointerDownListener = (ev: PointerEvent) => this.onPointerDown(this.holding, ev, weakRef);
        const pointerMoveListener = (ev: PointerEvent) => this.onPointerMove(this.holding, ev);
        const pointerUpListener   = (ev: PointerEvent) => this.onPointerUp(this.holding, ev);

        //
        addEvents(ROOT, {
            "pointerdown": pointerDownListener,
            "pointermove": pointerMoveListener,
            "pointerup"  : pointerUpListener,
            "pointercancel": pointerUpListener
        });
    }

    //
    private initializeActionState() {
        return {
            timerId: null,
            immediateTimerId: null,
            pointerId: -1,
            startCoord: [0, 0] as [number, number],
            lastCoord: [0, 0] as [number, number],
            isReadyForLongPress: false,
            cancelCallback: () => {},
            cancelPromiseResolver: null as (() => void) | null,
            cancelPromiseRejector: null as ((reason?: any) => void) | null,
        };
    }

    //
    private preventFromClicking(self: any, ev: PointerEvent) {
        if (!this.#preventedPointers.has(ev.pointerId)) {
            this.#preventedPointers.add(ev.pointerId);

            self?.addEventListener?.("click", ...preventor);
            self?.addEventListener?.("contextmenu", ...preventor);
        }
    }

    //
    private releasePreventing(self: any, pointerId: number) {
        if (this.#preventedPointers.has(pointerId)) {
            this.#preventedPointers.delete(pointerId);
            self?.removeEventListener?.("click", ...preventor);
            self?.removeEventListener?.("contextmenu", ...preventor);
        }
    }

    //
    private onPointerDown(self: any, ev: PointerEvent, weakRef: WeakRef<HTMLElement>) {
        if (
            !this.isValidTarget(self, ev.target as HTMLElement, weakRef) ||
            !(self.options?.anyPointer || ev?.pointerType == "touch")
        ) return;

        //
        ev.preventDefault();
        this.resetAction(self, self.actionState);

        // Initialize state
        const { actionState }  = self;
        actionState.pointerId  = ev.pointerId;
        actionState.startCoord = [ev.clientX, ev.clientY];
        actionState.lastCoord  = [...actionState.startCoord];

        // Set up cancellation promise
        const $withResolver = Promise.withResolvers<void>();
        actionState.cancelPromiseResolver = $withResolver.resolve;
        actionState.cancelPromiseRejector = $withResolver.reject;
        actionState.cancelCallback = () => {
            clearTimeout(actionState.timerId!);
            clearTimeout(actionState.immediateTimerId!);
            actionState.isReadyForLongPress = false;
            $withResolver.resolve();
            this.resetAction(self, actionState);
        };
        // Immediate trigger timer
        if (self.options?.mouseImmediate && ev.pointerType === "mouse") {
            self.fx?.(ev);
            return actionState.cancelCallback();
        }

        // Long press timer
        actionState.timerId = setTimeout(() => {
            actionState.isReadyForLongPress = true;
        }, self.options?.minHoldTime);

        // Start timers for long press and immediate actions
        actionState.immediateTimerId = setTimeout(() => {
            if (this.isInPlace(self)) {
                this.preventFromClicking(self, ev);

                //
                self.fx?.(ev);
                actionState.cancelCallback();
            }
        }, self.options?.maxHoldTime);

        // Cancel promise handling
        Promise.race([
            $withResolver.promise,
            new Promise<void>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000)),
        ]).catch(console.warn);
    }

    //
    private onPointerMove(self: any, ev: PointerEvent) {
        const {actionState} = self;
        if (ev.pointerId !== actionState.pointerId) return;
        actionState.lastCoord = [ev.clientX, ev.clientY];

        //
        if (!this.isInPlace(self)) { return actionState.cancelCallback(); }

        //
        this.preventFromClicking(self, ev);
        actionState.startCoord = [ev.clientX, ev.clientY];
    }

    //
    private resetAction(self: any, actionState: any) {
        this.releasePreventing(self, actionState.pointerId);
        actionState.pointerId               = -1;
        actionState.cancelPromiseResolver   = null;
        actionState.cancelPromiseRejector   = null;
        actionState.isReadyForLongPress     = false;
        actionState.cancelCallback          = null;
    }

    //
    private onPointerUp(self: any, ev: PointerEvent) {
        const {actionState} = self;
        if (ev.pointerId !== actionState.pointerId) return;
        actionState.lastCoord = [ev.clientX, ev.clientY];

        if (actionState.isReadyForLongPress && this.isInPlace(self)) {
            self.fx?.(ev);
            this.preventFromClicking(self, ev);
        }

        actionState.cancelCallback();
        this.resetAction(self, actionState);
    }

    //
    private holding: any = { fx: null, options: {}, actionState: {} }
    private hasParent(current, parent) { while (current) { if (current === parent) return true; current = current.parentElement; } }
    private isInPlace(self: any): boolean {
        const {actionState}    = self;
        const [startX, startY] = actionState.startCoord;
        const [lastX, lastY]   = actionState.lastCoord;
        const  distance        = Math.hypot(lastX - startX, lastY - startY);
        return distance <= (self.options?.maxOffsetRadius);
    }

    //
    private isValidTarget(self: any, target: HTMLElement, weakRef: WeakRef<HTMLElement>): boolean|null|undefined {
        const weakElement = weakRef?.deref?.();
        return (
            weakElement && (this.hasParent(target, weakElement) || target === weakElement) &&
            (!self.options?.handler || target.matches(self.options?.handler))
        );
    }
}

//
export default LongPressHandler;
