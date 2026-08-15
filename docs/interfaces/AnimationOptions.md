[**@fest-lib/lure v0.1.36**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimationOptions

# Interface: AnimationOptions

Defined in: lur.e/src/lure/misc/Animate.ts:36

Main animation options.

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: lur.e/src/lure/misc/Animate.ts:55

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:45

Delay before animation starts

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: lur.e/src/lure/misc/Animate.ts:51

Direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:43

Duration in milliseconds or CSS time string

***

### easing?

```ts
optional easing?: TimingFunction;
```

Defined in: lur.e/src/lure/misc/Animate.ts:53

Global easing (overridden by property-specific easing)

***

### fillMode?

```ts
optional fillMode?: FillMode;
```

Defined in: lur.e/src/lure/misc/Animate.ts:49

Fill mode: 'none' | 'forwards' | 'backwards' | 'both'

***

### iterationCount?

```ts
optional iterationCount?: number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:47

Iteration count (-1 for infinite)

***

### keyframes?

```ts
optional keyframes?: AnimationKeyframes;
```

Defined in: lur.e/src/lure/misc/Animate.ts:37

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:41

***

### properties

```ts
properties: string | Record<string, any>[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:39

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: lur.e/src/lure/misc/Animate.ts:57
