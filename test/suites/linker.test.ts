import { handleProperty } from "fest/dom";
import { stringRef } from "fest/object";
import {
    attrRef,
    bindWith,
    checkedRef,
    eventTrigger,
    makeLinker,
    valueRef,
} from "../../src/index";
import type { TestRunner as TestRunnerType } from "../index";

const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

export async function runLinkerTests(TestRunner: typeof TestRunnerType) {
    console.log("\n🔗 CHAPTER 6: Linker and Ref Model Tests\n");

    if (typeof document == "undefined") {
        console.warn("Skipping Linker DOM tests outside browser context");
        return;
    }

    TestRunner.setCategory("6.1 Linker Factory");

    const input = document.createElement("input");
    input.value = "source";
    const linked = stringRef("ref");
    const linker = makeLinker<string>({
        source: input,
        ref: linked,
        getter: ({ source }) => source.value,
        setter: (value, { source }) => { source.value = value; },
        trigger: eventTrigger("input"),
    }).bind();

    await tick();
    TestRunner.assertEqual(input.value, "ref", "makeLinker writes initial ref value to source");

    input.value = "from-source";
    input.dispatchEvent(new Event("input"));
    await tick();
    TestRunner.assertEqual(linked.value, "from-source", "makeLinker stores source trigger into ref");

    linked.value = "from-ref";
    await tick();
    TestRunner.assertEqual(input.value, "from-ref", "makeLinker setter writes ref changes to source");

    linker.unbind();
    input.value = "after-unbind";
    input.dispatchEvent(new Event("input"));
    await tick();
    TestRunner.assertEqual(linked.value, "from-ref", "makeLinker cleanup removes source trigger");

    TestRunner.setCategory("6.2 Ref Compatibility");

    const valueInput = document.createElement("input");
    valueInput.value = "initial";
    const value = valueRef(valueInput);
    await tick();
    TestRunner.assertEqual(value.value, "initial", "valueRef reads initial input value");

    valueInput.value = "changed";
    valueInput.dispatchEvent(new Event("input"));
    await tick();
    TestRunner.assertEqual(value.value, "changed", "valueRef reacts to input events");

    value.value = "written";
    await tick();
    TestRunner.assertEqual(valueInput.value, "written", "valueRef writes ref changes back to input");

    const attrElement = document.createElement("div");
    attrElement.setAttribute("title", "before");
    const title = attrRef(attrElement, "title");
    await tick();
    TestRunner.assertEqual(title.value, "before", "attrRef reads initial attribute");

    attrElement.setAttribute("title", "after");
    await tick();
    TestRunner.assertEqual(title.value, "after", "attrRef reacts to attribute mutations");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    const checked = checkedRef(checkbox);
    await tick();
    TestRunner.assertEqual(checked.value, true, "checkedRef reads initial checked state");

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
    await tick();
    TestRunner.assertEqual(checked.value, false, "checkedRef reacts to change events");

    TestRunner.setCategory("6.3 Binding Interop");

    const boundInput = document.createElement("input");
    const boundRef = stringRef("bound");
    const boundLinker = makeLinker<string>({
        source: boundInput,
        ref: boundRef,
        getter: ({ source }) => source.value,
        setter: (value, { source }) => { source.value = value; },
        trigger: eventTrigger("input"),
    });

    const unbind = bindWith(boundInput, "value", boundLinker, handleProperty);
    await tick();
    TestRunner.assertEqual(boundInput.value, "bound", "bindWith consumes Linker refs");

    boundRef.value = "bound-change";
    await tick();
    TestRunner.assertEqual(boundInput.value, "bound-change", "bindWith keeps Linker ref binding active");

    unbind?.();
}
