[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / normalizeIconSrcFromPayload

# Function: normalizeIconSrcFromPayload()

```ts
function normalizeIconSrcFromPayload(
   iconSrcRaw, 
   hrefRaw, 
   action): string;
```

Defined in: lur.e/src/interactive/modules/DesktopItemIconCodec.ts:113

Normalize payload from JSON/import: never keep base64/blob; collapse Google favicon URLs to `g:`.
WHY: drop persisted `g:192.168.x.x` / same-host refs that blanked tiles after Open-link edits.

## Parameters

### iconSrcRaw

`unknown`

### hrefRaw

`unknown`

### action

`string`

## Returns

`string`
