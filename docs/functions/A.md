[**@fest-lib/lure v0.1.43**](../README.md)

***

[@fest-lib/lure](../README.md) / A

# Function: A()

```ts
function A(strings, ...values): AnimationKeyframes;
```

Defined in: lur.e/src/lure/misc/Animate.ts:351

A`` template literal for defining animations.

## Parameters

### strings

`TemplateStringsArray`

### values

...`any`[]

## Returns

[`AnimationKeyframes`](../interfaces/AnimationKeyframes.md)

## Example

```ts
const opacity = { value: 0 };

A`opacity:${[0, opacity, 1]};`
A`transform:${[
  CSS.translateX(CSS.px(0)),
  CSS.translateX(CSS.px(100))
]};`
```
