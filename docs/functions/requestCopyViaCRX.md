[**@fest-lib/lure v0.1.48**](../README.md)

***

[@fest-lib/lure](../README.md) / requestCopyViaCRX

# Function: requestCopyViaCRX()

```ts
function requestCopyViaCRX(data, tabIdOrOptions?): Promise<ClipboardResult>;
```

Defined in: lur.e/src/interactive/modules/Clipboard.ts:490

Request copy via Chrome extension message (for CRX service worker → content script)
Falls back to offscreen document or BroadcastChannel if content script fails

## Parameters

### data

`unknown`

### tabIdOrOptions?

`number` \| [`CRXCopyOptions`](../interfaces/CRXCopyOptions.md)

## Returns

`Promise`\<[`ClipboardResult`](../interfaces/ClipboardResult.md)\>
