[**@fest-lib/lure v0.1.32**](../README.md)

***

[@fest-lib/lure](../README.md) / PropertyAnimation

# Interface: PropertyAnimation

Defined in: lur.e/src/lure/misc/Animate.ts:60

Animation configuration for a single property.

## Properties

### composite?

```ts
optional composite?: "accumulate" | "add" | "replace";
```

Defined in: lur.e/src/lure/misc/Animate.ts:72

***

### easing?

```ts
optional easing?: 
  | TimingFunction
  | TimingFunction[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:68

Timing function per segment or global

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:66

Optional offset percentages (0.0 to 1.0). If omitted, evenly distributed.

***

### property

```ts
property: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:62

Property name (camelCase or kebab-case)

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: lur.e/src/lure/misc/Animate.ts:70

***

### values

```ts
values: any[];
```

Defined in: lur.e/src/lure/misc/Animate.ts:64

Array of keyframe values
