[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / ViewDrivenOptions

# Interface: ViewDrivenOptions

Defined in: style.ts/src/types.ts:194

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: style.ts/src/types.ts:198

***

### inset?

```ts
optional inset?: string;
```

Defined in: style.ts/src/types.ts:199

***

### kind

```ts
kind: "view";
```

Defined in: style.ts/src/types.ts:195

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: style.ts/src/types.ts:202

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: style.ts/src/types.ts:201

"entry 0%", "cover 50%", "exit 100%"...

***

### subject?

```ts
optional subject?: 
  | Element
  | {
  value: any;
};
```

Defined in: style.ts/src/types.ts:197

Отслеживаемый subject; по умолчанию сам элемент.
