[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / PropertyAnimation

# Interface: PropertyAnimation

Defined in: style.ts/src/Animate.ts:22

Animation configuration for a single property.

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: style.ts/src/Animate.ts:34

***

### easing?

```ts
optional easing?: 
  | TimingFunction
  | TimingFunction[];
```

Defined in: style.ts/src/Animate.ts:30

Timing function per segment or global

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/Animate.ts:28

Optional offset percentages (0.0 to 1.0). If omitted, evenly distributed.

***

### property

```ts
property: string;
```

Defined in: style.ts/src/Animate.ts:24

Property name (camelCase or kebab-case)

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: style.ts/src/Animate.ts:32

***

### values

```ts
values: any[];
```

Defined in: style.ts/src/Animate.ts:26

Array of keyframe values
