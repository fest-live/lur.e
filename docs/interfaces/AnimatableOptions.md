[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableOptions

# Interface: AnimatableOptions

Defined in: style.ts/src/types.ts:204

## Properties

### composite?

```ts
optional composite?: CompositeOperation;
```

Defined in: style.ts/src/types.ts:216

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/types.ts:206

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/types.ts:214

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/types.ts:205

***

### easing?

```ts
optional easing?: string | string[];
```

Defined in: style.ts/src/types.ts:211

Общий easing или easing per-segment.

***

### endDelay?

```ts
optional endDelay?: number;
```

Defined in: style.ts/src/types.ts:207

***

### fill?

```ts
optional fill?: FillMode;
```

Defined in: style.ts/src/types.ts:215

***

### intersection?

```ts
optional intersection?: IntersectionObserverInit;
```

Defined in: style.ts/src/types.ts:221

rootMargin/threshold для trigger:"visible".

***

### iterations?

```ts
optional iterations?: number;
```

Defined in: style.ts/src/types.ts:213

-1 => Infinity

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/types.ts:209

Проценты 0..1 для каждого шага (как percentageSteps).

***

### reverseOnExit?

```ts
optional reverseOnExit?: boolean;
```

Defined in: style.ts/src/types.ts:219

Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true).

***

### trigger?

```ts
optional trigger?: AnimatableTrigger;
```

Defined in: style.ts/src/types.ts:217
