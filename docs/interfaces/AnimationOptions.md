[**@fest-lib/lure v0.1.31**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimationOptions

# Interface: AnimationOptions

Defined in: lur.e/src/lure/misc/Animate.ts:35

Main animation options.

## Properties

### composite?

```ts
optional composite?: "add" | "replace" | "accumulate";
```

Defined in: lur.e/src/lure/misc/Animate.ts:54

***

### delay?

```ts
optional delay?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:44

Delay before animation starts

***

### direction?

```ts
optional direction?: PlaybackDirection;
```

Defined in: lur.e/src/lure/misc/Animate.ts:50

Direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'

***

### duration?

```ts
optional duration?: string | number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:42

Duration in milliseconds or CSS time string

***

### easing?

```ts
optional easing?: TimingFunction;
```

Defined in: lur.e/src/lure/misc/Animate.ts:52

Global easing (overridden by property-specific easing)

***

### fillMode?

```ts
optional fillMode?: FillMode;
```

Defined in: lur.e/src/lure/misc/Animate.ts:48

Fill mode: 'none' | 'forwards' | 'backwards' | 'both'

***

### iterationCount?

```ts
optional iterationCount?: number;
```

Defined in: lur.e/src/lure/misc/Animate.ts:46

Iteration count (-1 for infinite)

***

### keyframes?

```ts
optional keyframes?: AnimationKeyframes;
```

Defined in: lur.e/src/lure/misc/Animate.ts:36

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:40

***

### properties

```ts
properties: string | Record<string, any>[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:38

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: lur.e/src/lure/misc/Animate.ts:56
