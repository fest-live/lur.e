[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / Task

# Class: Task

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:8](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L8)

## Implements

- [`ITask`](../interfaces/ITask.md)

## Constructors

### Constructor

```ts
new Task(
   taskId, 
   list?, 
   state?, 
   payload?, 
   action?): Task;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:17](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L17)

#### Parameters

##### taskId

`string`

##### list?

[`ITask`](../interfaces/ITask.md)[] | `null`

##### state?

[`ITaskOptions`](../interfaces/ITaskOptions.md) | `null`

##### payload?

`any` = `{}`

##### action?

`any`

#### Returns

`Task`

## Properties

### \_unregisterBack()?

```ts
optional _unregisterBack: () => void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:14](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L14)

#### Returns

`void`

***

### $action()

```ts
$action: () => boolean | void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:10](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L10)

#### Returns

`boolean` \| `void`

***

### $active

```ts
$active: boolean = false;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:9](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L9)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`$active`](../interfaces/ITask.md#active)

***

### list?

```ts
optional list: ITask[] | null;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:13](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L13)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`list`](../interfaces/ITask.md#list)

***

### payload

```ts
payload: any;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:11](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L11)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`payload`](../interfaces/ITask.md#payload)

***

### taskId

```ts
taskId: string;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:12](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L12)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`taskId`](../interfaces/ITask.md#taskid)

## Accessors

### active

#### Get Signature

```ts
get active(): boolean;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:56](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L56)

##### Returns

`boolean`

#### Set Signature

```ts
set active(activeStatus): void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:66](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L66)

##### Parameters

###### activeStatus

`boolean`

##### Returns

`void`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`active`](../interfaces/ITask.md#active-1)

***

### focus

#### Get Signature

```ts
get focus(): boolean;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:58](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L58)

##### Returns

`boolean`

#### Set Signature

```ts
set focus(activeStatus): void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:82](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L82)

##### Parameters

###### activeStatus

`boolean`

##### Returns

`void`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`focus`](../interfaces/ITask.md#focus)

***

### order

#### Get Signature

```ts
get order(): number;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:57](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L57)

##### Returns

`number`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`order`](../interfaces/ITask.md#order)

## Methods

### addSelfToList()

```ts
addSelfToList(list?, doFocus?): ITask;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:32](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L32)

#### Parameters

##### list?

[`ITask`](../interfaces/ITask.md)[] | `null`

##### doFocus?

`boolean` = `false`

#### Returns

[`ITask`](../interfaces/ITask.md)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`addSelfToList`](../interfaces/ITask.md#addselftolist)

***

### removeFromList()

```ts
removeFromList(): Task;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:113](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L113)

#### Returns

`Task`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`removeFromList`](../interfaces/ITask.md#removefromlist)

***

### takeAction()

```ts
takeAction(): boolean | void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:108](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/tasking/Tasks.ts#L108)

#### Returns

`boolean` \| `void`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`takeAction`](../interfaces/ITask.md#takeaction)
