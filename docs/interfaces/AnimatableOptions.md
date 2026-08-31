[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableOptions

# Interface: AnimatableOptions

Defined in: style.ts/src/types.ts:216

## Properties

### composite?

```ts
optional composite?: CompositeOperation;
```

Defined in: style.ts/src/types.ts:228

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/types.ts:218

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/types.ts:226

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/types.ts:217

***

### easing?

```ts
optional easing?: string | string[];
```

Defined in: style.ts/src/types.ts:223

Общий easing или easing per-segment.

***

### endDelay?

```ts
optional endDelay?: number;
```

Defined in: style.ts/src/types.ts:219

***

### fill?

```ts
optional fill?: FillMode;
```

Defined in: style.ts/src/types.ts:227

***

### intersection?

```ts
optional intersection?: IntersectionObserverInit;
```

Defined in: style.ts/src/types.ts:233

rootMargin/threshold для trigger:"visible".

***

### iterations?

```ts
optional iterations?: number;
```

Defined in: style.ts/src/types.ts:225

-1 => Infinity

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/types.ts:221

Проценты 0..1 для каждого шага (как percentageSteps).

***

### reverseOnExit?

```ts
optional reverseOnExit?: boolean;
```

Defined in: style.ts/src/types.ts:231

Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true).

***

### trigger?

```ts
optional trigger?: AnimatableTrigger;
```

Defined in: style.ts/src/types.ts:229
