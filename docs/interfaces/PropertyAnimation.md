[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / PropertyAnimation

# Interface: PropertyAnimation

Defined in: style.ts/src/types.ts:129

## Properties

### composite?

```ts
optional composite?: "replace" | "add" | "accumulate";
```

Defined in: style.ts/src/types.ts:139

***

### easing?

```ts
optional easing?: 
  | TimingFunction
  | TimingFunction[];
```

Defined in: style.ts/src/types.ts:137

Timing function per segment or global

***

### offsets?

```ts
optional offsets?: number[];
```

Defined in: style.ts/src/types.ts:135

Optional offset percentages (0.0 to 1.0). If omitted, evenly distributed.

***

### property

```ts
property: string;
```

Defined in: style.ts/src/types.ts:131

Property name (camelCase or kebab-case)

***

### timeline?

```ts
optional timeline?: AnimationTimeline;
```

Defined in: style.ts/src/types.ts:138

***

### values

```ts
values: any[];
```

Defined in: style.ts/src/types.ts:133

Array of keyframe values
