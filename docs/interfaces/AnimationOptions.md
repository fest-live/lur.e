[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimationOptions

# Interface: AnimationOptions

Defined in: style.ts/src/types.ts:148

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: style.ts/src/types.ts:162

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/types.ts:155

Delay before animation starts

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/types.ts:159

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/types.ts:153

Duration in milliseconds or CSS time string

***

### easing?

```ts
optional easing?: TimingFunction;
```

Defined in: style.ts/src/types.ts:161

Global easing (overridden by property-specific easing)

***

### fillMode?

```ts
optional fillMode?: FillMode;
```

Defined in: style.ts/src/types.ts:158

***

### iterationCount?

```ts
optional iterationCount?: number;
```

Defined in: style.ts/src/types.ts:157

Iteration count (-1 for infinite)

***

### keyframes?

```ts
optional keyframes?: AnimationKeyframes;
```

Defined in: style.ts/src/types.ts:149

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/types.ts:151

***

### properties

```ts
properties: string | Record<string, any>[];
```

Defined in: style.ts/src/types.ts:150

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: style.ts/src/types.ts:163
