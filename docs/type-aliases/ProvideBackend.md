[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / ProvideBackend

# Type Alias: ProvideBackend

```ts
type ProvideBackend = object;
```

Defined in: lur.e/src/utils/opfs/provide.ts:34

## Properties

### root

```ts
root: string;
```

Defined in: lur.e/src/utils/opfs/provide.ts:35

## Methods

### list()

```ts
list(path): Promise<ProvideEntry[]>;
```

Defined in: lur.e/src/utils/opfs/provide.ts:36

#### Parameters

##### path

`string`

#### Returns

`Promise`\<[`ProvideEntry`](ProvideEntry.md)[]\>

***

### readFile()?

```ts
optional readFile(path): Promise<File | null>;
```

Defined in: lur.e/src/utils/opfs/provide.ts:37

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`File` \| `null`\>

***

### writeFile()?

```ts
optional writeFile(path, file): Promise<boolean | void>;
```

Defined in: lur.e/src/utils/opfs/provide.ts:38

#### Parameters

##### path

`string`

##### file

`File`

#### Returns

`Promise`\<`boolean` \| `void`\>
