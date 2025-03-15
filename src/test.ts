import observableArray from "./blue/Array";
import El from "./blue/Element";
import { makeReactive } from "./lib/object";

//
const children = observableArray(["Движуха!"]);
const style = makeReactive({backgroundColor: "black", inlineSize: "100px", blockSize: "100px", color: "white"});
const element = new El("div", {style}, children);

//
setTimeout(()=>{
    children[0] = "Разруха!";
    style.backgroundColor = "darkblue";
}, 1000);

//
document.body.append(element.element);
