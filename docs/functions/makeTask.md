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

Defined in: [modules/projects/lur.e/src/extension/tasking/Tasks.ts:124](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/tasking/Tasks.ts#L124)

## Parameters

### taskId

`string` | [`Task`](../classes/Task.md)

### list?

[`ITask`](../interfaces/ITask.md)[] | `null`

### state?

[`ITaskOptions`](../interfaces/ITaskOptions.md) | `null`

### payload?

`any` = `{}`

### action?

`any`

## Returns

`refValid`\<`any`, [`Task`](../classes/Task.md)\>
