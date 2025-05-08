/* @vite-ignore */
import { ref } from "/externals/lib/object";

//
//import observableArray from "../src/blue/Array";
import E, { observeSize } from "../src/blue/Element";
import H from "../src/blue/HTML";

//
const children = ref("Движуха!");
const style = {backgroundColor: "black", color: "white", inlineSize: "100px", blockSize: "100px" };

//
const dStyle = { backgroundColor: "black", color: "white" };
const clone = E("div", { style: dStyle }, []);

// create document fragment
const dom = H`<div on:click=${()=>alert("Тетрис!")} style=${style}>${children}</div>`;
console.log(dom);

//
setTimeout(()=>{
    children.value = "Разруха!";
    style.backgroundColor = "darkblue";
}, 1000);

//
document.body.append(clone.element);
document.body.append(dom);
