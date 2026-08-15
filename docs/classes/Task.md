[**@fest-lib/lure v0.1.28**](../README.md)

***

[@fest-lib/lure](../README.md) / Task

# Class: Task

Defined in: lur.e/src/interactive/tasking/Tasks.ts:22

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

Defined in: lur.e/src/interactive/tasking/Tasks.ts:31

#### Parameters

##### taskId

`string`

##### list?

[`ITask`](../interfaces/ITask.md)[] \| `null`

##### state?

[`ITaskOptions`](../interfaces/ITaskOptions.md) \| `null`

##### payload?

`any` = `{}`

##### action?

`any`

#### Returns

`Task`

## Properties

### \_unregisterBack?

```ts
optional _unregisterBack?: () => void;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:28

#### Returns

`void`

***

### $action

```ts
$action: () => boolean | void;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:24

#### Returns

`boolean` \| `void`

***

### $active

```ts
$active: boolean = false;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:23

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`$active`](../interfaces/ITask.md#active)

***

### list?

```ts
optional list?: ITask[] | null;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:27

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`list`](../interfaces/ITask.md#list)

***

### payload

```ts
payload: any;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:25

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`payload`](../interfaces/ITask.md#payload)

***

### taskId

```ts
taskId: string;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:26

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`taskId`](../interfaces/ITask.md#taskid)

## Accessors

### active

#### Get Signature

```ts
get active(): boolean;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:82

##### Returns

`boolean`

#### Set Signature

```ts
set active(activeStatus): void;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:92

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

Defined in: lur.e/src/interactive/tasking/Tasks.ts:84

##### Returns

`boolean`

#### Set Signature

```ts
set focus(activeStatus): void;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:108

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

Defined in: lur.e/src/interactive/tasking/Tasks.ts:83

##### Returns

`number`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`order`](../interfaces/ITask.md#order)

## Methods

### addSelfToList()

```ts
addSelfToList(list?, doFocus?): ITask;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:49

#### Parameters

##### list?

[`ITask`](../interfaces/ITask.md)[] \| `null`

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

Defined in: lur.e/src/interactive/tasking/Tasks.ts:139

#### Returns

`Task`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`removeFromList`](../interfaces/ITask.md#removefromlist)

***

### takeAction()

```ts
takeAction(): boolean | void;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:134

#### Returns

`boolean` \| `void`

#### Implementation of

[`ITask`](../interfaces/ITask.md).[`takeAction`](../interfaces/ITask.md#takeaction)
