[**@fest-lib/lure v0.1.55**](../README.md)

***

[@fest-lib/lure](../README.md) / walkExactFile

# Function: walkExactFile()

```ts
function walkExactFile(root, rel): Promise<FileSystemFileHandle | null>;
```

Defined in: lur.e/src/utils/opfs/OPFS.ts:361

WHY: `getFileHandle` hyphen-rewrites OPFS `/user/` names. Local
`showDirectoryPicker` trees must keep exact filenames (`My Image.png`).

## Parameters

### root

`FileSystemDirectoryHandle`

### rel

`string`

## Returns

`Promise`\<`FileSystemFileHandle` \| `null`\>
