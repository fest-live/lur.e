[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / SwM

# Class: SwM

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:26](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L26)

## Implements

- [`SwitchedParams`](../interfaces/SwitchedParams.md)

## Constructors

### Constructor

```ts
new SwM(params?, mapped?): SwM;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:33](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L33)

#### Parameters

##### params?

[`SwitchedParams`](../interfaces/SwitchedParams.md) | `null`

##### mapped?

`any`

#### Returns

`SwM`

## Properties

### boundParent

```ts
boundParent: Node | null = null;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:30](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L30)

***

### current?

```ts
optional current: 
  | {
  value: string | number;
}
  | null;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:28](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L28)

#### Implementation of

[`SwitchedParams`](../interfaces/SwitchedParams.md).[`current`](../interfaces/SwitchedParams.md#current)

***

### mapped?

```ts
optional mapped: any;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:29](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L29)

#### Implementation of

[`SwitchedParams`](../interfaces/SwitchedParams.md).[`mapped`](../interfaces/SwitchedParams.md#mapped)

## Accessors

### element

#### Get Signature

```ts
get element(): Node;
```

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:44](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L44)

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

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:76](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L76)

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

Defined in: [modules/projects/lur.e/src/lure/node/Switched.ts:65](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/lure/node/Switched.ts#L65)

#### Parameters

##### requestor

`any`

#### Returns

`Node`
