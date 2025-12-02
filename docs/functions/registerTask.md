[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / registerTask

# Function: registerTask()

```ts
function registerTask(task, onClose?): () => void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Manager.ts:35](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/tasking/Manager.ts#L35)

Register a task with the back navigation system
Tasks have lower priority than modals/menus and can be closed via back gesture

## Parameters

### task

[`ITask`](../interfaces/ITask.md)

### onClose?

() => `void`

## Returns

```ts
(): void;
```

### Returns

`void`
