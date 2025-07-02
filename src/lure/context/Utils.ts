import { unwrap, subscribe } from "u2re/object";
import { elMap, $virtual, $mapped } from "../core/Binding";

//
const
    /**
     * @constant
     * @description Регулярное выражение для матчинга имени, id, класса и атрибутов css-селектора.
     */
    MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
    REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)(["\'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]';

//
/**
 * Преобразует строку из camelCase в kebab-case.
 * @param {string} str - Входная строка в camelCase.
 * @returns {string} Строка в kebab-case.
 */
export const camelToKebab = (str) => { return str?.replace?.(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }

/**
 * Преобразует строку из kebab-case в camelCase.
 * @param {string} str - Входная строка в kebab-case.
 * @returns {string} Строка в camelCase.
 */
export const kebabToCamel = (str) => { return str?.replace?.(/-([a-z])/g, (_, char) => char.toUpperCase()); }

/**
 * Создает HTML-элемент или DocumentFragment на основе CSS-like селектора.
 * @param {string} selector - Строка-селектор (например, "div#id.class[attr='value']").
 * @returns {HTMLElement|DocumentFragment} Созданный DOM-элемент.
 */
export const createElement = (selector): HTMLElement | DocumentFragment => {
    if (selector == ":fragment:") return document.createDocumentFragment();
    const create = document.createElement.bind(document);
    for (var node: any = create('div'), match, className = ''; selector && (match = selector.match(REGEX));) {
        if (match[1]) node = create(match[1]);
        if (match[2]) node.id = match[2];
        if (match[3]) className += ' ' + match[3];
        if (match[4]) node.setAttribute(match[4], match[7] || '');
        selector = selector.slice(match[0].length);
    }
    if (className) node.className = className.slice(1);
    return node;
};

/**
 * Получает DOM-узел для произвольного значения, поддерживая функции/реактивности.
 * @param {*} E - Исходное значение (element, функция, объект или значение).
 * @param {Function} [mapper] - Дополнительная функция отображения.
 * @param {number} [index] - Индекс элемента (для массивов).
 * @returns {Node|HTMLElement|DocumentFragment|Text|*} DOM-узел либо результат отображения.
 */
export const getNode = (E, mapper?: Function, index?: number) => {
    if (mapper) { return (E = getNode(mapper?.(E, index))); }
    if (E instanceof Node || E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment) { return E; } else
    if (typeof E?.value == "string" || typeof E?.value == "number") { return T(E); } else
    if (typeof E == "function") { return getNode(E()); } else  // mapped arrays always empties after
    if (typeof E == "string" || typeof E == "number") { return document.createTextNode(String(E)); } else
    if (typeof E == "object" && E != null) { return E?.element ?? elMap.get(E); }; return E;
}

/**
 * Добавляет потомка к DOM-элементу, корректно обрабатывает массивы и реактивные объекты.
 * @param {Element} element - Родительский DOM-элемент.
 * @param {*} cp - Дочерний элемент или коллекция.
 * @param {Function} [mapper] - Дополнительная функция отображения.
 */
export const appendChild = (element, cp, mapper?) => {
    if (mapper) { cp = mapper?.(cp) ?? cp; }
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && !(cp?.[$virtual] || cp?.[$mapped])) { element?.append?.(...(unwrap(cp?.children)?.map?.((cl, _: number) => (getNode(cl) ?? ""))?.filter?.((el) => el != null) ?? unwrap(cp?.children))); } else
        if (Array.isArray(unwrap(cp))) { element?.append?.(...unwrap(cp?.map?.((cl, _: number) => (getNode(cl) ?? ""))?.filter?.((el) => el != null) ?? unwrap(cp))); } else { const node = getNode(cp); if (node != null && (!node?.parentNode || node?.parentNode != element)) { element?.append?.(node); } }
}

/**
 * Заменяет дочерние элементы element на cp (или изменяет содержимое TextNode при возможности, не создавая новый).
 * @param {Element} element - Родительский DOM-элемент.
 * @param {*} cp - Новый контент.
 * @param {number} index - Индекс заменяемого дочернего узла.
 * @param {Function} [mapper] - Дополнительная функция отображения.
 */
export const replaceChildren = (element, cp, mapper?, index?) => {
    if (mapper) { cp = mapper?.(cp) ?? cp; }
    const cn = element?.childNodes?.[index];
    if (cn instanceof Text && typeof cp == "string") { cn.textContent = cp; } else {
        const node = getNode(cp);
        if (cn instanceof Text && node instanceof Text) { if (cn.textContent != node.textContent) { cn.textContent = node.textContent; } } else
            if (cn != node && (!node?.parentNode || node?.parentNode != element)) { cn?.replaceWith?.(node); }
    }
}

/**
 * Удаляет дочерний узел или группу узлов из DOM-элемента.
 * @param {Element} element - Родительский DOM-элемент.
 * @param {*} cp - Дочерний элемент (или коллекция).
 * @param {Function} [mapper] - Дополнительная функция отображения.
 * @param {number} [index=-1] - Индекс, если необходима адресация.
 * @returns {Element} Родительский элемент.
 */
export const removeChild = (element, cp, mapper?, index = -1) => {
    if (element?.childNodes?.length < 1) return;
    const node = getNode(cp = mapper?.(cp) ?? cp);
    const ch = node ?? (index >= 0 ? element?.childNodes?.[index] : null);
    if (ch?.parentNode == element) { ch?.remove?.(); } else
        if (ch?.children && ch?.children?.length >= 1) { // TODO: remove by same string value
            ch?.children?.forEach?.(c => { const R = (elMap.get(c) ?? c); if (R == element?.parentNode) R?.remove?.(); });
        } else { (ch)?.remove?.(); }
    return element;
}

/**
 * Удаляет из element все дочерние узлы, которых нет среди unwrap(children).
 * @param {Element} element - Родительский DOM-элемент.
 * @param {*} children - Список детей, которые должны остаться.
 * @param {Function} mapper - Функция отображения над child.
 * @returns {Element} Родительский элемент.
 */
export const removeNotExists = (element, children, mapper) => {
    const uw = Array.from(unwrap(children))?.map?.((cp) => getNode(mapper?.(cp) ?? cp));
    Array.from(element.childNodes).forEach((nd: any) => { if (uw!?.find?.((cp) => (cp == nd))) nd?.remove?.(); });
    return element;
}

/**
 * Получает или создает text node, подписанный на изменение свойства value объекта ref.
 * (reactive binding, text node reused через elMap)
 * @experimental
 * @param {object} ref - Объект с реактивным свойством value.
 * @returns {Text} Текстовый DOM-узел.
 */
export const T = (ref) => {
    // @ts-ignore // !experimental `getOrInsert` feature!
    return elMap.getOrInsertComputed(ref, () => {
        const element = document.createTextNode(String(ref?.value ?? ""));
        subscribe([ref, "value"], (val) => (element.textContent = val));
        return element;
    });
}

//
export default getNode;
