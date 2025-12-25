import { numberRef, subscribe } from "fest/object";
import { addEvents, removeEvents, addEvent, removeEvent } from "fest/dom";

//
export interface GestureOptions {
    enableMomentum?: boolean;
    momentumDecay?: number;
    minVelocity?: number;
    maxVelocity?: number;
    enablePinch?: boolean;
    pinchThreshold?: number;
    enableSwipe?: boolean;
    swipeThreshold?: number;
    touchAction?: string;
}

// Enhanced gesture recognition for scrollbars
export class EnhancedGestureHandler {
    element: HTMLElement;
    options: GestureOptions;

    // Gesture state
    isActive = false;
    startTime = 0;
    startPosition = { x: 0, y: 0 };
    currentPosition = { x: 0, y: 0 };
    velocity = { x: 0, y: 0 };
    lastPosition = { x: 0, y: 0 };
    lastTime = 0;

    // Multi-touch state
    pointers = new Map<number, PointerEvent>();
    initialDistance = 0;
    currentDistance = 0;

    // Callbacks
    onStart?: (gesture: any) => void;
    onMove?: (gesture: any) => void;
    onEnd?: (gesture: any) => void;
    onMomentum?: (velocity: { x: number; y: number }) => void;
    onSwipe?: (direction: string, velocity: number) => void;
    onPinch?: (scale: number, center: { x: number; y: number }) => void;

    // Animation frame for momentum
    momentumFrame?: number;

    constructor(element: HTMLElement, options: GestureOptions = {}) {
        this.element = element;
        this.options = {
            enableMomentum: true,
            momentumDecay: 0.95,
            minVelocity: 0.01,
            maxVelocity: 4,
            enablePinch: false,
            pinchThreshold: 10,
            enableSwipe: true,
            swipeThreshold: 50,
            touchAction: 'none',
            ...options
        };

        this.setupEventListeners();
        this.element.style.touchAction = this.options.touchAction!;
    }

    private setupEventListeners() {
        const events = {
            'pointerdown': this.handlePointerDown.bind(this),
            'pointermove': this.handlePointerMove.bind(this),
            'pointerup': this.handlePointerUp.bind(this),
            'pointercancel': this.handlePointerCancel.bind(this),
            'pointerleave': this.handlePointerCancel.bind(this)
        };

        addEvents(this.element, events);
    }

    private handlePointerDown(event: PointerEvent) {
        event.preventDefault();

        this.pointers.set(event.pointerId, event);
        this.element.setPointerCapture(event.pointerId);

        if (this.pointers.size === 1) {
            // Single touch start
            this.startGesture(event);
        } else if (this.pointers.size === 2 && this.options.enablePinch) {
            // Multi-touch start (pinch)
            this.startPinch();
        }
    }

    private handlePointerMove(event: PointerEvent) {
        event.preventDefault();

        this.pointers.set(event.pointerId, event);

        if (this.pointers.size === 1 && this.isActive) {
            // Single touch move
            this.updateGesture(event);
        } else if (this.pointers.size === 2 && this.options.enablePinch) {
            // Multi-touch move (pinch)
            this.updatePinch();
        }
    }

    private handlePointerUp(event: PointerEvent) {
        event.preventDefault();

        this.pointers.delete(event.pointerId);
        this.element.releasePointerCapture(event.pointerId);

        if (this.pointers.size === 0 && this.isActive) {
            // Gesture end
            this.endGesture();
        }
    }

    private handlePointerCancel(event: PointerEvent) {
        this.pointers.delete(event.pointerId);
        this.element.releasePointerCapture(event.pointerId);

        if (this.pointers.size === 0 && this.isActive) {
            this.cancelGesture();
        }
    }

    private startGesture(event: PointerEvent) {
        this.isActive = true;
        this.startTime = performance.now();
        this.lastTime = this.startTime;

        this.startPosition = { x: event.clientX, y: event.clientY };
        this.currentPosition = { ...this.startPosition };
        this.lastPosition = { ...this.startPosition };

        this.velocity = { x: 0, y: 0 };

        this.onStart?.({
            startPosition: this.startPosition,
            timestamp: this.startTime
        });
    }

    private updateGesture(event: PointerEvent) {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        this.lastPosition = { ...this.currentPosition };
        this.currentPosition = { x: event.clientX, y: event.clientY };

        if (deltaTime > 0) {
            this.velocity.x = (this.currentPosition.x - this.lastPosition.x) / deltaTime;
            this.velocity.y = (this.currentPosition.y - this.lastPosition.y) / deltaTime;

            // Clamp velocity
            this.velocity.x = Math.max(-this.options.maxVelocity!, Math.min(this.options.maxVelocity!, this.velocity.x));
            this.velocity.y = Math.max(-this.options.maxVelocity!, Math.min(this.options.maxVelocity!, this.velocity.y));
        }

        this.lastTime = currentTime;

        this.onMove?.({
            currentPosition: this.currentPosition,
            delta: {
                x: this.currentPosition.x - this.lastPosition.x,
                y: this.currentPosition.y - this.lastPosition.y
            },
            velocity: this.velocity,
            timestamp: currentTime
        });
    }

    private endGesture() {
        this.isActive = false;

        const gestureDuration = performance.now() - this.startTime;
        const totalDelta = {
            x: this.currentPosition.x - this.startPosition.x,
            y: this.currentPosition.y - this.startPosition.y
        };

        // Check for swipe gesture
        if (this.options.enableSwipe! && gestureDuration < 500) {
            const distance = Math.hypot(totalDelta.x, totalDelta.y);
            if (distance > this.options.swipeThreshold!) {
                const angle = Math.atan2(totalDelta.y, totalDelta.x) * 180 / Math.PI;
                let direction = '';

                if (angle >= -45 && angle < 45) direction = 'right';
                else if (angle >= 45 && angle < 135) direction = 'down';
                else if (angle >= -135 && angle < -45) direction = 'up';
                else direction = 'left';

                const speed = Math.hypot(this.velocity.x, this.velocity.y);
                this.onSwipe?.(direction, speed);
            }
        }

        // Start momentum scrolling
        if (this.options.enableMomentum! &&
            Math.hypot(this.velocity.x, this.velocity.y) > this.options.minVelocity!) {
            this.startMomentum();
        }

        this.onEnd?.({
            startPosition: this.startPosition,
            endPosition: this.currentPosition,
            totalDelta,
            velocity: this.velocity,
            duration: gestureDuration
        });
    }

    private cancelGesture() {
        this.isActive = false;
        if (this.momentumFrame) {
            cancelAnimationFrame(this.momentumFrame);
            this.momentumFrame = undefined;
        }
    }

    private startPinch() {
        const pointers = Array.from(this.pointers.values());
        const p1 = pointers[0];
        const p2 = pointers[1];

        this.initialDistance = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    }

    private updatePinch() {
        if (!this.options.enablePinch) return;

        const pointers = Array.from(this.pointers.values());
        const p1 = pointers[0];
        const p2 = pointers[1];

        this.currentDistance = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);

        if (Math.abs(this.currentDistance - this.initialDistance) > this.options.pinchThreshold!) {
            const scale = this.currentDistance / this.initialDistance;
            const center = {
                x: (p1.clientX + p2.clientX) / 2,
                y: (p1.clientY + p2.clientY) / 2
            };

            this.onPinch?.(scale, center);
        }
    }

    private startMomentum() {
        let currentVelocity = { ...this.velocity };

        const animate = () => {
            // Apply decay
            currentVelocity.x *= this.options.momentumDecay!;
            currentVelocity.y *= this.options.momentumDecay!;

            // Check if momentum is still significant
            if (Math.hypot(currentVelocity.x, currentVelocity.y) > this.options.minVelocity!) {
                this.onMomentum?.(currentVelocity);
                this.momentumFrame = requestAnimationFrame(animate);
            } else {
                this.momentumFrame = undefined;
            }
        };

        this.momentumFrame = requestAnimationFrame(animate);
    }

    // Public API
    setCallbacks(callbacks: {
        onStart?: (gesture: any) => void;
        onMove?: (gesture: any) => void;
        onEnd?: (gesture: any) => void;
        onMomentum?: (velocity: { x: number; y: number }) => void;
        onSwipe?: (direction: string, velocity: number) => void;
        onPinch?: (scale: number, center: { x: number; y: number }) => void;
    }) {
        Object.assign(this, callbacks);
    }

    destroy() {
        if (this.momentumFrame) {
            cancelAnimationFrame(this.momentumFrame);
        }

        removeEvents(this.element, ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerleave']);
        this.pointers.clear();
    }
}

// Specialized scrollbar gesture handler
export class ScrollbarGestureHandler extends EnhancedGestureHandler {
    private scrollbar: HTMLElement;
    private content: HTMLElement;
    private axis: 'horizontal' | 'vertical';
    private scrollPosition = 0;

    constructor(scrollbar: HTMLElement, content: HTMLElement, axis: 'horizontal' | 'vertical', options?: GestureOptions) {
        super(scrollbar, {
            enableMomentum: true,
            enableSwipe: false,
            enablePinch: false,
            ...options
        });

        this.scrollbar = scrollbar;
        this.content = content;
        this.axis = axis;

        this.setCallbacks({
            onStart: this.handleGestureStart.bind(this),
            onMove: this.handleGestureMove.bind(this),
            onEnd: this.handleGestureEnd.bind(this),
            onMomentum: this.handleMomentum.bind(this)
        });
    }

    private handleGestureStart(gesture: any) {
        // Store initial scroll position
        this.scrollPosition = this.axis === 'horizontal'
            ? this.content.scrollLeft
            : this.content.scrollTop;
    }

    private handleGestureMove(gesture: any) {
        const scrollbarSize = this.axis === 'horizontal'
            ? this.scrollbar.offsetWidth
            : this.scrollbar.offsetHeight;

        const contentSize = this.axis === 'horizontal'
            ? this.content.scrollWidth
            : this.content.scrollHeight;

        const containerSize = this.axis === 'horizontal'
            ? this.content.clientWidth
            : this.content.clientHeight;

        if (containerSize >= contentSize) return; // No scrolling needed

        // Calculate scroll delta based on gesture delta
        const scrollbarRatio = containerSize / contentSize;
        const effectiveScrollbarSize = scrollbarSize * scrollbarRatio;

        const delta = this.axis === 'horizontal' ? gesture.delta.x : gesture.delta.y;
        const scrollDelta = (delta / (scrollbarSize - effectiveScrollbarSize)) * (contentSize - containerSize);

        const newScrollPosition = Math.max(0, Math.min(
            contentSize - containerSize,
            this.scrollPosition + scrollDelta
        ));

        // Update content scroll position
        if (this.axis === 'horizontal') {
            this.content.scrollLeft = newScrollPosition;
        } else {
            this.content.scrollTop = newScrollPosition;
        }
    }

    private handleGestureEnd(gesture: any) {
        // Gesture ended, momentum will continue if velocity is sufficient
    }

    private handleMomentum(velocity: { x: number; y: number }) {
        const momentumVelocity = this.axis === 'horizontal' ? velocity.x : velocity.y;

        const scrollbarSize = this.axis === 'horizontal'
            ? this.scrollbar.offsetWidth
            : this.scrollbar.offsetHeight;

        const contentSize = this.axis === 'horizontal'
            ? this.content.scrollWidth
            : this.content.scrollHeight;

        const containerSize = this.axis === 'horizontal'
            ? this.content.clientWidth
            : this.content.clientHeight;

        if (containerSize >= contentSize) return;

        const scrollbarRatio = containerSize / contentSize;
        const effectiveScrollbarSize = scrollbarSize * scrollbarRatio;

        const scrollDelta = (momentumVelocity / (scrollbarSize - effectiveScrollbarSize)) * (contentSize - containerSize);

        // Apply momentum to content
        if (this.axis === 'horizontal') {
            this.content.scrollBy({ left: scrollDelta, behavior: 'auto' });
        } else {
            this.content.scrollBy({ top: scrollDelta, behavior: 'auto' });
        }
    }
}
