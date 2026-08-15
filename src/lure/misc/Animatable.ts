import { parseTime, type Cleanup } from "./Animate";

// animatable.ts
export const ANIMATABLE_BRAND = Symbol.for("fest.animatable");


export type AnimatableTrigger =
    | "mount"
    | "hover"
    | "focus"
    | "click"
    | "visible"
    | "manual"
    | { value: any }
    | ScrollDrivenOptions   // <-- новое
    | ViewDrivenOptions;  

export interface AnimatableOptions {
    duration?: number | string;
    delay?: number | string;
    endDelay?: number;
    /** Проценты 0..1 для каждого шага (как percentageSteps). */
    offsets?: number[];
    /** Общий easing или easing per-segment. */
    easing?: string | string[];
    /** -1 => Infinity */
    iterations?: number;
    direction?: PlaybackDirection;
    fill?: FillMode;
    composite?: CompositeOperation;
    trigger?: AnimatableTrigger;
    /** Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true). */
    reverseOnExit?: boolean;
    /** rootMargin/threshold для trigger:"visible". */
    intersection?: IntersectionObserverInit;
}


const normalizeIterations = (n?: number): number =>
    (n === -1 || n === Infinity) ? Infinity : Math.max(1, n ?? 1);

/** Одно "прикрепление" animatable к конкретному элементу. */
interface AnimatableAttachment {
    element: HTMLElement;
    animation: Animation | null;
    cleanup: Cleanup;
}

/**
 * Описание того, КАК слот применён в шаблоне.
 * Это решает `applyStyleTemplate`, а не сам animatable.
 */
export interface AnimatableApplyPlan {
    /**
     * "property" — слот занимает всё значение декларации
     *   (`opacity:${anim}`), анимируем CSS-свойство напрямую.
     *
     * "custom-property" — слот участвует в выражении
     *   (`translateX(${anim}px)`, `calc(${anim} * 2px)`),
     *   анимируем зарегистрированное --fest-anim-* число.
     */
    mode: "property" | "custom-property";
    /** Имя CSS-свойства ("opacity") или маркера ("--fest-anim-3-0"). */
    target: string;
    /** Приклеенная единица для сериализации значений в mode:"property". */
    unit?: string;
}

let animatableId = 0;



// animatable.ts — расширение
export interface ScrollDrivenOptions {
    kind: "scroll";
    /**
     * Источник скролла:
     * - "nearest" (default) — ближайший скроллируемый предок
     * - "root" — документ
     * - "self" — сам элемент
     * - Element | { value: Element } — конкретный скроллер (в т.ч. реактивный)
     */
    source?: "nearest" | "root" | "self" | Element | { value: any };
    axis?: "block" | "inline" | "x" | "y";
    /** animation-range: "0%" / "100px" / "contain 0%" и т.п. */
    rangeStart?: string;
    rangeEnd?: string;
}

export interface ViewDrivenOptions {
    kind: "view";
    /** Отслеживаемый subject; по умолчанию сам элемент. */
    subject?: Element | { value: any };
    axis?: "block" | "inline" | "x" | "y";
    inset?: string;
    /** "entry 0%", "cover 50%", "exit 100%"... */
    rangeStart?: string;
    rangeEnd?: string;
}  // <-- новое

// шорткаты, чтобы не писать kind руками
export const onScroll = (o: Omit<ScrollDrivenOptions, "kind"> = {}): ScrollDrivenOptions =>
    ({ kind: "scroll", ...o });

export const onView = (o: Omit<ViewDrivenOptions, "kind"> = {}): ViewDrivenOptions =>
    ({ kind: "view", ...o });


const isScrollDriven = (t: any): t is ScrollDrivenOptions =>
    t != null && typeof t === "object" && t.kind === "scroll";

const isViewDriven = (t: any): t is ViewDrivenOptions =>
    t != null && typeof t === "object" && t.kind === "view";


export class AnimatableValue {
    readonly [ANIMATABLE_BRAND] = true;
    readonly id = animatableId++;

    //
    #steps: any[];
    #options: AnimatableOptions;
    #current: any;
    #subscribers = new Set<(v: any) => void>();
    #attachments = new Set<AnimatableAttachment>();

    // внутри AnimatableValue

    #resolveElementRef(v: any, self: HTMLElement): Element {
        if (v == null || v === "self") return self;
        if (v === "root") return self.ownerDocument.scrollingElement ?? self.ownerDocument.documentElement;
        if (typeof v === "object" && "value" in v && !(v instanceof Element)) return v.value ?? self;
        return v as Element;
    }

    #findNearestScroller(el: HTMLElement): Element {
        for (let node = el.parentElement; node; node = node.parentElement) {
            const s = getComputedStyle(node);
            if (/(auto|scroll|overlay)/.test(s.overflow + s.overflowX + s.overflowY)) return node;
        }
        return el.ownerDocument.scrollingElement ?? el.ownerDocument.documentElement;
    }

    #createTimeline(element: HTMLElement, trigger: ScrollDrivenOptions | ViewDrivenOptions): AnimationTimeline | null {
        const win: any = element.ownerDocument.defaultView ?? globalThis;

        if (isScrollDriven(trigger)) {
            const ScrollTimelineCtor = win.ScrollTimeline;
            if (typeof ScrollTimelineCtor !== "function") return null;

            const source =
                trigger.source === "nearest" || trigger.source == null
                    ? this.#findNearestScroller(element)
                    : this.#resolveElementRef(trigger.source, element);

            return new ScrollTimelineCtor({ source, axis: trigger.axis ?? "block" });
        }

        const ViewTimelineCtor = win.ViewTimeline;
        if (typeof ViewTimelineCtor !== "function") return null;

        return new ViewTimelineCtor({
            subject: trigger.subject ? this.#resolveElementRef(trigger.subject, element) : element,
            axis: trigger.axis ?? "block",
            inset: trigger.inset,
        });
    }

    #startTimelineDriven(
        element: HTMLElement,
        attachment: AnimatableAttachment,
        plan: AnimatableApplyPlan,
        trigger: ScrollDrivenOptions | ViewDrivenOptions,
    ): Cleanup {
        const timeline = this.#createTimeline(element, trigger);

        if (!timeline) {
            return this.#startTimelineFallback(element, attachment, plan, trigger);
        }

        const timing = this.#buildTiming();

        /*
        * ВАЖНО: у progress-based timeline нет "секунд".
        * - duration должен быть "auto" (или проценты через range),
        *   миллисекунды здесь бессмысленны и в Chrome дают неожиданный масштаб;
        * - iterations: Infinity невалидно с scroll timeline;
        * - delay/endDelay игнорируем — их роль выполняет rangeStart/rangeEnd.
        */
        const animation = element.animate(this.#buildKeyframes(plan), {
            ...timing,
            duration: "auto" as any,
            delay: 0,
            endDelay: 0,
            iterations: 1,
            fill: this.#options.fill ?? "both",
            timeline,
        } as any);

        if (trigger.rangeStart) (animation as any).rangeStart = trigger.rangeStart;
        if (trigger.rangeEnd)   (animation as any).rangeEnd   = trigger.rangeEnd;

        attachment.animation = animation;
        return () => animation.cancel();
    }

    constructor(steps: any[], options: AnimatableOptions = {}) {
        if (!Array.isArray(steps) || steps.length < 2) {
            throw new TypeError("animatable() expects at least 2 steps");
        }
        this.#steps = steps;
        this.#options = options;
        this.#current = this.#resolveStep(steps[0]);
    }

    #startTimelineFallback(
        element: HTMLElement,
        attachment: AnimatableAttachment,
        plan: AnimatableApplyPlan,
        trigger: ScrollDrivenOptions | ViewDrivenOptions,
    ): Cleanup {
        const DURATION = 10000; // виртуальная шкала; точность 0.01%
    
        const animation = element.animate(this.#buildKeyframes(plan), {
            ...this.#buildTiming(),
            duration: DURATION,
            delay: 0,
            iterations: 1,
            fill: "both",
        });
        animation.pause();
        attachment.animation = animation;
    
        const scroller = isScrollDriven(trigger)
            ? (trigger.source === "nearest" || trigger.source == null
                ? this.#findNearestScroller(element)
                : this.#resolveElementRef(trigger.source, element))
            : this.#findNearestScroller(element);
    
        let rafId = 0;
    
        const computeProgress = (): number => {
            if (isViewDriven(trigger)) {
                // приближение "cover": от входа нижней границы до выхода верхней
                const vp = scroller === document.scrollingElement
                    ? { top: 0, height: innerHeight }
                    : (scroller as Element).getBoundingClientRect();
                const rect = element.getBoundingClientRect();
                const total = vp.height + rect.height;
                return Math.min(1, Math.max(0, (vp.top + vp.height - rect.top) / total));
            }
            const el = scroller as Element;
            const max = el.scrollHeight - el.clientHeight;
            return max > 0 ? el.scrollTop / max : 0;
        };
    
        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                animation.currentTime = computeProgress() * DURATION;
            });
        };
    
        const listenTarget: EventTarget =
            scroller === document.scrollingElement ? window : scroller as Element;
    
        listenTarget.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // начальная синхронизация
    
        return () => {
            cancelAnimationFrame(rafId);
            listenTarget.removeEventListener("scroll", onScroll);
            animation.cancel();
        };
    }

    /* ---- реактивный контракт { value } ---- */

    /** Последнее известное значение (первый шаг до старта). */
    get value(): any { return this.#current; }

    set value(next: any) {
        this.#current = next;
        for (const cb of this.#subscribers) cb(next);
    }

    subscribe(cb: (v: any) => void): Cleanup {
        this.#subscribers.add(cb);
        return () => this.#subscribers.delete(cb);
    }

    get options(): AnimatableOptions { return this.#options; }
    get steps(): any[] { return this.#steps; }

    /* ---- шаги могут содержать ref'ы: разрешаем в момент построения keyframes ---- */

    #resolveStep(step: any): any {
        // { value } внутри шага — берём текущее значение ref'а
        if (step != null && typeof step === "object" && "value" in step) {
            return step.value;
        }
        return step;
    }

    #buildKeyframes(plan: AnimatableApplyPlan): Keyframe[] {
        const steps = this.#steps.map(s => this.#resolveStep(s));
        const count = steps.length;
        const offsets = this.#options.offsets;
        const easing = this.#options.easing;

        return steps.map((raw, i) => {
            const frame: Keyframe = {
                offset: offsets?.[i] ?? (count > 1 ? i / (count - 1) : 0),
            };

            // per-segment easing: easing[i] действует от кадра i к i+1
            if (Array.isArray(easing)) {
                if (easing[i]) frame.easing = easing[i];
            }

            let value: any = raw;
            if (plan.mode === "property" && plan.unit != null && typeof raw === "number") {
                value = `${raw}${plan.unit}`;
            }
            if (plan.mode === "custom-property" && typeof raw !== "string") {
                value = String(raw); // числовое custom property сериализуем
            }

            (frame as any)[plan.target] = value;
            return frame;
        });
    }

    #buildTiming(): KeyframeAnimationOptions {
        const o = this.#options;
        return {
            duration: parseTime(o.duration, 300),
            delay: parseTime(o.delay, 0),
            endDelay: o.endDelay ?? 0,
            iterations: normalizeIterations(o.iterations),
            direction: o.direction ?? "normal",
            fill: o.fill ?? "both",
            composite: o.composite,
            easing: Array.isArray(o.easing)
                ? "linear"                      // per-segment задан в кадрах
                : (o.easing ?? "linear"),
        };
    }

    /* ---- привязка к элементу (вызывается из applyStyleTemplate) ---- */

    attach(element: HTMLElement, plan: AnimatableApplyPlan): Cleanup {
        const attachment: AnimatableAttachment = { element, animation: null, cleanup: () => {} };
        const trigger = this.#options.trigger ?? "mount";
    
        let inner: Cleanup;
        if (isScrollDriven(trigger) || isViewDriven(trigger)) {
            inner = this.#startTimelineDriven(element, attachment, plan, trigger);
        } else {
            const start = () => {
                attachment.animation?.cancel();
                const animation = element.animate(
                    this.#buildKeyframes(plan),
                    this.#buildTiming(),
                );
                attachment.animation = animation;
                this.#trackProgress(animation, plan);
                return animation;
            };
            inner = this.#wireTrigger(element, attachment, start as () => Animation);
        }
    
        this.#attachments.add(attachment);
        attachment.cleanup = () => { inner(); this.#attachments.delete(attachment); };
        return attachment.cleanup;
    }

    /**
     * Синхронизируем .value с завершением анимации,
     * чтобы реактивный контракт оставался честным
     * (подписчики вне анимации видят конечное значение).
     */
    #trackProgress(animation: Animation, plan: AnimatableApplyPlan): void {
        animation.finished.then(() => {
            const last = this.#resolveStep(this.#steps[this.#steps.length - 1]);
            this.value = last;
        }).catch(() => { /* cancel — состояние не трогаем */ });
    }

    #wireTrigger(
        element: HTMLElement,
        attachment: AnimatableAttachment,
        start: () => Animation,
    ): Cleanup {
        const trigger = this.#options.trigger ?? "mount";
        const reverseOnExit = this.#options.reverseOnExit ?? true;

        const playForward = () => {
            if (!attachment.animation || attachment.animation.playState === "idle") {
                start();
            } else {
                attachment.animation.playbackRate = Math.abs(attachment.animation.playbackRate || 1);
                attachment.animation.play();
            }
        };

        const playBackward = () => {
            if (!attachment.animation) return;
            attachment.animation.reverse();
        };

        if (trigger === "mount") {
            start();
            return () => {};
        }

        if (trigger === "manual") {
            return () => {};
        }

        if (trigger === "hover" || trigger === "focus") {
            const enter = trigger === "hover" ? "pointerenter" : "focusin";
            const leave = trigger === "hover" ? "pointerleave" : "focusout";

            const onEnter = () => playForward();
            const onLeave = () => { if (reverseOnExit) playBackward(); };

            element.addEventListener(enter, onEnter);
            element.addEventListener(leave, onLeave);
            return () => {
                element.removeEventListener(enter, onEnter);
                element.removeEventListener(leave, onLeave);
            };
        }

        if (trigger === "click") {
            let forward = true;
            const onClick = () => {
                forward ? playForward() : playBackward();
                forward = !forward;
            };
            element.addEventListener("click", onClick);
            return () => element.removeEventListener("click", onClick);
        }

        if (trigger === "visible") {
            if (typeof IntersectionObserver !== "function") {
                start(); // деградация: играть сразу
                return () => {};
            }
            const observer = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) playForward();
                    else if (reverseOnExit && attachment.animation) playBackward();
                }
            }, this.#options.intersection);
            observer.observe(element);
            return () => observer.disconnect();
        }

        // Реактивный триггер { value }
        if (trigger != null && typeof trigger === "object" && "value" in trigger) {
            const apply = (v: any) => (v ? playForward() : playBackward());
            apply((trigger as any).value);

            const unsubscribe =
                typeof (trigger as any).subscribe === "function"
                    ? (trigger as any).subscribe(apply)
                    : null;

            return () => unsubscribe?.();
        }

        return () => {};
    }

    /* ---- агрегированное управление всеми привязками ---- */

    #each(fn: (a: Animation) => void): this {
        for (const at of this.#attachments) {
            if (at.animation) fn(at.animation);
        }
        return this;
    }

    play()    { return this.#each(a => a.play()); }
    pause()   { return this.#each(a => a.pause()); }
    reverse() { return this.#each(a => a.reverse()); }
    cancel()  { return this.#each(a => a.cancel()); }
    finish()  { return this.#each(a => a.finish()); }

    set playbackRate(rate: number) { this.#each(a => { a.playbackRate = rate; }); }

    /** Promise завершения всех активных анимаций. */
    get finished(): Promise<void> {
        const list: Promise<any>[] = [];
        this.#each(a => list.push(a.finished.catch(() => {})));
        return Promise.all(list).then(() => {});
    }
}

export const animatable = (
    steps: any[],
    options?: AnimatableOptions,
): AnimatableValue => new AnimatableValue(steps, options);

export const isAnimatableValue = (value: any): value is AnimatableValue =>
    value != null &&
    typeof value === "object" &&
    (value as any)[ANIMATABLE_BRAND] === true;


export type AnimatableStyleSlot = {
    marker: string;
    value: AnimatableValue;
    multipliedByUnit?: string;
};
