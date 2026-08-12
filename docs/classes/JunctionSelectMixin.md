[**@fest-lib/lure v0.1.18**](../README.md)

***

[@fest-lib/lure](../README.md) / JunctionSelectMixin

# Class: JunctionSelectMixin

Defined in: lur.e/src/interactive/mixins/Junction.ts:53

## Extends

- `DOMMixin`

## Constructors

### Constructor

```ts
new JunctionSelectMixin(): JunctionSelectMixin;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:54

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

Defined in: [dom.ts/src/mixin/Mixins.ts:142](https://github.com/fest-live/dom.ts/blob/4e8ac37241299636f8fb17dc847567eb6faeb620/src/mixin/Mixins.ts#L142)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:144](https://github.com/fest-live/dom.ts/blob/4e8ac37241299636f8fb17dc847567eb6faeb620/src/mixin/Mixins.ts#L144)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:143](https://github.com/fest-live/dom.ts/blob/4e8ac37241299636f8fb17dc847567eb6faeb620/src/mixin/Mixins.ts#L143)

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

Defined in: lur.e/src/interactive/mixins/Junction.ts:58

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

Defined in: lur.e/src/interactive/mixins/Junction.ts:184

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

Defined in: [dom.ts/src/mixin/Mixins.ts:139](https://github.com/fest-live/dom.ts/blob/4e8ac37241299636f8fb17dc847567eb6faeb620/src/mixin/Mixins.ts#L139)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:138](https://github.com/fest-live/dom.ts/blob/4e8ac37241299636f8fb17dc847567eb6faeb620/src/mixin/Mixins.ts#L138)

#### Parameters

##### element

`any`

#### Returns

`any`

#### Inherited from

```ts
DOMMixin.storeForElement
```
