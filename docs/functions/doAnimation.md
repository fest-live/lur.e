[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / doAnimation

# Function: doAnimation()

```ts
function doAnimation(
   element, 
   config, 
   keyframes?): object;
```

Defined in: style.ts/src/Animate.ts:325

Animate an element with the provided keyframes and options.

## Parameters

### element

`HTMLElement`

### config

[`AnimationOptions`](../interfaces/AnimationOptions.md)

### keyframes?

`Map`\<`string`, [`PropertyAnimation`](../interfaces/PropertyAnimation.md)\>

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
const animation = doAnimation(element, {
  keyframes: A`opacity:${[0, 0.5, 1]};`,
  duration: 1000,
  iterationCount: -1,
  fillMode: "forwards"
});

// Later: animation.pause(), animation.play(), animation.cleanup()
```
