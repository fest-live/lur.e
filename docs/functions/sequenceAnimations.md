[**@fest-lib/lure v0.1.46**](../README.md)

***

[@fest-lib/lure](../README.md) / sequenceAnimations

# Function: sequenceAnimations()

```ts
function sequenceAnimations(element, sequence): Promise<void>;
```

Defined in: lur.e/src/lure/misc/Animate.ts:459

Sequence multiple animations.

## Parameters

### element

`HTMLElement`

### sequence

[`AnimationOptions`](../interfaces/AnimationOptions.md)[]

## Returns

`Promise`\<`void`\>

## Example

```ts
sequenceAnimations(element, [
  { keyframes: A`opacity:${[0, 1]};`, duration: 300 },
  { keyframes: A`transform:${[...values]};`, duration: 500 }
]);
```
