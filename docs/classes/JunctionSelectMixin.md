[**@fest-lib/lure v0.1.87**](../README.md)

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
get elements(): WeakSet<Element> | undefined;
```

Defined in: dom.ts/src/mixin/Mixins.ts:513

##### Returns

`WeakSet`\<`Element`\> \| `undefined`

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

Defined in: dom.ts/src/mixin/Mixins.ts:515

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
get storage(): unknown;
```

Defined in: dom.ts/src/mixin/Mixins.ts:514

##### Returns

`unknown`

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
relatedForElement(element): Related;
```

Defined in: dom.ts/src/mixin/Mixins.ts:512

#### Parameters

##### element

`Element`

#### Returns

`Related`

#### Inherited from

```ts
DOMMixin.relatedForElement
```

***

### storeForElement()

```ts
storeForElement(element): unknown;
```

Defined in: dom.ts/src/mixin/Mixins.ts:511

#### Parameters

##### element

`Element`

#### Returns

`unknown`

#### Inherited from

```ts
DOMMixin.storeForElement
```
