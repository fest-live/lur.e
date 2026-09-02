[**@fest-lib/lure v0.1.56**](../README.md)

***

[@fest-lib/lure](../README.md) / RemoteFsTransport

# Type Alias: RemoteFsTransport

```ts
type RemoteFsTransport = object;
```

Defined in: lur.e/src/utils/opfs/remote-fs.ts:26

## Methods

### request()

```ts
request(req): Promise<MountedFsResponse>;
```

Defined in: lur.e/src/utils/opfs/remote-fs.ts:27

#### Parameters

##### req

`Omit`\<`MountedFsRequest`, `"id"` \| `"t"`\> & `object`

#### Returns

`Promise`\<`MountedFsResponse`\>
