[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / EventHandler

# Class: EventHandler

Defined in: lur.e/src/lure/node/Queried.ts:457

## Implements

- `ProxyHandler`\<`object`\>

## Constructors

### Constructor

```ts
new EventHandler(
   target, 
   currentTarget, 
   selector, 
   eventName, 
   callback): EventHandler;
```

Defined in: lur.e/src/lure/node/Queried.ts:458

#### Parameters

##### target

`any`

##### currentTarget

`any`

##### selector

`string` \| `HTMLElement` \| `null`

##### eventName

`string`

##### callback

(`event`) => `void`

#### Returns

`EventHandler`

## Methods

### apply()

```ts
apply(
   _target, 
   thisArg, 
   args): any;
```

Defined in: lur.e/src/lure/node/Queried.ts:499

A trap method for a function call.

#### Parameters

##### \_target

`object`

##### thisArg

`any`

##### args

`any`[]

#### Returns

`any`

#### Implementation of

```ts
ProxyHandler.apply
```

***

### construct()

```ts
construct(_target, args): any;
```

Defined in: lur.e/src/lure/node/Queried.ts:503

A trap for the `new` operator.

#### Parameters

##### \_target

`object`

##### args

`any`[]

#### Returns

`any`

#### Implementation of

```ts
ProxyHandler.construct
```

***

### defineProperty()

```ts
defineProperty(
   _target, 
   name, 
   desc): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:495

A trap for `Object.defineProperty()`.

#### Parameters

##### \_target

`object`

##### name

`PropertyKey`

##### desc

`PropertyDescriptor`

#### Returns

`boolean`

A `Boolean` indicating whether or not the property has been defined.

#### Implementation of

```ts
ProxyHandler.defineProperty
```

***

### deleteProperty()

```ts
deleteProperty(_target, name): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:487

A trap for the `delete` operator.

#### Parameters

##### \_target

`object`

##### name

`PropertyKey`

#### Returns

`boolean`

A `Boolean` indicating whether or not the property was deleted.

#### Implementation of

```ts
ProxyHandler.deleteProperty
```

***

### get()

```ts
get(
   _target, 
   name, 
   ctx): any;
```

Defined in: lur.e/src/lure/node/Queried.ts:461

A trap for getting a property value.

#### Parameters

##### \_target

`object`

##### name

`PropertyKey`

##### ctx

`any`

#### Returns

`any`

#### Implementation of

```ts
ProxyHandler.get
```

***

### getOwnPropertyDescriptor()

```ts
getOwnPropertyDescriptor(_target, name): PropertyDescriptor | undefined;
```

Defined in: lur.e/src/lure/node/Queried.ts:523

A trap for `Object.getOwnPropertyDescriptor()`.

#### Parameters

##### \_target

`object`

##### name

`PropertyKey`

#### Returns

`PropertyDescriptor` \| `undefined`

#### Implementation of

```ts
ProxyHandler.getOwnPropertyDescriptor
```

***

### getPrototypeOf()

```ts
getPrototypeOf(_target): any;
```

Defined in: lur.e/src/lure/node/Queried.ts:507

A trap for the `[[GetPrototypeOf]]` internal method.

#### Parameters

##### \_target

`object`

#### Returns

`any`

#### Implementation of

```ts
ProxyHandler.getPrototypeOf
```

***

### has()

```ts
has(_target, name): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:483

A trap for the `in` operator.

#### Parameters

##### \_target

`object`

##### name

`PropertyKey`

#### Returns

`boolean`

#### Implementation of

```ts
ProxyHandler.has
```

***

### isExtensible()

```ts
isExtensible(_target): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:515

A trap for `Object.isExtensible()`.

#### Parameters

##### \_target

`object`

#### Returns

`boolean`

#### Implementation of

```ts
ProxyHandler.isExtensible
```

***

### ownKeys()

```ts
ownKeys(_target): (string | symbol)[];
```

Defined in: lur.e/src/lure/node/Queried.ts:491

A trap for `Reflect.ownKeys()`.

#### Parameters

##### \_target

`object`

#### Returns

(`string` \| `symbol`)[]

#### Implementation of

```ts
ProxyHandler.ownKeys
```

***

### preventExtensions()

```ts
preventExtensions(_target): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:519

A trap for `Object.preventExtensions()`.

#### Parameters

##### \_target

`object`

#### Returns

`boolean`

#### Implementation of

```ts
ProxyHandler.preventExtensions
```

***

### set()

```ts
set(
   _target, 
   name, 
   value): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:479

A trap for setting a property value.

#### Parameters

##### \_target

`object`

##### name

`PropertyKey`

##### value

`any`

#### Returns

`boolean`

A `Boolean` indicating whether or not the property was set.

#### Implementation of

```ts
ProxyHandler.set
```

***

### setPrototypeOf()

```ts
setPrototypeOf(_target, proto): boolean;
```

Defined in: lur.e/src/lure/node/Queried.ts:511

A trap for `Object.setPrototypeOf()`.

#### Parameters

##### \_target

`object`

##### proto

`any`

#### Returns

`boolean`

#### Implementation of

```ts
ProxyHandler.setPrototypeOf
```
