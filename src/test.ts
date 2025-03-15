import observableArray from "./blue/Array";
import El from "./blue/Element";
import { makeReactive } from "./lib/object";

//
const children = observableArray(["Движуха!"]);
const element = new El("div", {style: {backgroundColor: "black", inlineSize: "100px", blockSize: "100px", color: "white"}}, children);

//
setTimeout(()=>{
    children[0] = "Разруха!";
}, 1000);

//
document.body.append(element.element);
