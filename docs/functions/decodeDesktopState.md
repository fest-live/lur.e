[**@fest-lib/lure v0.1.58**](../README.md)

***

[@fest-lib/lure](../README.md) / decodeDesktopState

# Function: decodeDesktopState()

```ts
function decodeDesktopState(raw): DesktopPersistFile | null;
```

Defined in: lur.e/src/interactive/modules/DesktopStateStorage.ts:57

Decode persisted JSON. Accepts v2 envelope or legacy flat `{ columns, rows, items }`.

## Parameters

### raw

`string`

## Returns

[`DesktopPersistFile`](../type-aliases/DesktopPersistFile.md) \| `null`
