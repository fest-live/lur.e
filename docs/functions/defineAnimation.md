[**@fest-lib/lure v0.1.62**](../README.md)

***

[@fest-lib/lure](../README.md) / defineAnimation

# Function: defineAnimation()

```ts
function defineAnimation(options): (element) => object;
```

Defined in: style.ts/src/Animate.ts:409

Create a reusable animation definition.

## Parameters

### options

[`AnimationOptions`](../interfaces/AnimationOptions.md)

## Returns

(`element`) => `object`

## Example

```ts
const fadeIn = defineAnimation(
  A`opacity:${[0, 1]};`,
  { duration: 300, fillMode: "forwards" }
);

fadeIn(element1);
fadeIn(element2);
```
