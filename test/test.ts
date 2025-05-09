/* @vite-ignore */
import { ref, makeReactive } from "/externals/lib/object";

//
//import observableArray from "../src/blue/Array";
import H from "../src/blue/HTML";

//
const children = ref("Движуха!");
const style = makeReactive({backgroundColor: "black", color: "white", inlineSize: "100px", blockSize: "100px" });

//
const dStyle = makeReactive({ backgroundColor: "darkred", color: "white" });

// create document fragment
const dom = H`<${"div#test.test"} on:click=${()=>alert("Тетрис!")} style=${style}><span style=${dStyle}>${children}</span></div>`;

//
setTimeout(()=>{
    children.value = "Разруха!";
    dStyle.backgroundColor = "darkblue";
}, 1000);

//
document.body.append(dom);
