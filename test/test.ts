import observableArray from "../src/blue/Array";
import E, { observeSize } from "../src/blue/Element";
import { makeReactive } from "/externals/lib/object";
import H from "../src/blue/HTML";

//
const children = observableArray(["Движуха!"]);
const style = makeReactive({backgroundColor: "black", color: "white", inlineSize: "100px", blockSize: "100px" });
const element = E("div", {style}, children);

//
const dStyle = makeReactive({ backgroundColor: "black", color: "white" });
const clone = E("div", { style: dStyle }, []);

// create document fragment
const dom = H(`<div>В.В.П.</div>`);

//
observeSize(element, "border-box", dStyle);

//
setTimeout(()=>{
    children[0] = "Разруха!";
    style.backgroundColor = "darkblue";
}, 1000);

//
document.body.append(element.element);
document.body.append(clone.element);
document.body.append(dom);
