[**@fest-lib/lure v0.1.35**](../README.md)

***

[@fest-lib/lure](../README.md) / PropertyAnimation

# Interface: PropertyAnimation

Defined in: lur.e/src/lure/misc/Animate.ts:18

Animation configuration for a single property.

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: lur.e/src/lure/misc/Animate.ts:30

***

### easing?

```ts
optional easing?: 
  | TimingFunction
  | TimingFunction[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:26

Timing function per segment or global

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:24

Optional offset percentages (0.0 to 1.0). If omitted, evenly distributed.

***

### property

```ts
property: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:20

Property name (camelCase or kebab-case)

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: lur.e/src/lure/misc/Animate.ts:28

***

### values

```ts
values: any[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:22

Array of keyframe values
