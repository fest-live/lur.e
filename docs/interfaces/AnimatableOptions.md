[**@fest-lib/lure v0.1.64**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableOptions

# Interface: AnimatableOptions

Defined in: style.ts/src/types.ts:225

## Properties

### composite?

```ts
optional composite?: CompositeOperation;
```

Defined in: style.ts/src/types.ts:237

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/types.ts:227

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/types.ts:235

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/types.ts:226

***

### easing?

```ts
optional easing?: string | string[];
```

Defined in: style.ts/src/types.ts:232

Общий easing или easing per-segment.

***

### endDelay?

```ts
optional endDelay?: number;
```

Defined in: style.ts/src/types.ts:228

***

### fill?

```ts
optional fill?: FillMode;
```

Defined in: style.ts/src/types.ts:236

***

### intersection?

```ts
optional intersection?: IntersectionObserverInit;
```

Defined in: style.ts/src/types.ts:242

rootMargin/threshold для trigger:"visible".

***

### iterations?

```ts
optional iterations?: number;
```

Defined in: style.ts/src/types.ts:234

-1 => Infinity

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/types.ts:230

Проценты 0..1 для каждого шага (как percentageSteps).

***

### reverseOnExit?

```ts
optional reverseOnExit?: boolean;
```

Defined in: style.ts/src/types.ts:240

Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true).

***

### trigger?

```ts
optional trigger?: AnimatableTrigger;
```

Defined in: style.ts/src/types.ts:238
