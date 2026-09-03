[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / IDB\_FS\_ROOT

# Variable: IDB\_FS\_ROOT

```ts
const IDB_FS_ROOT: "/idb/" = "/idb/";
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:14

FIND:idb-fs
TAG:opfs,idb
IndexedDB FileSystem-handle backend for OPFS.

INVARIANT: handles expose the same surface as OPFS
(`getDirectoryHandle` / `getFileHandle` / `entries` / `removeEntry` /
`getFile` / `createWritable`) so `mappedRoots` can swap backends.

WHY: OPFS is missing on some hosts, or can be turned off. Then `/user/`
uses this store. When OPFS stays on (default), the same store is `/idb/`.
