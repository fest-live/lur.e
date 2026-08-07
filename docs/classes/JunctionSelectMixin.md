[**@fest-lib/lure v0.1.3**](../README.md)

***

[@fest-lib/lure](../README.md) / JunctionSelectMixin

# Class: JunctionSelectMixin

Defined in: lur.e/src/interactive/mixins/Junction.ts:51

## Extends

- `DOMMixin`

## Constructors

### Constructor

```ts
new JunctionSelectMixin(): JunctionSelectMixin;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:52

#### Returns

`JunctionSelectMixin`

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

Defined in: [dom.ts/src/mixin/Mixins.ts:134](https://github.com/fest-live/dom.ts/blob/fe46392c2e3d4fe4a91465a33731e148ed7bf1ae/src/mixin/Mixins.ts#L134)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:136](https://github.com/fest-live/dom.ts/blob/fe46392c2e3d4fe4a91465a33731e148ed7bf1ae/src/mixin/Mixins.ts#L136)

##### Returns

`string` \| `undefined`

#### Inherited from

[`JunctionDragMixin`](JunctionDragMixin.md).[`name`](JunctionDragMixin.md#name)

***

### storage

#### Get Signature

```ts
get storage(): WeakMap<any, any> | undefined;
```

Defined in: [dom.ts/src/mixin/Mixins.ts:135](https://github.com/fest-live/dom.ts/blob/fe46392c2e3d4fe4a91465a33731e148ed7bf1ae/src/mixin/Mixins.ts#L135)

##### Returns

`WeakMap`\<`any`, `any`\> \| `undefined`

#### Inherited from

```ts
DOMMixin.storage
```

## Methods

### connect()

```ts
connect(wEl): this;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:56

#### Parameters

##### wEl

`WeakRef`\<`HTMLElement`\>

#### Returns

`this`

#### Overrides

```ts
DOMMixin.connect
```

***

### disconnect()

```ts
disconnect(wEl): this;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:182

#### Parameters

##### wEl

`WeakRef`\<`HTMLElement`\>

#### Returns

`this`

#### Overrides

```ts
DOMMixin.disconnect
```

***

### relatedForElement()

```ts
relatedForElement(element): object;
```

Defined in: [dom.ts/src/mixin/Mixins.ts:131](https://github.com/fest-live/dom.ts/blob/fe46392c2e3d4fe4a91465a33731e148ed7bf1ae/src/mixin/Mixins.ts#L131)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:130](https://github.com/fest-live/dom.ts/blob/fe46392c2e3d4fe4a91465a33731e148ed7bf1ae/src/mixin/Mixins.ts#L130)

#### Parameters

##### element

`any`

#### Returns

`any`

#### Inherited from

```ts
DOMMixin.storeForElement
```
