[**@fest-lib/lure v0.1.3**](../README.md)

***

[@fest-lib/lure](../README.md) / SwM

# Class: SwM

Defined in: lur.e/src/lure/node/Switched.ts:26

## Implements

- [`SwitchedParams`](../interfaces/SwitchedParams.md)

## Constructors

### Constructor

```ts
new SwM(params?, mapped?): SwM;
```

Defined in: lur.e/src/lure/node/Switched.ts:33

#### Parameters

##### params?

[`SwitchedParams`](../interfaces/SwitchedParams.md) \| `null`

##### mapped?

`any`

#### Returns

`SwM`

## Properties

### boundParent

```ts
boundParent: Node | null = null;
```

Defined in: lur.e/src/lure/node/Switched.ts:30

***

### current?

```ts
optional current?: 
  | {
  value: string | number;
}
  | null;
```

Defined in: lur.e/src/lure/node/Switched.ts:28

#### Implementation of

[`SwitchedParams`](../interfaces/SwitchedParams.md).[`current`](../interfaces/SwitchedParams.md#current)

***

### mapped?

```ts
optional mapped?: any;
```

Defined in: lur.e/src/lure/node/Switched.ts:29

#### Implementation of

[`SwitchedParams`](../interfaces/SwitchedParams.md).[`mapped`](../interfaces/SwitchedParams.md#mapped)

## Accessors

### element

#### Get Signature

```ts
get element(): Node;
```

Defined in: lur.e/src/lure/node/Switched.ts:44

##### Returns

`Node`

## Methods

### \_onUpdate()

```ts
_onUpdate(
   newVal, 
   prop, 
   oldVal): void;
```

Defined in: lur.e/src/lure/node/Switched.ts:76

#### Parameters

##### newVal

`any`

##### prop

`any`

##### oldVal

`any`

#### Returns

`void`

***

### elementForPotentialParent()

```ts
elementForPotentialParent(requestor): Node;
```

Defined in: lur.e/src/lure/node/Switched.ts:65

#### Parameters

##### requestor

`any`

#### Returns

`Node`
