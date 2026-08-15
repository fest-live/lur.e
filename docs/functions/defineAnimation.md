[**@fest-lib/lure v0.1.33**](../README.md)

***

[@fest-lib/lure](../README.md) / defineAnimation

# Function: defineAnimation()

```ts
function defineAnimation(options): (element) => object;
```

Defined in: lur.e/src/lure/misc/Animate.ts:444

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
