[**@fest-lib/lure v0.1.64**](../README.md)

***

[@fest-lib/lure](../README.md) / createContentAddressedStore

# Function: createContentAddressedStore()

```ts
function createContentAddressedStore(namespace, backend?): ContentAddressedStore;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:97

Creates an isolated blob/manifest store under an OPFS namespace.

`backend` exists for deterministic tests and must implement the same
namespace behavior as the native OPFS bridge.

## Parameters

### namespace

`string`

### backend?

[`ContentStoreBackend`](../interfaces/ContentStoreBackend.md)

## Returns

[`ContentAddressedStore`](../interfaces/ContentAddressedStore.md)
