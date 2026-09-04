[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / refTrigger

# Function: refTrigger()

```ts
function refTrigger(
   target, 
   prop?, 
   __namedParameters?): LinkTrigger;
```

Defined in: lur.e/src/lure/core/TriggerCore.ts:107

Adapt an object.ts observable ref/property into the LinkTrigger lifecycle.
Reactive filtering remains delegated to object.ts `affected()`.

## Parameters

### target

`any`

### prop?

`string` = `"value"`

### \_\_namedParameters?

[`RefTriggerOptions`](../type-aliases/RefTriggerOptions.md) = `{}`

## Returns

[`LinkTrigger`](../type-aliases/LinkTrigger.md)
