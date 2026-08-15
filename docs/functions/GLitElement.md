[**@fest-lib/lure v0.1.22**](../README.md)

***

[@fest-lib/lure](../README.md) / GLitElement

# Function: GLitElement()

```ts
function GLitElement<T>(derivate?): GLitElementClass<T>;
```

Defined in: lur.e/src/lure/misc/Glit.ts:509

GLitElement: Создаёт базовый класс для кастомных элементов с расширенными возможностями.
Поддерживает все lifecycle callbacks Web Components.

## Type Parameters

### T

`T` *extends* `HTMLElement` = `HTMLElement`

## Parameters

### derivate?

[`HTMLElementConstructor`](../type-aliases/HTMLElementConstructor.md)\<`T`\>

Базовый класс для расширения (по умолчанию HTMLElement).

## Returns

[`GLitElementClass`](../type-aliases/GLitElementClass.md)\<`T`\>

Конструктор расширенного класса с полной поддержкой lifecycle.

## Example

```typescript
// Базовое использование
class MyElement extends GLitElement() {
    connectedCallback() {
        super.connectedCallback();
        console.log('Connected!');
    }
    
    render() {
        return H`<div>Hello</div>`;
    }
}

// С наследованием от другого элемента
class MyButton extends GLitElement(HTMLButtonElement) {
    static observedAttributes = ['disabled'];
    
    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`${name} changed from ${oldVal} to ${newVal}`);
    }
}

// С декоратором
@defineElement('my-element')
class MyElement extends GLitElement() {
    @property({ source: 'attr', name: 'value' })
    value: string = '';
    
    disconnectedCallback() {
        console.log('Disconnected!');
    }
}
```
