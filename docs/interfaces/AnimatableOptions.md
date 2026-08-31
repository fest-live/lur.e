[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableOptions

# Interface: AnimatableOptions

Defined in: style.ts/src/Animatable.ts:25

## Properties

### composite?

```ts
optional composite?: CompositeOperation;
```

Defined in: style.ts/src/Animatable.ts:37

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/Animatable.ts:27

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/Animatable.ts:35

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/Animatable.ts:26

***

### easing?

```ts
optional easing?: string | string[];
```

Defined in: style.ts/src/Animatable.ts:32

Общий easing или easing per-segment.

***

### endDelay?

```ts
optional endDelay?: number;
```

Defined in: style.ts/src/Animatable.ts:28

***

### fill?

```ts
optional fill?: FillMode;
```

Defined in: style.ts/src/Animatable.ts:36

***

### intersection?

```ts
optional intersection?: IntersectionObserverInit;
```

Defined in: style.ts/src/Animatable.ts:42

rootMargin/threshold для trigger:"visible".

***

### iterations?

```ts
optional iterations?: number;
```

Defined in: style.ts/src/Animatable.ts:34

-1 => Infinity

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/Animatable.ts:30

Проценты 0..1 для каждого шага (как percentageSteps).

***

### reverseOnExit?

```ts
optional reverseOnExit?: boolean;
```

Defined in: style.ts/src/Animatable.ts:40

Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true).

***

### trigger?

```ts
optional trigger?: AnimatableTrigger;
```

Defined in: style.ts/src/Animatable.ts:38
