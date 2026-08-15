[**@fest-lib/lure v0.1.32**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableOptions

# Interface: AnimatableOptions

Defined in: lur.e/src/lure/misc/Animate.ts:614

## Properties

### composite?

```ts
optional composite?: CompositeOperation;
```

Defined in: lur.e/src/lure/misc/Animate.ts:626

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:616

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: lur.e/src/lure/misc/Animate.ts:624

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:615

***

### easing?

```ts
optional easing?: string | string[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:621

Общий easing или easing per-segment.

***

### endDelay?

```ts
optional endDelay?: number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:617

***

### fill?

```ts
optional fill?: FillMode;
```

Defined in: lur.e/src/lure/misc/Animate.ts:625

***

### intersection?

```ts
optional intersection?: IntersectionObserverInit;
```

Defined in: lur.e/src/lure/misc/Animate.ts:631

rootMargin/threshold для trigger:"visible".

***

### iterations?

```ts
optional iterations?: number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:623

-1 => Infinity

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:619

Проценты 0..1 для каждого шага (как percentageSteps).

***

### reverseOnExit?

```ts
optional reverseOnExit?: boolean;
```

Defined in: lur.e/src/lure/misc/Animate.ts:629

Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true).

***

### trigger?

```ts
optional trigger?: AnimatableTrigger;
```

Defined in: lur.e/src/lure/misc/Animate.ts:627
