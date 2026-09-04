[**@fest-lib/lure v0.1.61**](../README.md)

***

[@fest-lib/lure](../README.md) / lazyLoadComponent

# Function: lazyLoadComponent()

```ts
function lazyLoadComponent<T>(importFn, options): Promise<LazyComponent<T>>;
```

Defined in: lur.e/src/interactive/modules/LazyLoader.ts:18

Lazy load a component and its CSS

## Type Parameters

### T

`T`

## Parameters

### importFn

() => `Promise`\<`T`\>

### options

[`LazyLoaderOptions`](../interfaces/LazyLoaderOptions.md)

## Returns

`Promise`\<[`LazyComponent`](../interfaces/LazyComponent.md)\<`T`\>\>
