[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / parallelAnimations

# Function: parallelAnimations()

```ts
function parallelAnimations(element, animations): object;
```

Defined in: style.ts/src/Animate.ts:484

Run multiple animations in parallel.

## Parameters

### element

`HTMLElement`

### animations

[`AnimationOptions`](../interfaces/AnimationOptions.md)[]

## Returns

`object`

### animations

```ts
animations: Animation[];
```

### cleanup

```ts
cleanup: Cleanup;
```

## Example

```ts
parallelAnimations(element, [
  { keyframes: A`opacity:${[0, 1]};`, duration: 300 },
  { keyframes: A`transform:${[...values]};`, duration: 300 }
]);
```
