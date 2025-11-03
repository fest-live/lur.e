[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / makeTask

# Function: makeTask()

```ts
function makeTask(
   taskId, 
   list?, 
   state?, 
   payload?, 
action?): refValid<any, Task>;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:109](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Tasks.ts#L109)

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
