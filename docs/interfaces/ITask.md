[**@fest-lib/lure v0.1.38**](../README.md)

***

[@fest-lib/lure](../README.md) / ITask

# Interface: ITask

Defined in: lur.e/src/interactive/tasking/Types.ts:2

## Properties

### $active?

```ts
optional $active?: boolean;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:3

***

### list?

```ts
optional list?: ITask[] | null;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:4

***

### payload

```ts
payload: any;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:6

***

### taskId

```ts
taskId: string;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:5

## Accessors

### active

#### Get Signature

```ts
get active(): boolean;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:9

##### Returns

`boolean`

#### Set Signature

```ts
set active(activeStatus): void;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:8

##### Parameters

###### activeStatus

`boolean`

##### Returns

`void`

***

### focus

#### Get Signature

```ts
get focus(): boolean;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:11

##### Returns

`boolean`

#### Set Signature

```ts
set focus(activeStatus): void;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:10

##### Parameters

###### activeStatus

`boolean`

##### Returns

`void`

***

### order

#### Get Signature

```ts
get order(): number;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:7

##### Returns

`number`

## Methods

### addSelfToList()

```ts
addSelfToList(list?, doFocus?): ITask;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:14

#### Parameters

##### list?

`ITask`[] \| `null`

##### doFocus?

`boolean`

#### Returns

`ITask`

***

### removeFromList()

```ts
removeFromList(): ITask;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:15

#### Returns

`ITask`

***

### render()?

```ts
optional render(): any;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:12

#### Returns

`any`

***

### takeAction()?

```ts
optional takeAction(): boolean | void;
```

Defined in: lur.e/src/interactive/tasking/Types.ts:13

#### Returns

`boolean` \| `void`
