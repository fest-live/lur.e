[**@fest-lib/lure v0.1.48**](../README.md)

***

[@fest-lib/lure](../README.md) / getCachedComponent

# Function: getCachedComponent()

```ts
function getCachedComponent<T>(
   cacheKey, 
   importFn, 
options): Promise<LazyComponent<T>>;
```

Defined in: lur.e/src/interactive/modules/LazyLoader.ts:76

Get or load a cached component

## Type Parameters

### T

`T`

## Parameters

### cacheKey

`string`

### importFn

() => `Promise`\<`T`\>

### options

[`LazyLoaderOptions`](../interfaces/LazyLoaderOptions.md)

## Returns

`Promise`\<[`LazyComponent`](../interfaces/LazyComponent.md)\<`T`\>\>
