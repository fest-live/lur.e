/*
 * Filename: reactive-dom.test.ts
 * FullPath: modules/projects/lur.e/test/suites/reactive-dom.test.ts
 * Change date and time: 23.05.00_28.07.2026
 * Reason for changes: Cover reactive nodes, DOM reflection, events, and GLit elements in a real browser.
 */

import { observe, ref } from "fest/object";
import { handleAttribute, handleProperty } from "fest/dom";
import {
    C,
    E,
    GLitElement,
    H,
    I,
    M,
    Q,
    S,
    SwM,
    T,
    defineElement,
    property,
} from "../../src/index";
import { bindWith } from "../../src/lure/core/Binding";
import { reflectChildren, reformChildren } from "../../src/lure/context/ReflectChildren";

import type { TestRunner as TestRunnerType } from "../index";

const tick = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
};

const unwrap = (value: any): any => value?.element ?? value;

const elementTexts = (parent: Element): string[] =>
    Array.from(parent.children).map((child) => child.textContent ?? "");

const assertTexts = (
    TestRunner: typeof TestRunnerType,
    parent: Element,
    expected: string[],
    name: string,
) => {
    TestRunner.assert(
        JSON.stringify(elementTexts(parent)) === JSON.stringify(expected),
        name,
        `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(elementTexts(parent))}`,
    );
};

export async function runReactiveDOMTests(TestRunner: typeof TestRunnerType) {
    console.log("\n🌀 CHAPTER 7: Reactive DOM and Custom Element Tests\n");

    TestRunner.setCategory("7.1 M() mapped nodes");
    const values = observe(["one", "two"]);
    const mappedParent = document.createElement("ul");
    const mapped = M(values, (value: string) => {
        const row = document.createElement("li");
        row.textContent = value;
        return row;
    });

    mappedParent.append(mapped.element as Node);
    mapped.elementForPotentialParent(mappedParent);
    assertTexts(TestRunner, mappedParent, ["one", "two"], "M() renders mapped children");

    values.splice(0, 2, "two", "three");
    await tick();
    assertTexts(TestRunner, mappedParent, ["two", "three"], "M() reconciles splice replacement");

    values.push("four");
    await tick();
    assertTexts(TestRunner, mappedParent, ["two", "three", "four"], "M() appends pushed child");
    mappedParent.remove();

    TestRunner.setCategory("7.2 C() changeable nodes");
    const firstNode = document.createElement("span");
    firstNode.textContent = "first";
    const secondNode = document.createElement("span");
    secondNode.textContent = "second";
    const changeableValue = ref(firstNode);
    const changeable = C(changeableValue) as any;
    const changeableParent = document.createElement("div");

    const initialChangeableNode = changeable.elementForPotentialParent(changeableParent);
    if (initialChangeableNode?.parentNode !== changeableParent) {
        changeableParent.append(initialChangeableNode);
    }
    TestRunner.assertEqual(changeableParent.firstElementChild, firstNode, "C() mounts initial ref element");

    changeableValue.value = secondNode;
    await tick();
    TestRunner.assertEqual(changeableParent.firstElementChild, secondNode, "C() replaces the ref element");
    changeableParent.remove();

    const primitiveValue = ref("primitive-first");
    const primitiveNode = C(primitiveValue) as Node;
    const primitiveParent = document.createElement("div");
    primitiveParent.append(primitiveNode);
    TestRunner.assertEqual(primitiveParent.textContent, "primitive-first", "C() mounts a primitive ref");
    primitiveValue.value = "primitive-second";
    await tick();
    TestRunner.assertEqual(primitiveParent.textContent, "primitive-second", "C() updates a primitive ref");
    primitiveParent.remove();

    TestRunner.setCategory("7.3 I() and SwM() switching");
    const switchFirst = H`<span>first view</span>` as HTMLElement;
    const switchSecond = H`<span>second view</span>` as HTMLElement;
    const current = ref(0);
    const switched = new SwM({ current, mapped: [switchFirst, switchSecond] });
    const switchParent = document.createElement("div");

    switched.elementForPotentialParent(switchParent);
    TestRunner.assertEqual(switchParent.textContent, "first view", "SwM mounts the current node");

    current.value = 1;
    await tick();
    TestRunner.assertEqual(switchParent.textContent, "second view", "SwM swaps after current changes");

    const proxyCurrent = ref(0);
    const proxied = I({ current: proxyCurrent, mapped: [switchFirst, switchSecond] }) as any;
    const proxyParent = document.createElement("div");
    proxied.elementForPotentialParent(proxyParent);
    TestRunner.assertEqual(proxied.textContent, "first view", "I() forwards reads to the current node");

    proxyCurrent.value = 1;
    await tick();
    TestRunner.assertEqual(proxyParent.textContent, "second view", "I() updates its mounted node");
    switchParent.remove();
    proxyParent.remove();

    TestRunner.setCategory("7.4 Q() queried elements");
    const queryHost = document.createElement("div");
    queryHost.innerHTML = `
        <button class="query-item">A</button>
        <button class="query-item">B</button>
    `;
    const queried = Q(".query-item", Q(queryHost)) as any;

    TestRunner.assertEqual(queried.length, 2, "Q() exposes all matching children");
    TestRunner.assertEqual(queried[0].textContent, "A", "Q() exposes the first matching child");
    TestRunner.assertEqual(queried.getAttribute("data-state"), null, "Q() reads the selected child attribute");
    queried.setAttribute("data-state", "ready");
    TestRunner.assertEqual(queried[0].getAttribute("data-state"), "ready", "Q() writes the selected child attribute");

    let delegatedText = "";
    const delegated = (event: Event) => {
        delegatedText = (event.target as HTMLElement).textContent ?? "";
    };
    queried.addEventListener("click", delegated);
    queried[1].dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    queried.removeEventListener("click", delegated);
    TestRunner.assertEqual(delegatedText, "B", "Q() delegates events to matching children");
    queryHost.remove();

    TestRunner.setCategory("7.5 ReflectChildren reconciliation");
    const reformParent = document.createElement("div");
    const stale = document.createElement("i");
    stale.textContent = "stale";
    reformParent.append(stale);
    const reformA = document.createElement("b");
    reformA.textContent = "A";
    const reformB = document.createElement("b");
    reformB.textContent = "B";
    reformChildren(reformParent, [reformA, reformB]);
    assertTexts(TestRunner, reformParent, ["A", "B"], "reformChildren replaces stale children");

    const reflectedParent = document.createElement("div");
    const reflectedA = document.createElement("span");
    reflectedA.textContent = "A";
    const reflectedB = document.createElement("span");
    reflectedB.textContent = "B";
    const reflectedC = document.createElement("span");
    reflectedC.textContent = "C";
    const reflected = observe([reflectedA, reflectedB]);
    reformChildren(reflectedParent, [reflectedA, reflectedB]);
    reflectChildren(reflectedParent, reflected);
    assertTexts(TestRunner, reflectedParent, ["A", "B"], "reflectChildren renders initial children");

    reflected.push(reflectedC);
    await tick();
    assertTexts(TestRunner, reflectedParent, ["A", "B", "C"], "reflectChildren appends added children");

    reflected.pop();
    await tick();
    assertTexts(TestRunner, reflectedParent, ["A", "B"], "reflectChildren removes deleted children");

    const reflectedD = document.createElement("span");
    reflectedD.textContent = "D";
    reflected[0] = reflectedD;
    await tick();
    assertTexts(TestRunner, reflectedParent, ["D", "B"], "reflectChildren replaces set children");
    (reflectedParent as any)[Symbol.dispose]?.();
    (reformParent as any)[Symbol.dispose]?.();

    TestRunner.setCategory("7.6 H(), E(), T(), and S()");
    const greeting = ref("Ada");
    const greetingElement = H`<p>Hello ${greeting}</p>` as HTMLElement;
    document.body.append(greetingElement);
    TestRunner.assertEqual(greetingElement.textContent, "Hello Ada", "H() renders reactive text initially");

    greeting.value = "Grace";
    await tick();
    TestRunner.assertEqual(greetingElement.textContent, "Hello Grace", "H() updates reactive text");

    let templateClicks = 0;
    const templateButton = H`<button on:click=${() => templateClicks++}>Click</button>` as HTMLButtonElement;
    templateButton.click();
    TestRunner.assertEqual(templateClicks, 1, "H() attaches on: events");

    const attributes = observe({ title: "initial" });
    const properties = observe({ value: "one" });
    const dataset = observe({ role: "field" });
    const styles = observe({ color: "red" });
    const inputQuery = E("input", {
        attributes,
        properties,
        dataset,
        style: styles,
    }) as any;
    const input = unwrap(inputQuery) as HTMLInputElement;
    TestRunner.assertEqual(input.title, "initial", "E() reflects initial attributes");
    TestRunner.assertEqual(input.value, "one", "E() reflects initial properties");
    TestRunner.assertEqual(input.dataset.role, "field", "E() reflects initial dataset");
    TestRunner.assertEqual(input.style.color, "red", "E() reflects initial styles");

    attributes.title = "updated";
    properties.value = "two";
    dataset.role = "control";
    styles.color = "blue";
    await tick();
    TestRunner.assertEqual(input.title, "updated", "E() updates reactive attributes");
    TestRunner.assertEqual(input.value, "two", "E() updates reactive properties");
    TestRunner.assertEqual(input.dataset.role, "control", "E() updates reactive dataset");
    TestRunner.assertEqual(input.style.color, "blue", "E() updates reactive styles");

    const childList = E("ul", {}, [
        H`<li>first</li>`,
        H`<li>second</li>`,
    ]) as any;
    assertTexts(TestRunner, unwrap(childList), ["first", "second"], "E() mounts child nodes");

    const reactiveText = ref("before");
    const textNode = T(reactiveText);
    const textParent = document.createElement("div");
    textParent.append(textNode);
    reactiveText.value = "after";
    await tick();
    TestRunner.assertEqual(textParent.textContent, "after", "T() updates a ref-backed text node");

    const styleTarget = document.createElement("div");
    const styleBinding = S`color: red; display: block;`;
    const releaseStyle = (styleBinding as any)[0](styleTarget);
    TestRunner.assertEqual(styleTarget.style.color, "red", "S() applies inline color rules");
    TestRunner.assertEqual(styleTarget.style.display, "block", "S() applies inline display rules");
    releaseStyle?.();
    greetingElement.remove();

    TestRunner.setCategory("7.7 bindings and events");
    const boundInput = document.createElement("input");
    const boundValue = ref("from-state");
    const unbindValue = bindWith(
        boundInput,
        "value",
        boundValue,
        handleProperty,
        undefined,
        true,
    );
    TestRunner.assertEqual(boundInput.value, "from-state", "bindWith() writes the initial property");

    boundValue.value = "next-state";
    await tick();
    TestRunner.assertEqual(boundInput.value, "next-state", "bindWith() follows ref property changes");

    boundInput.value = "from-input";
    boundInput.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    TestRunner.assertEqual(boundValue.value, "from-input", "bindWith() observes input events");
    unbindValue?.();

    const boundElement = document.createElement("div");
    const boundAttribute = ref("before");
    document.body.append(boundElement);
    const unbindAttribute = bindWith(
        boundElement,
        "data-value",
        boundAttribute,
        handleAttribute,
        undefined,
        true,
    );
    boundElement.setAttribute("data-value", "after");
    await tick();
    TestRunner.assertEqual(boundAttribute.value, "after", "bindWith() observes attribute mutations");
    unbindAttribute?.();
    boundElement.remove();

    let elementClicks = 0;
    const eventButton = unwrap(E("button", {
        on: { click: [() => elementClicks++] },
    })) as HTMLButtonElement;
    eventButton.click();
    TestRunner.assertEqual(elementClicks, 1, "E() attaches event maps");

    TestRunner.setCategory("7.8 GLit custom elements");
    const elementName = "x-lure-reactive-suite";
    let connectedCount = 0;
    let disconnectedCount = 0;
    let initializedCount = 0;
    let renderedCount = 0;
    const changedAttributes: string[] = [];
    let shadowClicks = 0;

    class FixtureElement extends GLitElement() {
        static observedAttributes = ["label"];
        declare label: string;

        get initialAttributes() {
            return { "data-initialized": "yes" };
        }

        connectedCallback() {
            connectedCount++;
            super.connectedCallback();
        }

        disconnectedCallback() {
            disconnectedCount++;
            super.disconnectedCallback();
        }

        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
            changedAttributes.push(`${name}:${oldValue ?? ""}->${newValue ?? ""}`);
            super.attributeChangedCallback(name, oldValue, newValue);
        }

        onInitialize() {
            initializedCount++;
            return super.onInitialize();
        }

        render() {
            renderedCount++;
            return H`<button data-role="rendered">${this.label || "empty"}</button>`;
        }
    }

    property({ source: "attr", name: "label" })(FixtureElement.prototype as any, "label");
    defineElement(elementName)(FixtureElement as any);

    const fixture = document.createElement(elementName) as FixtureElement;
    fixture.addEventListener("click", () => shadowClicks++);
    fixture.setAttribute("label", "initial");
    document.body.append(fixture);

    TestRunner.assertEqual(connectedCount, 1, "GLit invokes connectedCallback");
    TestRunner.assertEqual(initializedCount, 1, "GLit invokes onInitialize once");
    TestRunner.assertEqual(renderedCount, 1, "GLit invokes render once");
    TestRunner.assert(fixture.shadowRoot instanceof ShadowRoot, "GLit creates an open shadow root");
    TestRunner.assertEqual(fixture.getAttribute("data-initialized"), "yes", "GLit applies initial attributes");
    TestRunner.assert(
        fixture.shadowRoot?.querySelector("button[data-role='rendered']") != null,
        "GLit mounts render output in shadow DOM",
    );
    TestRunner.assert(
        fixture.shadowRoot?.textContent?.includes("initial") === true,
        "GLit renders the attribute-backed property",
    );
    fixture.shadowRoot?.querySelector("button")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true }),
    );
    TestRunner.assertEqual(shadowClicks, 1, "GLit shadow events cross the host boundary");

    fixture.setAttribute("label", "updated");
    await tick();
    TestRunner.assertEqual(fixture.label, "updated", "property() reads the observed attribute");
    TestRunner.assert(
        fixture.shadowRoot?.textContent?.includes("updated") === true,
        "property() keeps rendered text reactive",
    );
    TestRunner.assert(
        changedAttributes.some((entry) => entry.endsWith("->updated")),
        "GLit reports observed attribute changes",
    );

    fixture.remove();
    fixture.remove();
    document.body.append(fixture);
    await tick();
    TestRunner.assertEqual(disconnectedCount, 1, "GLit invokes disconnectedCallback");
    TestRunner.assertEqual(connectedCount, 2, "GLit reconnects an existing element");
    TestRunner.assertEqual(initializedCount, 1, "GLit does not reinitialize on reconnect");
    fixture.remove();
}
