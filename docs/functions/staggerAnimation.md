[**@fest-lib/lure v0.1.58**](../README.md)

***

[@fest-lib/lure](../README.md) / staggerAnimation

# Function: staggerAnimation()

```ts
function staggerAnimation(
   elements, 
   options?, 
   staggerDelay?): object[];
```

Defined in: style.ts/src/Animate.ts:467

Stagger animations across multiple elements.

## Parameters

### elements

`HTMLElement`[]

### options?

[`AnimationOptions`](../interfaces/AnimationOptions.md)

### staggerDelay?

`number` = `100`

## Returns

`object`[]

## Example

```ts
staggerAnimation(
  elements,
  A`opacity:${[0, 1]};`,
  { duration: 300, fillMode: "forwards" },
  100 // 100ms delay between each
);
```
