[**@fest-lib/lure v0.1.48**](../README.md)

***

[@fest-lib/lure](../README.md) / provideBoundRelative

# Function: provideBoundRelative()

```ts
function provideBoundRelative(
   mountRoot, 
   originalRel, 
sourceUrl?): Promise<File | null>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:39

Main-thread `provide()` of a bound relative path (`/mounts/md-xxx/` + `./assets/logo.png`).
WHY: skips OPFS worker + HTTP fetch (JXL hooks those). Mapped `/mounts/` uses `walkExactFile`.

## Parameters

### mountRoot

`string` \| `null` \| `undefined`

### originalRel

`string`

### sourceUrl?

`string` \| `null`

## Returns

`Promise`\<`File` \| `null`\>
