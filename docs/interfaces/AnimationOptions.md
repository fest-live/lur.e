[**@fest-lib/lure v0.1.32**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimationOptions

# Interface: AnimationOptions

Defined in: lur.e/src/lure/misc/Animate.ts:78

Main animation options.

## Properties

### composite?

```ts
optional composite?: "accumulate" | "add" | "replace";
```

Defined in: lur.e/src/lure/misc/Animate.ts:97

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:87

Delay before animation starts

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: lur.e/src/lure/misc/Animate.ts:93

Direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:85

Duration in milliseconds or CSS time string

***

### easing?

```ts
optional easing?: TimingFunction;
```

Defined in: lur.e/src/lure/misc/Animate.ts:95

Global easing (overridden by property-specific easing)

***

### fillMode?

```ts
optional fillMode?: FillMode;
```

Defined in: lur.e/src/lure/misc/Animate.ts:91

Fill mode: 'none' | 'forwards' | 'backwards' | 'both'

***

### iterationCount?

```ts
optional iterationCount?: number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:89

Iteration count (-1 for infinite)

***

### keyframes?

```ts
optional keyframes?: AnimationKeyframes;
```

Defined in: lur.e/src/lure/misc/Animate.ts:79

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:83

***

### properties

```ts
properties: string | Record<string, any>[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:81

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: lur.e/src/lure/misc/Animate.ts:99
