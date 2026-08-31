[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / Linker

# Interface: Linker\<T\>

Defined in: lur.e/src/lure/core/Links.ts:46

## Type Parameters

### T

`T` = `any`

## Properties

### forProp

```ts
forProp: string;
```

Defined in: lur.e/src/lure/core/Links.ts:49

***

### ref

```ts
ref: any;
```

Defined in: lur.e/src/lure/core/Links.ts:48

***

### source

```ts
source: any;
```

Defined in: lur.e/src/lure/core/Links.ts:47

## Methods

### \[dispose\]()

```ts
dispose: void;
```

Defined in: lur.e/src/lure/core/Links.ts:56

#### Returns

`void`

***

### bind()

```ts
bind(): Linker<T>;
```

Defined in: lur.e/src/lure/core/Links.ts:54

#### Returns

`Linker`\<`T`\>

***

### get()

```ts
get(event?, forProp?): T;
```

Defined in: lur.e/src/lure/core/Links.ts:50

#### Parameters

##### event?

`any`

##### forProp?

`string`

#### Returns

`T`

***

### set()

```ts
set(
   value, 
   event?, 
   forProp?): void;
```

Defined in: lur.e/src/lure/core/Links.ts:51

#### Parameters

##### value

`T`

##### event?

`any`

##### forProp?

`string`

#### Returns

`void`

***

### store()

```ts
store(
   value, 
   event?, 
   forProp?): any;
```

Defined in: lur.e/src/lure/core/Links.ts:52

#### Parameters

##### value

`T`

##### event?

`any`

##### forProp?

`string`

#### Returns

`any`

***

### trigger()

```ts
trigger(event?, forProp?): any;
```

Defined in: lur.e/src/lure/core/Links.ts:53

#### Parameters

##### event?

`any`

##### forProp?

`string`

#### Returns

`any`

***

### unbind()

```ts
unbind(): void;
```

Defined in: lur.e/src/lure/core/Links.ts:55

#### Returns

`void`
