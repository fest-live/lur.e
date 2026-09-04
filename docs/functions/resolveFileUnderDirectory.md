[**@fest-lib/lure v0.1.61**](../README.md)

***

[@fest-lib/lure](../README.md) / resolveFileUnderDirectory

# Function: resolveFileUnderDirectory()

```ts
function resolveFileUnderDirectory(dir, rel): Promise<File | null>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:111

Read a markdown-relative file from a picked directory (any ancestor of the file).

## Parameters

### dir

`FileSystemDirectoryHandle` \| `null` \| `undefined`

### rel

`string`

## Returns

`Promise`\<`File` \| `null`\>
