import { defineElement, E, GLitElement, H, property } from "u2re/lure"

// @ts-ignore
import styles from "./ScrollFrame.scss?inline"
import { ScrollBar } from "../ext/scrollbar/Scrollbar";
import { loadInlineStyle, Q } from "u2re/dom";
import { appendChild } from '../../../../shared/u2re/lure/lure/utils/DOM';
import { computed } from "u2re-src/object.ts/src";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore
const styled  = loadInlineStyle(preInit, null, "ux-layer");

// @ts-ignore
@defineElement("ui-scrollframe")
export class ScrollBoxed extends GLitElement() {
    @property({source: "attr"}) anchor = "_";
    #x: any = null;
    #y: any = null;

    //
    constructor() { super(); }
    onInitialize() { //@ts-ignore
        super.onInitialize?.(); //@ts-ignore
        const content = this;//Q(`*[anchor-host=\"${this.getAttribute("anchor")}\"]`, this.parentNode || document.documentElement);
        this.#x = new ScrollBar({holder: this, scrollbar: Q(".ui-scrollbar[axis=\"x\"]", this.shadowRoot), content}, 0); // @ts-ignore
        this.#y = new ScrollBar({holder: this, scrollbar: Q(".ui-scrollbar[axis=\"y\"]", this.shadowRoot), content}, 1); // @ts-ignore
        //E(this, {style: { positionAnchor: computed(this.getProperty("anchor"), (n)=>"--"+n) }});
    }

    //
    bindWith(content: any) {
        const name = "--rand-" + Math.random().toString(36).slice(2); // @ts-ignore
        this.#x = new ScrollBar({holder: this, scrollbar: Q(".ui-scrollbar[axis=\"x\"]", this.shadowRoot), content}, 0); // @ts-ignore
        this.#y = new ScrollBar({holder: this, scrollbar: Q(".ui-scrollbar[axis=\"y\"]", this.shadowRoot), content}, 1); // @ts-ignore
        this.style.positionAnchor = name, content.style.anchorName = name;
    }

    //
    styles = () => styled?.cloneNode?.(true);
    render = () => H`
<slot></slot>
<div class="ui-scrollbar" axis="x"><div class="ui-thumb"></div></div>
<div class="ui-scrollbar" axis="y"><div class="ui-thumb"></div></div>`;
}

//
export default ScrollBoxed;
//div style="display: contents !important;"
