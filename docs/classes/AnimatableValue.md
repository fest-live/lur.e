[**@fest-lib/lure v0.1.43**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableValue

# Class: AnimatableValue

Defined in: lur.e/src/lure/misc/Animatable.ts:123

## Constructors

### Constructor

```ts
new AnimatableValue(steps, options?): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:214

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

Defined in: lur.e/src/lure/misc/Animatable.ts:124

***

### id

```ts
readonly id: number;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:125

## Accessors

### finished

#### Get Signature

```ts
get finished(): Promise<void>;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:521

Promise завершения всех активных анимаций.

##### Returns

`Promise`\<`void`\>

***

### options

#### Get Signature

```ts
get options(): AnimatableOptions;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:318

##### Returns

[`AnimatableOptions`](../interfaces/AnimatableOptions.md)

***

### playbackRate

#### Set Signature

```ts
set playbackRate(rate): void;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:518

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

Defined in: lur.e/src/lure/misc/Animatable.ts:319

##### Returns

`any`[]

***

### value

#### Get Signature

```ts
get value(): any;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:287

Последнее известное значение (первый шаг до старта).

##### Returns

`any`

#### Set Signature

```ts
set value(next): void;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:289

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

Defined in: lur.e/src/lure/misc/Animatable.ts:305

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

Defined in: lur.e/src/lure/misc/Animatable.ts:378

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

Defined in: lur.e/src/lure/misc/Animatable.ts:515

#### Returns

`AnimatableValue`

***

### finish()

```ts
finish(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:516

#### Returns

`AnimatableValue`

***

### pause()

```ts
pause(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:513

#### Returns

`AnimatableValue`

***

### play()

```ts
play(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:512

#### Returns

`AnimatableValue`

***

### reverse()

```ts
reverse(): AnimatableValue;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:514

#### Returns

`AnimatableValue`

***

### subscribe()

```ts
subscribe(cb): Cleanup;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:313

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

Defined in: lur.e/src/lure/misc/Animatable.ts:300

#### Returns

`string`

***

### valueOf()

```ts
valueOf(): any;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:298

First/current step for style coercion (`S\`opacity: ${anim}\`` probes,
Number(), String()). INVARIANT: constructor seeds #current from steps[0].

#### Returns

`any`
