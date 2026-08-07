[**@fest-lib/lure v0.1.3**](../README.md)

***

[@fest-lib/lure](../README.md) / makeRef

# Function: makeRef()

```ts
function makeRef<T>(
   host?, 
   type?, 
   link?, ...
args): T extends object ? observeValid<T> | refType<T> : refType<T>;
```

Defined in: lur.e/src/lure/core/Refs.ts:12

## Type Parameters

### T

`T` = `any`

## Parameters

### host?

`any`

### type?

`any`

### link?

`any`

### args

...`any`[]

## Returns

`T` *extends* `object` ? `observeValid`\<`T`\> \| `refType`\<`T`\> : `refType`\<`T`\>
