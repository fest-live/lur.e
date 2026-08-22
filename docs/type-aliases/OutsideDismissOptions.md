[**@fest-lib/lure v0.1.44**](../README.md)

***

[@fest-lib/lure](../README.md) / OutsideDismissOptions

# Type Alias: OutsideDismissOptions

```ts
type OutsideDismissOptions = object;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:157

## Properties

### capture?

```ts
optional capture?: boolean;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:165

***

### closeEvents?

```ts
optional closeEvents?: string[];
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:163

***

### closeOnEscape?

```ts
optional closeOnEscape?: boolean;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:164

***

### except?

```ts
optional except?: Element | Element[];
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:160

***

### exceptSelectors?

```ts
optional exceptSelectors?: string[];
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:161

***

### inside

```ts
inside: Element | Element[];
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:159

***

### isInside?

```ts
optional isInside?: (event) => boolean;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:162

#### Parameters

##### event

`Event`

#### Returns

`boolean`

***

### onDismiss

```ts
onDismiss: (reason, event?) => void;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:166

#### Parameters

##### reason

[`OutsideDismissReason`](OutsideDismissReason.md)

##### event?

`Event`

#### Returns

`void`

***

### root?

```ts
optional root?: EventTarget | null;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:158
