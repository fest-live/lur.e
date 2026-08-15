[**@fest-lib/lure v0.1.31**](../README.md)

***

[@fest-lib/lure](../README.md) / PropertyAnimation

# Interface: PropertyAnimation

Defined in: lur.e/src/lure/misc/Animate.ts:17

Animation configuration for a single property.

## Properties

### composite?

```ts
optional composite?: "add" | "replace" | "accumulate";
```

Defined in: lur.e/src/lure/misc/Animate.ts:29

***

### easing?

```ts
optional easing?: 
  | TimingFunction
  | TimingFunction[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:25

Timing function per segment or global

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:23

Optional offset percentages (0.0 to 1.0). If omitted, evenly distributed.

***

### property

```ts
property: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:19

Property name (camelCase or kebab-case)

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: lur.e/src/lure/misc/Animate.ts:27

***

### values

```ts
values: any[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:21

Array of keyframe values
