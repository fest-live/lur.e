[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimationOptions

# Interface: AnimationOptions

Defined in: style.ts/src/Animate.ts:40

Main animation options.

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: style.ts/src/Animate.ts:59

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: style.ts/src/Animate.ts:49

Delay before animation starts

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: style.ts/src/Animate.ts:55

Direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: style.ts/src/Animate.ts:47

Duration in milliseconds or CSS time string

***

### easing?

```ts
optional easing?: TimingFunction;
```

Defined in: style.ts/src/Animate.ts:57

Global easing (overridden by property-specific easing)

***

### fillMode?

```ts
optional fillMode?: FillMode;
```

Defined in: style.ts/src/Animate.ts:53

Fill mode: 'none' | 'forwards' | 'backwards' | 'both'

***

### iterationCount?

```ts
optional iterationCount?: number;
```

Defined in: style.ts/src/Animate.ts:51

Iteration count (-1 for infinite)

***

### keyframes?

```ts
optional keyframes?: AnimationKeyframes;
```

Defined in: style.ts/src/Animate.ts:41

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/Animate.ts:45

***

### properties

```ts
properties: string | Record<string, any>[];
```

Defined in: style.ts/src/Animate.ts:43

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: style.ts/src/Animate.ts:61
