[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / UIOrientBox

# Class: UIOrientBox

Defined in: [modules/projects/lur.e/src/extension/orient/OrientBox.ts:6](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/orient/OrientBox.ts#L6)

## Extends

- `DOMMixin`

## Constructors

### Constructor

```ts
new UIOrientBox(name?): UIOrientBox;
```

Defined in: [modules/projects/lur.e/src/extension/orient/OrientBox.ts:7](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/orient/OrientBox.ts#L7)

#### Parameters

##### name?

`any`

#### Returns

`UIOrientBox`

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

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:134](https://github.com/fest-live/dom.ts/blob/983cda32c3c5c867e77e7a9816aea26077dbaaf4/src/mixin/Mixins.ts#L134)

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

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:136](https://github.com/fest-live/dom.ts/blob/983cda32c3c5c867e77e7a9816aea26077dbaaf4/src/mixin/Mixins.ts#L136)

##### Returns

`string` \| `undefined`

#### Inherited from

```ts
DOMMixin.name
```

***

### storage

#### Get Signature

```ts
get storage(): WeakMap<any, any> | undefined;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:135](https://github.com/fest-live/dom.ts/blob/983cda32c3c5c867e77e7a9816aea26077dbaaf4/src/mixin/Mixins.ts#L135)

##### Returns

`WeakMap`\<`any`, `any`\> \| `undefined`

#### Inherited from

```ts
DOMMixin.storage
```

## Methods

### connect()

```ts
connect(ws): UIOrientBox;
```

Defined in: [modules/projects/lur.e/src/extension/orient/OrientBox.ts:10](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/orient/OrientBox.ts#L10)

#### Parameters

##### ws

`any`

#### Returns

`UIOrientBox`

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
   related): UIOrientBox;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:127](https://github.com/fest-live/dom.ts/blob/983cda32c3c5c867e77e7a9816aea26077dbaaf4/src/mixin/Mixins.ts#L127)

#### Parameters

##### wElement

`any`

##### wSelf

`any`

##### related

`any`

#### Returns

`UIOrientBox`

#### Inherited from

```ts
DOMMixin.disconnect
```

***

### relatedForElement()

```ts
relatedForElement(element): object;
```

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:131](https://github.com/fest-live/dom.ts/blob/983cda32c3c5c867e77e7a9816aea26077dbaaf4/src/mixin/Mixins.ts#L131)

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

Defined in: [modules/projects/dom.ts/src/mixin/Mixins.ts:130](https://github.com/fest-live/dom.ts/blob/983cda32c3c5c867e77e7a9816aea26077dbaaf4/src/mixin/Mixins.ts#L130)

#### Parameters

##### element

`any`

#### Returns

`any`

#### Inherited from

```ts
DOMMixin.storeForElement
```
