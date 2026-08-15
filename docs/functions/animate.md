[**@fest-lib/lure v0.1.35**](../README.md)

***

[@fest-lib/lure](../README.md) / animate

# Function: animate()

```ts
function animate(element, options): object;
```

Defined in: lur.e/src/lure/misc/Animate.ts:409

Simplified animation helper with inline configuration.

## Parameters

### element

`HTMLElement`

### options

[`AnimationOptions`](../interfaces/AnimationOptions.md)

## Returns

`object`

### animation

```ts
animation: Animation;
```

### cleanup

```ts
cleanup: Cleanup;
```

## Example

```ts
animate(element, {
  opacity: [0, 1],
  transform: ["translateX(0)", "translateX(100px)"]
}, {
  duration: 500,
  fillMode: "forwards"
});
```
