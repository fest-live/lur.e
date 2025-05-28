import E from "../src/lure/Element";
import { css, defineElement, GLitElement, property } from "../src/lure/Glit";
import { H } from "../src/lure/Syntax";

// @ts-ignore /* @vite-ignore */
import { ref, makeReactive, assign } from "/externals/modules/object.js";

//
@defineElement("x-block")
export class XBlock extends GLitElement() {
    constructor(...args) { super(...args); }

    //
    @property({source: "attr"}) tetris = 1;
    @property() opacity = 1;

    //
    protected styles = function() {
        return css`:host {opacity: ${this.opacity};}`;
    }

    //
    protected render() {
        assign(this.opacity, this.tetris);
        E(this, { style: {display: "block"}, dataset: {tetris: this.tetris} }, []);
        return H`<slot>`;
    }

    //
    protected onInitialize(): any {
        super.onInitialize?.();
        console.log(this.tetris);
        return this;
    }
}

//
const children = ref("Движуха!");
const style = makeReactive({backgroundColor: "black", color: "white", inlineSize: "100px", blockSize: "100px" });

//
const dStyle = makeReactive({ backgroundColor: "darkred", color: "white" });

// create document fragment
const dom = H`<${"x-block#test.test"} on:click=${()=>alert("Тетрис!")} style=${style}><span style=${dStyle}>${children}</span></div>`;

//
setTimeout(()=>{
    children.value = "Разруха!";
    dStyle.backgroundColor = "darkblue";
}, 1000);

//
document.body.append(dom);
