// @ts-ignore
import { makeReactive, assign } from "fest/object";
import { defineElement, GLitElement, property } from "../src/extension/Glit";
import { css } from "../src/extension/Styles";

//
import { E } from "../src/lure/node/Bindings";
import { H } from "../src/lure/node/Syntax";

//
@defineElement("x-block")
export class XBlock extends GLitElement() {
    constructor(...args) { super(...args); }

    //
    @property({source: "attr"}) tetris = 1;
    @property() opacity = 1;

    //
    protected styles = function() {
        return css`:host {opacity: ${this.opacity}; display: block; }`;
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
        return this;
    }
}

//
const children = makeReactive(["Разруха!"]);//ref("!");
const style = makeReactive({
    backgroundColor: "darkred",
    color: "white",
    inlineSize: "100px",
    blockSize: "100px",
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    fontFamily: "\"Fira Code\"",
    fontSize: "0.8em"
});

// create document fragment
const dom = H`<${"x-block#test.test"} on:click=${()=>alert("Тетрис!")} style=${style}><span>${children}</span></div>`;

//
setTimeout(()=>{
    //children.value = "Разруха!";
    children[0] = "Движуха!";
    style.backgroundColor = "darkblue";
}, 1000);

//
document.body.append(dom);
