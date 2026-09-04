[**@fest-lib/lure v0.1.61**](../README.md)

***

[@fest-lib/lure](../README.md) / handleIncomingEntries

# Function: handleIncomingEntries()

```ts
function handleIncomingEntries(
   data, 
   destPath?, 
   rootHandle?, 
onItemHandled?): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/OPFS.ts:1342

## Parameters

### data

`any`

### destPath?

`string` = `"/user/"`

### rootHandle?

`any` = `null`

### onItemHandled?

(`file`, `path`) => `void` \| `Promise`\<`void`\>

## Returns

`Promise`\<`void`\>
