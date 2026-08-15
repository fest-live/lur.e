[**@fest-lib/lure v0.1.32**](../README.md)

***

[@fest-lib/lure](../README.md) / JunctionDragMixin

# Class: JunctionDragMixin

Defined in: lur.e/src/interactive/mixins/Junction.ts:191

## Extends

- `DOMMixin`

## Constructors

### Constructor

```ts
new JunctionDragMixin(): JunctionDragMixin;
```

Defined in: lur.e/src/interactive/mixins/Junction.ts:192

#### Returns

`JunctionDragMixin`

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

Defined in: [dom.ts/src/mixin/Mixins.ts:142](https://github.com/fest-live/dom.ts/blob/ce490815573eef2bac17b432dbcb0c3fa709de13/src/mixin/Mixins.ts#L142)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:144](https://github.com/fest-live/dom.ts/blob/ce490815573eef2bac17b432dbcb0c3fa709de13/src/mixin/Mixins.ts#L144)

##### Returns

`any`

#### Inherited from

```ts
DOMMixin.name
```

***

### storage

#### Get Signature

```ts
get storage(): any;
```

Defined in: [dom.ts/src/mixin/Mixins.ts:143](https://github.com/fest-live/dom.ts/blob/ce490815573eef2bac17b432dbcb0c3fa709de13/src/mixin/Mixins.ts#L143)

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

Defined in: lur.e/src/interactive/mixins/Junction.ts:196

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

Defined in: lur.e/src/interactive/mixins/Junction.ts:281

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

Defined in: [dom.ts/src/mixin/Mixins.ts:139](https://github.com/fest-live/dom.ts/blob/ce490815573eef2bac17b432dbcb0c3fa709de13/src/mixin/Mixins.ts#L139)

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

Defined in: [dom.ts/src/mixin/Mixins.ts:138](https://github.com/fest-live/dom.ts/blob/ce490815573eef2bac17b432dbcb0c3fa709de13/src/mixin/Mixins.ts#L138)

#### Parameters

##### element

`any`

#### Returns

`any`

#### Inherited from

```ts
DOMMixin.storeForElement
```
