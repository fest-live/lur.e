import { addEvents, blockClickTrigger } from "fest/dom";

//
export class LongPressHandler {
    #holder: HTMLElement;

    //
    constructor(holder,  options: any = {}, fx?: (ev: PointerEvent) => void) {
        (this.#holder = holder)["@control"] = this;
        if (!holder) { throw Error("Element is null..."); }
        if (options) { this.longPress(options, fx); }
    }

    //
    defaultHandler(ev, weakRef: WeakRef<HTMLElement>) {
        return weakRef?.deref()?.dispatchEvent?.(new PointerEvent("long-press", {...ev, bubbles: true}));
    }

    //
    longPress(options: any = {}, fx?: (ev: PointerEvent) => void) {
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
    private onPointerDown(self: any, ev: PointerEvent, weakRef: WeakRef<HTMLElement>) {
        if (
            !this.isValidTarget(self, ev.target as HTMLElement, weakRef) ||
            !(self.options.anyPointer || ev?.pointerType == "touch")
        ) return;

        //
        ev.preventDefault();

        // Initialize state
        const { actionState }  = self;
        actionState.pointerId  = ev.pointerId;
        actionState.startCoord = [ev.clientX, ev.clientY];
        actionState.lastCoord  = [...actionState.startCoord];

        // Set up cancellation promise
        const cancelPromise = new Promise<void>((resolve, reject) => {
            actionState.cancelPromiseResolver = resolve;
            actionState.cancelPromiseRejector = reject;
            actionState.cancelCallback = () => {
                clearTimeout(actionState.timerId!);
                clearTimeout(actionState.immediateTimerId!);
                actionState.isReadyForLongPress = false;
                resolve();
                this.resetAction(actionState);
            };
        });

        // Immediate trigger timer
        if (self.options.mouseImmediate && ev.pointerType === "mouse") {
            self.fx?.(ev);
            return actionState.cancelCallback();
        }

        // Long press timer
        actionState.timerId = setTimeout(() => {
            actionState.isReadyForLongPress = true;
        }, self.options.minHoldTime ?? 300);

        // Start timers for long press and immediate actions
        actionState.immediateTimerId = setTimeout(() => {
            if (this.isInPlace(self)) {
                self.fx?.(ev);
                actionState.cancelCallback();
            }
        }, self.options.maxHoldTime ?? 600);

        // Cancel promise handling
        Promise.race([
            cancelPromise,
            new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 5000)
            ),
        ]).catch(console.warn);
    }

    //
    private onPointerMove(self: any, ev: PointerEvent) {
        const {actionState} = self;
        if (ev.pointerId !== actionState.pointerId) return;
        actionState.lastCoord = [ev.clientX, ev.clientY];

        if (!this.isInPlace(self)) {
            actionState.cancelCallback();
        }
    }

    //
    private resetAction(actionState) {
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
            blockClickTrigger(ev);
        }

        actionState.cancelCallback();
    }

    //
    private holding: any = { fx: null, options: {}, actionState: {} }
    private hasParent(current, parent) { while (current) { if (current === parent) return true; current = current.parentElement; } }
    private isInPlace(self: any): boolean {
        const {actionState}    = self;
        const [startX, startY] = actionState.startCoord;
        const [lastX, lastY]   = actionState.lastCoord;
        const  distance        = Math.hypot(lastX - startX, lastY - startY);
        return distance <= (self.options.maxOffsetRadius ?? 10);
    }

    //
    private isValidTarget(self: any, target: HTMLElement, weakRef: WeakRef<HTMLElement>): boolean|null|undefined {
        const weakElement = weakRef?.deref?.();
        return (
            weakElement && (this.hasParent(target, weakElement) || target === weakElement) &&
            (!self.options.handler || target.matches(self.options.handler))
        );
    }
}

//
export default LongPressHandler;
