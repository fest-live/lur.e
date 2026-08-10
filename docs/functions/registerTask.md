[**@fest-lib/lure v0.1.17**](../README.md)

***

[@fest-lib/lure](../README.md) / registerTask

# Function: registerTask()

```ts
function registerTask(task, onClose?): () => void;
```

Defined in: lur.e/src/interactive/tasking/Manager.ts:48

Register a task with the back navigation system
Tasks have lower priority than modals/menus and can be closed via back gesture

## Parameters

### task

[`ITask`](../interfaces/ITask.md)

### onClose?

() => `void`

## Returns

() => `void`
