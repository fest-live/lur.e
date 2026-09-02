[**@fest-lib/lure v0.1.55**](../README.md)

***

[@fest-lib/lure](../README.md) / JunctionSelectMixin

# Class: JunctionSelectMixin

Defined in: lur.e/src/interactive/mixins/Junction.ts:54

## Extends

- `DOMMixin`

## Constructors

### Constructor

```ts
new JunctionSelectMixin(): JunctionSelectMixin;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:55

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

Defined in: [dom.ts/src/mixin/Mixins.ts:146](https://github.com/fest-live/dom.ts/blob/fea01c06d04a87e898340b27e981d4745703b6df/src/mixin/Mixins.ts#L146)

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
get name(): any;
```

Defined in: [dom.ts/src/mixin/Mixins.ts:148](https://github.com/fest-live/dom.ts/blob/fea01c06d04a87e898340b27e981d4745703b6df/src/mixin/Mixins.ts#L148)

##### Returns

`any`

#### Inherited from

[`JunctionDragMixin`](JunctionDragMixin.md).[`name`](JunctionDragMixin.md#name)

***

### storage

#### Get Signature

```ts
get storage(): any;
```

Defined in: [dom.ts/src/mixin/Mixins.ts:147](https://github.com/fest-live/dom.ts/blob/fea01c06d04a87e898340b27e981d4745703b6df/src/mixin/Mixins.ts#L147)

##### Returns

`any`

#### Inherited from

```ts
DOMMixin.storage
```

## Methods

### connect()

```ts
connect(wEl): this;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:59

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

Defined in: lur.e/src/interactive/mixins/Junction.ts:185

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

Defined in: [dom.ts/src/mixin/Mixins.ts:143](https://github.com/fest-live/dom.ts/blob/fea01c06d04a87e898340b27e981d4745703b6df/src/mixin/Mixins.ts#L143)

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
mixinSet: any;
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

Defined in: [dom.ts/src/mixin/Mixins.ts:142](https://github.com/fest-live/dom.ts/blob/fea01c06d04a87e898340b27e981d4745703b6df/src/mixin/Mixins.ts#L142)

#### Parameters

##### element

`any`

#### Returns

`any`

#### Inherited from

```ts
DOMMixin.storeForElement
```
