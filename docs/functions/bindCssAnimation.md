[**@fest-lib/lure v0.1.61**](../README.md)

***

[@fest-lib/lure](../README.md) / bindCssAnimation

# Function: bindCssAnimation()

```ts
function bindCssAnimation(target, options): Cleanup;
```

Defined in: style.ts/src/css-animation.ts:165

Write `@keyframes` + companion rule into a stylesheet. Never calls `element.animate()`.
WHY: duck-type `insertRule`+`cssRules`+`selector` before `instanceof` so Node tests work.

## Parameters

### target

`any`

### options

[`CssAnimationOptions`](../type-aliases/CssAnimationOptions.md)

## Returns

[`Cleanup`](../type-aliases/Cleanup.md)
