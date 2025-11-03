[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / ITask

# Interface: ITask

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:2](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L2)

## Properties

### $active?

```ts
optional $active: boolean;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:3](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L3)

***

### list?

```ts
optional list: null | ITask[];
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:4](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L4)

***

### payload

```ts
payload: any;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:6](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L6)

***

### taskId

```ts
taskId: string;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:5](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L5)

## Accessors

### active

#### Get Signature

```ts
get active(): boolean;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:9](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L9)

##### Returns

`boolean`

#### Set Signature

```ts
set active(activeStatus): void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:8](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L8)

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

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:11](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L11)

##### Returns

`boolean`

#### Set Signature

```ts
set focus(activeStatus): void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:10](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L10)

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

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:7](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L7)

##### Returns

`number`

## Methods

### addSelfToList()

```ts
addSelfToList(list?, doFocus?): ITask;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:14](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L14)

#### Parameters

##### list?

`null` | `ITask`[]

##### doFocus?

`boolean`

#### Returns

`ITask`

***

### removeFromList()

```ts
removeFromList(): ITask;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:15](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L15)

#### Returns

`ITask`

***

### render()?

```ts
optional render(): any;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:12](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L12)

#### Returns

`any`

***

### takeAction()?

```ts
optional takeAction(): boolean | void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/Types.ts:13](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/tasking/Types.ts#L13)

#### Returns

`boolean` \| `void`
