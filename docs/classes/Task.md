[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / Task

# Class: Task

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:7](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L7)

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

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:15](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L15)

#### Parameters

##### taskId

`string`

##### list?

`null` | [`ITask`](../interfaces/ITask.md)[]

##### state?

`null` | [`ITaskOptions`](../interfaces/ITaskOptions.md)

##### payload?

`any` = `{}`

##### action?

`any`

#### Returns

`Task`

## Properties

### $action()

```ts
$action: () => boolean | void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:9](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L9)

#### Returns

`boolean` \| `void`

***

### $active

```ts
$active: boolean = false;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:8](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L8)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`$active`](../interfaces/ITask.md#active)

***

### list?

```ts
optional list: null | ITask[];
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:12](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L12)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`list`](../interfaces/ITask.md#list)

***

### payload

```ts
payload: any;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:10](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L10)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`payload`](../interfaces/ITask.md#payload)

***

### taskId

```ts
taskId: string;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:11](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L11)

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`taskId`](../interfaces/ITask.md#taskid)

## Accessors

### active

#### Get Signature

```ts
get active(): boolean;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:49](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L49)

##### Returns

`boolean`

#### Set Signature

```ts
set active(activeStatus): void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:59](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L59)

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

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:51](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L51)

##### Returns

`boolean`

#### Set Signature

```ts
set focus(activeStatus): void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:67](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L67)

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

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:50](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L50)

##### Returns

`number`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`order`](../interfaces/ITask.md#order)

## Methods

### addSelfToList()

```ts
addSelfToList(list?, doFocus?): ITask;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:27](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L27)

#### Parameters

##### list?

`null` | [`ITask`](../interfaces/ITask.md)[]

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

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:98](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L98)

#### Returns

`Task`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`removeFromList`](../interfaces/ITask.md#removefromlist)

***

### takeAction()

```ts
takeAction(): boolean | void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:93](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L93)

#### Returns

`boolean` \| `void`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`takeAction`](../interfaces/ITask.md#takeaction)
