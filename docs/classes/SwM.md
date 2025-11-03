[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / SwM

# Class: SwM

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:26](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L26)

## Implements

- [`SwitchedParams`](../interfaces/SwitchedParams.md)

## Constructors

### Constructor

```ts
new SwM(params?, mapped?): SwM;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:32](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L32)

#### Parameters

##### params?

`null` | [`SwitchedParams`](../interfaces/SwitchedParams.md)

##### mapped?

`any`

#### Returns

`SwM`

## Properties

### boundParent

```ts
boundParent: null | Node = null;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:29](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L29)

***

### current?

```ts
optional current: 
  | null
  | {
  value: string | number;
};
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:27](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L27)

#### Implementation of

[`SwitchedParams`](../interfaces/SwitchedParams.md).[`current`](../interfaces/SwitchedParams.md#current)

***

### mapped?

```ts
optional mapped: any;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:28](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L28)

#### Implementation of

[`SwitchedParams`](../interfaces/SwitchedParams.md).[`mapped`](../interfaces/SwitchedParams.md#mapped)

## Accessors

### element

#### Get Signature

```ts
get element(): Node;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:42](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L42)

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

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:74](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L74)

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

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:63](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/lure/node/Switched.ts#L63)

#### Parameters

##### requestor

`any`

#### Returns

`Node`
