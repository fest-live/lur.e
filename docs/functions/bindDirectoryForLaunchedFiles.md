[**@fest-lib/lure v0.1.58**](../README.md)

***

[@fest-lib/lure](../README.md) / bindDirectoryForLaunchedFiles

# Function: bindDirectoryForLaunchedFiles()

```ts
function bindDirectoryForLaunchedFiles(options): Promise<BoundLaunchAssets | null>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:268

Offer `showDirectoryPicker` (same user-activation as Launch Queue when possible).
Cancel / missing API → null; caller continues with the File body alone.

## Parameters

### options

#### filename?

`string`

#### files

`File`[]

#### markdownText?

`string`

#### startIn?

`FileSystemHandle`

## Returns

`Promise`\<[`BoundLaunchAssets`](../type-aliases/BoundLaunchAssets.md) \| `null`\>
