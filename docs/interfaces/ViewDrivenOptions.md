[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / ViewDrivenOptions

# Interface: ViewDrivenOptions

Defined in: style.ts/src/types.ts:182

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: style.ts/src/types.ts:186

***

### inset?

```ts
optional inset?: string;
```

Defined in: style.ts/src/types.ts:187

***

### kind

```ts
kind: "view";
```

Defined in: style.ts/src/types.ts:183

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: style.ts/src/types.ts:190

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: style.ts/src/types.ts:189

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

Defined in: style.ts/src/types.ts:185

Отслеживаемый subject; по умолчанию сам элемент.
