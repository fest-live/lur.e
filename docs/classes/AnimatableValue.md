[**@fest-lib/lure v0.1.35**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableValue

# Class: AnimatableValue

Defined in: lur.e/src/lure/misc/Animatable.ts:116

## Constructors

### Constructor

```ts
new AnimatableValue(steps, options?): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:207

#### Parameters

##### steps

`any`[]

##### options?

[`AnimatableOptions`](../interfaces/AnimatableOptions.md) = `{}`

#### Returns

`AnimatableValue`

## Properties

### \[ANIMATABLE\_BRAND\]

```ts
readonly [ANIMATABLE_BRAND]: true = true;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:117

***

### id

```ts
readonly id: number;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:118

## Accessors

### finished

#### Get Signature

```ts
get finished(): Promise<void>;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:495

Promise завершения всех активных анимаций.

##### Returns

`Promise`\<`void`\>

***

### options

#### Get Signature

```ts
get options(): AnimatableOptions;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:292

##### Returns

[`AnimatableOptions`](../interfaces/AnimatableOptions.md)

***

### playbackRate

#### Set Signature

```ts
set playbackRate(rate): void;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:492

##### Parameters

###### rate

`number`

##### Returns

`void`

***

### steps

#### Get Signature

```ts
get steps(): any[];
```

Defined in: lur.e/src/lure/misc/Animatable.ts:293

##### Returns

`any`[]

***

### value

#### Get Signature

```ts
get value(): any;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:280

Последнее известное значение (первый шаг до старта).

##### Returns

`any`

#### Set Signature

```ts
set value(next): void;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:282

##### Parameters

###### next

`any`

##### Returns

`void`

## Methods

### attach()

```ts
attach(element, plan): Cleanup;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:352

#### Parameters

##### element

`HTMLElement`

##### plan

[`AnimatableApplyPlan`](../interfaces/AnimatableApplyPlan.md)

#### Returns

[`Cleanup`](../type-aliases/Cleanup.md)

***

### cancel()

```ts
cancel(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:489

#### Returns

`AnimatableValue`

***

### finish()

```ts
finish(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:490

#### Returns

`AnimatableValue`

***

### pause()

```ts
pause(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:487

#### Returns

`AnimatableValue`

***

### play()

```ts
play(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:486

#### Returns

`AnimatableValue`

***

### reverse()

```ts
reverse(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:488

#### Returns

`AnimatableValue`

***

### subscribe()

```ts
subscribe(cb): Cleanup;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:287

#### Parameters

##### cb

(`v`) => `void`

#### Returns

[`Cleanup`](../type-aliases/Cleanup.md)
