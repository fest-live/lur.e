[**@fest-lib/lure v0.1.35**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableOptions

# Interface: AnimatableOptions

Defined in: lur.e/src/lure/misc/Animatable.ts:18

## Properties

### composite?

```ts
optional composite?: CompositeOperation;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:30

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:20

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:28

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:19

***

### easing?

```ts
optional easing?: string | string[];
```

Defined in: lur.e/src/lure/misc/Animatable.ts:25

Общий easing или easing per-segment.

***

### endDelay?

```ts
optional endDelay?: number;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:21

***

### fill?

```ts
optional fill?: FillMode;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:29

***

### intersection?

```ts
optional intersection?: IntersectionObserverInit;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:35

rootMargin/threshold для trigger:"visible".

***

### iterations?

```ts
optional iterations?: number;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:27

-1 => Infinity

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animatable.ts:23

Проценты 0..1 для каждого шага (как percentageSteps).

***

### reverseOnExit?

```ts
optional reverseOnExit?: boolean;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:33

Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true).

***

### trigger?

```ts
optional trigger?: AnimatableTrigger;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:31
