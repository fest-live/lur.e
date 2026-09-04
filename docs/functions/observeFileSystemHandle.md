[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / observeFileSystemHandle

# Function: observeFileSystemHandle()

```ts
function observeFileSystemHandle(handle, onRecords): 
  | {
  disconnect: () => void;
}
  | null;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:163

Watch a handle with experimental FileSystemObserver.

## Parameters

### handle

`FileSystemHandle`

### onRecords

(`records`) => `void`

## Returns

  \| \{
  `disconnect`: () => `void`;
\}
  \| `null`
