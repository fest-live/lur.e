export class WithOverlayScrollbar extends HTMLDivElement {

    constructor() {
        super();
        this.classList.add('with-overlay-scrollbar');
    }

    connectedCallback() {
        const frame = document.createElement("ui-scrollframe");
        frame?.bindWith?.(this);

        //
        this.style.scrollbarGutter = "auto";
        this.style.scrollbarWidth = "none";
        this.style.scrollbarColor = "transparent transparent";
        this.style.overflow = "scroll";

        //
        this.parentNode?.append(frame);
    }

    disconnateCallback() {

    }

}

//
customElements.define('overlay-scrollbar', WithOverlayScrollbar, {extends: 'div'});

//
export default WithOverlayScrollbar;
