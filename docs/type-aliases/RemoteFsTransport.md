[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / RemoteFsTransport

# Type Alias: RemoteFsTransport

```ts
type RemoteFsTransport = object;
```

Defined in: lur.e/src/utils/opfs/remote-fs.ts:28

## Methods

### request()

```ts
request(req): Promise<MountedFsResponse>;
```

Defined in: lur.e/src/utils/opfs/remote-fs.ts:29

#### Parameters

##### req

`Omit`\<`MountedFsRequest`, `"id"` \| `"t"`\> & `object`

#### Returns

`Promise`\<`MountedFsResponse`\>
