[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / withTriggerModifiers

# Function: withTriggerModifiers()

```ts
function withTriggerModifiers<T>(trigger, modifiers?): LinkTrigger<T>;
```

Defined in: lur.e/src/lure/core/TriggerCore.ts:68

Decorate any LinkTrigger with lifecycle-safe DOM modifiers.
INVARIANT: `once` disposes the wrapped trigger after the committed callback,
including a delayed debounce commit.

## Type Parameters

### T

`T` = `any`

## Parameters

### trigger

[`LinkTrigger`](../type-aliases/LinkTrigger.md)\<`T`\>

### modifiers?

[`TriggerModifiers`](../type-aliases/TriggerModifiers.md) = `{}`

## Returns

[`LinkTrigger`](../type-aliases/LinkTrigger.md)\<`T`\>
