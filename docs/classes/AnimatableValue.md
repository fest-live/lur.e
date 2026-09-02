[**@fest-lib/lure v0.1.55**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableValue

# Class: AnimatableValue

Defined in: style.ts/src/Animatable.ts:37

## Constructors

### Constructor

```ts
new AnimatableValue(steps, options?): AnimatableValue;
```

Defined in: style.ts/src/Animatable.ts:128

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

Defined in: style.ts/src/Animatable.ts:38

***

### id

```ts
readonly id: number;
```

Defined in: style.ts/src/Animatable.ts:39

## Accessors

### finished

#### Get Signature

```ts
get finished(): Promise<void>;
```

Defined in: style.ts/src/Animatable.ts:435

Promise завершения всех активных анимаций.

##### Returns

`Promise`\<`void`\>

***

### options

#### Get Signature

```ts
get options(): AnimatableOptions;
```

Defined in: style.ts/src/Animatable.ts:232

##### Returns

[`AnimatableOptions`](../interfaces/AnimatableOptions.md)

***

### playbackRate

#### Set Signature

```ts
set playbackRate(rate): void;
```

Defined in: style.ts/src/Animatable.ts:432

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

Defined in: style.ts/src/Animatable.ts:233

##### Returns

`any`[]

***

### value

#### Get Signature

```ts
get value(): any;
```

Defined in: style.ts/src/Animatable.ts:201

Последнее известное значение (первый шаг до старта).

##### Returns

`any`

#### Set Signature

```ts
set value(next): void;
```

Defined in: style.ts/src/Animatable.ts:203

##### Parameters

###### next

`any`

##### Returns

`void`

## Methods

### \[toPrimitive\]()

```ts
toPrimitive: string | number;
```

Defined in: style.ts/src/Animatable.ts:219

#### Parameters

##### hint

`string`

#### Returns

`string` \| `number`

***

### attach()

```ts
attach(element, plan): Cleanup;
```

Defined in: style.ts/src/Animatable.ts:292

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

Defined in: style.ts/src/Animatable.ts:429

#### Returns

`AnimatableValue`

***

### finish()

```ts
finish(): AnimatableValue;
```

Defined in: style.ts/src/Animatable.ts:430

#### Returns

`AnimatableValue`

***

### pause()

```ts
pause(): AnimatableValue;
```

Defined in: style.ts/src/Animatable.ts:427

#### Returns

`AnimatableValue`

***

### play()

```ts
play(): AnimatableValue;
```

Defined in: style.ts/src/Animatable.ts:426

#### Returns

`AnimatableValue`

***

### reverse()

```ts
reverse(): AnimatableValue;
```

Defined in: style.ts/src/Animatable.ts:428

#### Returns

`AnimatableValue`

***

### subscribe()

```ts
subscribe(cb): Cleanup;
```

Defined in: style.ts/src/Animatable.ts:227

#### Parameters

##### cb

(`v`) => `void`

#### Returns

[`Cleanup`](../type-aliases/Cleanup.md)

***

### toString()

```ts
toString(): string;
```

Defined in: style.ts/src/Animatable.ts:214

#### Returns

`string`

***

### valueOf()

```ts
valueOf(): any;
```

Defined in: style.ts/src/Animatable.ts:212

First/current step for style coercion (`S\`opacity: ${anim}\`` probes,
Number(), String()). INVARIANT: constructor seeds #current from steps[0].

#### Returns

`any`
