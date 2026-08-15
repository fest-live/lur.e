[**@fest-lib/lure v0.1.25**](../README.md)

***

[@fest-lib/lure](../README.md) / makeTask

# Function: makeTask()

```ts
function makeTask(
   taskId, 
   list?, 
   state?, 
   payload?, 
action?): observeValid<Task>;
```

Defined in: lur.e/src/interactive/tasking/Tasks.ts:150

## Parameters

### taskId

`string` \| [`Task`](../classes/Task.md)

### list?

[`ITask`](../interfaces/ITask.md)[] \| `null`

### state?

[`ITaskOptions`](../interfaces/ITaskOptions.md) \| `null`

### payload?

`any` = `{}`

### action?

`any`

## Returns

`observeValid`\<[`Task`](../classes/Task.md)\>
