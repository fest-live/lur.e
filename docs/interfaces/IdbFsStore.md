[**@fest-lib/lure v0.1.62**](../README.md)

***

[@fest-lib/lure](../README.md) / IdbFsStore

# Interface: IdbFsStore

Defined in: lur.e/src/utils/opfs/IdbFs.ts:34

## Methods

### delete()

```ts
delete(path): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:37

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`void`\>

***

### get()

```ts
get(path): Promise<IdbFsNode | undefined>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:35

#### Parameters

##### path

`string`

#### Returns

`Promise`\<[`IdbFsNode`](../type-aliases/IdbFsNode.md) \| `undefined`\>

***

### list()

```ts
list(parent): Promise<IdbFsNode[]>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:38

#### Parameters

##### parent

`string`

#### Returns

`Promise`\<[`IdbFsNode`](../type-aliases/IdbFsNode.md)[]\>

***

### put()

```ts
put(node): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:36

#### Parameters

##### node

[`IdbFsNode`](../type-aliases/IdbFsNode.md)

#### Returns

`Promise`\<`void`\>
