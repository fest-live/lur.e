[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / makeTask

# Function: makeTask()

```ts
function makeTask(
   taskId, 
   list?, 
   state?, 
   payload?, 
action?): refValid<any, Task>;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:109](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/tasking/Tasks.ts#L109)

## Parameters

### taskId

`string` | [`Task`](../classes/Task.md)

### list?

`null` | [`ITask`](../interfaces/ITask.md)[]

### state?

`null` | [`ITaskOptions`](../interfaces/ITaskOptions.md)

### payload?

`any` = `{}`

### action?

`any`

## Returns

`refValid`\<`any`, [`Task`](../classes/Task.md)\>
