[**@fest-lib/lure v0.1.27**](../README.md)

***

[@fest-lib/lure](../README.md) / TemplateManager

# Class: TemplateManager

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:19

## Constructors

### Constructor

```ts
new TemplateManager(options?): TemplateManager;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:24

#### Parameters

##### options?

[`TemplateManagerOptions`](../interfaces/TemplateManagerOptions.md) = `{}`

#### Returns

`TemplateManager`

## Methods

### addTemplate()

```ts
addTemplate(template): PromptTemplate;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:47

Add a new template

#### Parameters

##### template

`Omit`\<[`PromptTemplate`](../interfaces/PromptTemplate.md), `"id"` \| `"createdAt"` \| `"updatedAt"`\>

#### Returns

[`PromptTemplate`](../interfaces/PromptTemplate.md)

***

### createTemplateEditor()

```ts
createTemplateEditor(container, onSave?): void;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:188

Create template editor modal

#### Parameters

##### container

`HTMLElement`

##### onSave?

() => `void`

#### Returns

`void`

***

### createTemplateSelect()

```ts
createTemplateSelect(selectedPrompt?): HTMLSelectElement;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:285

Create template selector dropdown

#### Parameters

##### selectedPrompt?

`string`

#### Returns

`HTMLSelectElement`

***

### exportTemplates()

```ts
exportTemplates(): string;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:132

Export templates as JSON

#### Returns

`string`

***

### getAllTemplates()

```ts
getAllTemplates(): PromptTemplate[];
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:33

Get all templates

#### Returns

[`PromptTemplate`](../interfaces/PromptTemplate.md)[]

***

### getMostUsedTemplates()

```ts
getMostUsedTemplates(limit?): PromptTemplate[];
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:123

Get most used templates

#### Parameters

##### limit?

`number` = `5`

#### Returns

[`PromptTemplate`](../interfaces/PromptTemplate.md)[]

***

### getTemplateById()

```ts
getTemplateById(id): PromptTemplate | undefined;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:40

Get template by ID

#### Parameters

##### id

`string`

#### Returns

[`PromptTemplate`](../interfaces/PromptTemplate.md) \| `undefined`

***

### getTemplatesByCategory()

```ts
getTemplatesByCategory(category): PromptTemplate[];
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:116

Get templates by category

#### Parameters

##### category

`string`

#### Returns

[`PromptTemplate`](../interfaces/PromptTemplate.md)[]

***

### importTemplates()

```ts
importTemplates(jsonData): boolean;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:139

Import templates from JSON

#### Parameters

##### jsonData

`string`

#### Returns

`boolean`

***

### incrementUsageCount()

```ts
incrementUsageCount(id): void;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:93

Increment usage count for a template

#### Parameters

##### id

`string`

#### Returns

`void`

***

### removeTemplate()

```ts
removeTemplate(id): boolean;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:81

Remove a template

#### Parameters

##### id

`string`

#### Returns

`boolean`

***

### resetToDefaults()

```ts
resetToDefaults(): void;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:174

Reset to default templates

#### Returns

`void`

***

### searchTemplates()

```ts
searchTemplates(query): PromptTemplate[];
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:104

Search templates by name or content

#### Parameters

##### query

`string`

#### Returns

[`PromptTemplate`](../interfaces/PromptTemplate.md)[]

***

### updateTemplate()

```ts
updateTemplate(id, updates): boolean;
```

Defined in: lur.e/src/interactive/modules/TemplateManager.ts:64

Update an existing template

#### Parameters

##### id

`string`

##### updates

`Partial`\<[`PromptTemplate`](../interfaces/PromptTemplate.md)\>

#### Returns

`boolean`
