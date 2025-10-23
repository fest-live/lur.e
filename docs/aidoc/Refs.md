# Reactive DOM primitives

---

### `$mapped`, `$virtual`, `$behavior`

Символы для аннотирования специальных свойств/поведения.

---

### localStorageRef(key, initial?)

Двунаправленная связка с localStorage.
**Аргументы:**

- `key: string` — ключ localStorage
- `initial: any` — начальное значение (опционально)
**Возвращает:** stringRef, синхронизированный с localStorage
**Особенности:** Реагирует на события storage.

---

### matchMediaRef(condition)

Ссылка на медиазапрос.
**Аргументы:**

- `condition: string` — media condition
**Возвращает:** booleanRef (true/false при совпадении медиаусловия)

---

### visibleRef(element, initial?)

Двунаправленная ссылка на видимость по атрибуту `data-hidden`.
**Аргументы:**

- `element: HTMLElement`
- `initial: any` — начальное значение
**Возвращает:** booleanRef
**Особенности:** Равляет события, обновляет атрибут.

---

### attrRef(element, attribute, initial?)

Двунаправленная ссылка к произвольному атрибуту элемента.
**Аргументы:**

- `element: HTMLElement`
- `attribute: string`
- `initial: any`
**Возвращает:** stringRef
**Особенности:** Отслеживает через MutationObserver.

---

### sizeRef(element, axis, box?)

Автоматически отслеживает размер элемента.
**Аргументы:**

- `element: HTMLElement`
- `axis: "inline" | "block"`
- `box: ResizeObserverBoxOptions` ("border-box" по умолчанию)
**Возвращает:** numberRef (размер)
**Особенности:** Только чтение.

---

### scrollRef(element, axis, initial?)

Бидир. ссылка-отражение scrollTop/scrollLeft.
**Аргументы:**

- `element: HTMLElement`
- `axis: "inline"|"block"`
- `initial: number`
**Возвращает:** numberRef (скролл)

---

### checkedRef(element)

Двунаправленная ссылка на состояние checkbox'а.
**Аргументы:**

- `element: HTMLInputElement`
**Возвращает:** booleanRef

---

### valueRef(element)

Двунаправленная ссылка на value input'а (text, etc).
**Аргументы:**

- `element: HTMLInputElement`
**Возвращает:** stringRef

---

### valueAsNumberRef(element)

Двунаправленная ссылка на числовое value input'а (type=number).
**Аргументы:**

- `element: HTMLInputElement`
**Возвращает:** numberRef

---

### bindBeh(element, store, behavior)

Связывает элемент, хранилище и поведение (behavior).
**Аргументы:**

- `element: HTMLElement`
- `store: [string, object]`
- `behavior: function`
**Возвращает:** `element`

---

### refCtl(value)

Создает управляемый ref с контроллером побочных эффектов.
**Аргументы:**

- `value: any`
**Возвращает:** Ref

---

### checkboxCtrl(ref)

Контроллер для checkbox (handler).
**Аргументы:** `ref`
**Возвращает:** handler function (ev)

---

### numberCtrl(ref)

Контроллер для числовых input'ов.
**Аргументы:** `ref`
**Возвращает:** handler function (ev)

---

### valueCtrl(ref)

Контроллер для текстовых input'ов.
**Аргументы:** `ref`
**Возвращает:** handler function (ev)

---

### radioCtrl(ref, name)

Контроллер для radio input'ов по name.
**Аргументы:**

- `ref`
- `name: string`
**Возвращает:** handler function (ev)

---

### bindCtrl(element, ctrl)

Биндит контроллер к событием DOM.
**Аргументы:**

- `element`
- `ctrl` (function)
**Возвращает:** отменяющая функцию (remove listeners).

---

### OOBTrigger(element, ref, selector?)

Обработка "клик вне элемента", сбрасывает ref.value=false.
**Аргументы:**

- `element`
- `ref`
- `selector?: string`
**Возвращает:** cancel function

---

### reflectControllers(element, ctrls)

Подключает массив контроллеров к элементу.
**Аргументы:**

- `element`
- `ctrls: Array<Function>`
**Возвращает:** element

---

### observeSize(element, box, styles?)

Синхронно обновляет размеры-стили (makeReactive) по наблюдению.
**Аргументы:**

- `element`
- `box: ResizeObserverBoxOptions`
- `styles: object` (опционально, `reactive`)
**Возвращает:** `styles` `object`

---

### bindHandler(el, value, prop, handler, set?)

Связывает рефы или значения с handler'ом стиля/атрибута.
**Аргументы:**

- `el: WeakRef`
- `value: ref`
- `prop: string`
- `handler: function`
- `set?: any`

---

### makeRAFCycle()

Создает объект, обеспечивающий "batch" обновления через requestAnimationFrame.
**Аргументы:** нет
**Возвращает:** control object

- `control.cancel()`: отменяет цикл
- `control.shedule(cb)`: планирует cb

---

### RAFBehavior(cb, shed?)

Возвращает функцию, откладывающую вызовы cb в текущий requestAnimationFrame.
**Аргументы:**

- `cb: function`
- `shed: RAFCycle` (опционально)
**Возвращает:** `(...args) => Promise<void>`

---

**Если нужно описание не только интерфейса, но и внутренней логики — уточните.**
