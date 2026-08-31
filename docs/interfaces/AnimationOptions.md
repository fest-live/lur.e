[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimationOptions

# Interface: AnimationOptions

Defined in: style.ts/src/types.ts:160

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: style.ts/src/types.ts:174

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/types.ts:167

Delay before animation starts

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/types.ts:171

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/types.ts:165

Duration in milliseconds or CSS time string

***

### easing?

```ts
optional easing?: TimingFunction;
```

Defined in: style.ts/src/types.ts:173

Global easing (overridden by property-specific easing)

***

### fillMode?

```ts
optional fillMode?: FillMode;
```

Defined in: style.ts/src/types.ts:170

***

### iterationCount?

```ts
optional iterationCount?: number;
```

Defined in: style.ts/src/types.ts:169

Iteration count (-1 for infinite)

***

### keyframes?

```ts
optional keyframes?: AnimationKeyframes;
```

Defined in: style.ts/src/types.ts:161

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/types.ts:163

***

### properties

```ts
properties: string | Record<string, any>[];
```

Defined in: style.ts/src/types.ts:162

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: style.ts/src/types.ts:175
