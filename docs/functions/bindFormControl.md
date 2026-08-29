[**@fest-lib/lure v0.1.49**](../README.md)

***

[@fest-lib/lure](../README.md) / bindFormControl

# Function: bindFormControl()

```ts
function bindFormControl(
   element, 
   value, 
   kind?, 
   options?): () => void;
```

Defined in: lur.e/src/lure/core/FormBinding.ts:23

Bind a control through the Linker presets, optionally tracking mount/unmount.
The returned disposer is also attached to a reactive ref's Symbol.dispose.

## Parameters

### element

`Element` \| `null` \| `undefined`

### value

`any`

### kind?

[`FormKind`](../type-aliases/FormKind.md) = `"text"`

### options?

[`FormControlOptions`](../type-aliases/FormControlOptions.md) = `{}`

## Returns

() => `void`
