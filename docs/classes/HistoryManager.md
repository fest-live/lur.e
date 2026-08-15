[**@fest-lib/lure v0.1.22**](../README.md)

***

[@fest-lib/lure](../README.md) / HistoryManager

# Class: HistoryManager

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:22

## Constructors

### Constructor

```ts
new HistoryManager(options?): HistoryManager;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:28

#### Parameters

##### options?

[`HistoryManagerOptions`](../interfaces/HistoryManagerOptions.md) = `{}`

#### Returns

`HistoryManager`

## Methods

### addEntry()

```ts
addEntry(entry): HistoryEntry;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:38

Add a new history entry

#### Parameters

##### entry

`Omit`\<[`HistoryEntry`](../interfaces/HistoryEntry.md), `"id"` \| `"ts"`\>

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md)

***

### clearHistory()

```ts
clearHistory(): void;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:97

Clear all history

#### Returns

`void`

***

### createHistoryView()

```ts
createHistoryView(onEntrySelect?): HTMLElement;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:206

Create history view component

#### Parameters

##### onEntrySelect?

(`entry`) => `void`

#### Returns

`HTMLElement`

***

### createRecentHistoryView()

```ts
createRecentHistoryView(limit?, onEntrySelect?): HTMLElement;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:257

Create compact history display (for recent activity)

#### Parameters

##### limit?

`number` = `3`

##### onEntrySelect?

(`entry`) => `void`

#### Returns

`HTMLElement`

***

### exportHistory()

```ts
exportHistory(): string;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:153

Export history as JSON

#### Returns

`string`

***

### getAllEntries()

```ts
getAllEntries(): HistoryEntry[];
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:62

Get all history entries

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md)[]

***

### getEntryById()

```ts
getEntryById(id): HistoryEntry | undefined;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:76

Get entry by ID

#### Parameters

##### id

`string`

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md) \| `undefined`

***

### getFailedEntries()

```ts
getFailedEntries(): HistoryEntry[];
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:126

Get failed entries only

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md)[]

***

### getRecentEntries()

```ts
getRecentEntries(limit?): HistoryEntry[];
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:69

Get recent entries (last N)

#### Parameters

##### limit?

`number` = `10`

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md)[]

***

### getStatistics()

```ts
getStatistics(): object;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:133

Get statistics

#### Returns

`object`

##### averageDuration

```ts
averageDuration: number;
```

##### failed

```ts
failed: number;
```

##### successful

```ts
successful: number;
```

##### successRate

```ts
successRate: number;
```

##### total

```ts
total: number;
```

***

### getSuccessfulEntries()

```ts
getSuccessfulEntries(): HistoryEntry[];
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:119

Get successful entries only

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md)[]

***

### importHistory()

```ts
importHistory(jsonData): boolean;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:160

Import history from JSON

#### Parameters

##### jsonData

`string`

#### Returns

`boolean`

***

### removeEntry()

```ts
removeEntry(id): boolean;
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:83

Remove entry by ID

#### Parameters

##### id

`string`

#### Returns

`boolean`

***

### searchEntries()

```ts
searchEntries(query): HistoryEntry[];
```

Defined in: lur.e/src/interactive/modules/HistoryManager.ts:107

Search history entries

#### Parameters

##### query

`string`

#### Returns

[`HistoryEntry`](../interfaces/HistoryEntry.md)[]
