[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / UIGridBox

# Class: UIGridBox

Defined in: [modules/projects/lur.e/src/extension/grid/GridBox.ts:5](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/grid/GridBox.ts#L5)

## Extends

- `DOMMixin`

## Constructors

### Constructor

```ts
new UIGridBox(name?): UIGridBox;
```

Defined in: [modules/projects/lur.e/src/extension/grid/GridBox.ts:6](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/grid/GridBox.ts#L6)

#### Parameters

##### name?

`any`

#### Returns

`UIGridBox`

#### Overrides

```ts
DOMMixin.constructor
```

## Accessors

### elements

#### Get Signature

```ts
get elements(): any;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:134](https://github.com/fest-live/dom.ts/blob/f3b6f31d65ad2492ce149f3b113044e1f4209407/src/mixin/Mixins.ts#L134)

##### Returns

`any`

#### Inherited from

```ts
DOMMixin.elements
```

***

### name

#### Get Signature

```ts
get name(): string | undefined;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:136](https://github.com/fest-live/dom.ts/blob/f3b6f31d65ad2492ce149f3b113044e1f4209407/src/mixin/Mixins.ts#L136)

##### Returns

`string` \| `undefined`

#### Inherited from

[`UIOrientBox`](UIOrientBox.md).[`name`](UIOrientBox.md#name)

***

### storage

#### Get Signature

```ts
get storage(): WeakMap<any, any> | undefined;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:135](https://github.com/fest-live/dom.ts/blob/f3b6f31d65ad2492ce149f3b113044e1f4209407/src/mixin/Mixins.ts#L135)

##### Returns

`WeakMap`\<`any`, `any`\> \| `undefined`

#### Inherited from

```ts
DOMMixin.storage
```

## Methods

### connect()

```ts
connect(ws): void;
```

Defined in: [modules/projects/lur.e/src/extension/grid/GridBox.ts:9](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/grid/GridBox.ts#L9)

#### Parameters

##### ws

`any`

#### Returns

`void`

#### Overrides

```ts
DOMMixin.connect
```

***

### disconnect()

```ts
disconnect(
   wElement, 
   wSelf, 
   related): UIGridBox;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:127](https://github.com/fest-live/dom.ts/blob/f3b6f31d65ad2492ce149f3b113044e1f4209407/src/mixin/Mixins.ts#L127)

#### Parameters

##### wElement

`any`

##### wSelf

`any`

##### related

`any`

#### Returns

`UIGridBox`

#### Inherited from

```ts
DOMMixin.disconnect
```

***

### relatedForElement()

```ts
relatedForElement(element): object;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:131](https://github.com/fest-live/dom.ts/blob/f3b6f31d65ad2492ce149f3b113044e1f4209407/src/mixin/Mixins.ts#L131)

#### Parameters

##### element

`any`

#### Returns

`object`

##### behaviorSet

```ts
behaviorSet: any;
```

##### mixinSet

```ts
mixinSet: WeakSet<any> | undefined;
```

##### storeSet

```ts
storeSet: Map<any, any>;
```

#### Inherited from

```ts
DOMMixin.relatedForElement
```

***

### storeForElement()

```ts
storeForElement(element): any;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:130](https://github.com/fest-live/dom.ts/blob/f3b6f31d65ad2492ce149f3b113044e1f4209407/src/mixin/Mixins.ts#L130)

#### Parameters

##### element

`any`

#### Returns

`any`

#### Inherited from

```ts
DOMMixin.storeForElement
```
