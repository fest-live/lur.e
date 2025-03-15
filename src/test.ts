import observableArray from "./blue/Array";
import El, { observeSize } from "./blue/Element";
import { makeReactive } from "./lib/object";

//
const children = observableArray(["Движуха!"]);
const style = makeReactive({backgroundColor: "black", color: "white", inlineSize: "100px", blockSize: "100px" });
const element = new El("div", {style}, children);

//
const dStyle = makeReactive({ backgroundColor: "black", color: "white" });
const clone = new El("div", { style: dStyle }, []);

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
