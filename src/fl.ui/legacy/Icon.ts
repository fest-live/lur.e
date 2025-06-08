// @ts-ignore
import styles from "@scss/foreign/fe-icon.scss?inline";

// @ts-ignore /* @vite-ignore */
import {importCdn} from "u2re/cdnImport";

// @ts-ignore /* @vite-ignore */
import { BLitElement, defineElement, E, H, property } from "u2re/lure";

// @ts-ignore /* @vite-ignore */
import { subscribe } from "u2re/object";

//
import { preloadStyle } from "../ext/core/Utils";

//
const rasterizeSVG = async (blob)=>{ return URL.createObjectURL(blob); }

//
const iconMap = new Map<string, Promise<string>>();
const loadAsImage = (name: string, creator?: (name: string)=>any)=>{
    if (iconMap.has(name)) { return iconMap.get(name); };

    //
    const element = creator ? creator(name) : null;
    const text = element.outerHTML, file = new Blob([`<?xml version=\"1.0\" encoding=\"UTF-8\"?>`, text], { type: "image/svg+xml" });
    const url = rasterizeSVG(file); iconMap.set(name, url);
    return url;
};

//
const styled  = preloadStyle(styles);
const marked  = H`<div class="fill"></div>`;

// @ts-ignore
@defineElement('ui-icon')
export class UILucideIcon extends BLitElement() {
    @property() protected iconElement?: SVGElement;
    @property({ source: "attr" }) icon?: string;
    @property({ source: "attr" }) width?: number;
    #options = { padding: 0, icon: "" };

    // also "display" may be "contents"
    public styles = ()  => styled.cloneNode(true);
    public render = (we)=> marked.cloneNode(true);
    public onRender() { this.icon = this.#options?.icon || this.icon; this.updateIcon(); subscribe([this.getProperty("icon"), "value"], (icon)=>{ this.updateIcon() }); }
    constructor(options = {icon: "", padding: ""}) { super(); Object.assign(this.#options, options); }

    //
    protected updateIcon(icon?: string) {
        // @ts-ignore
        if (icon ||= (this.icon?.value ?? (typeof this.icon == "string" ? this.icon : "")) || "");

        // @ts-ignore
        Promise.try(importCdn, ["/u2re/vendor/lucide.min.js"])?.then?.((icons)=>{
            const ICON = toCamelCase(icon || "");
            if (icons?.[ICON]) {
                const self = this as any;
                loadAsImage(ICON, (U)=>icons?.createElement?.(icons?.[U]))?.then?.((url)=>{
                    const src  = `url(\"${url}\")`;
                    const fill = self?.shadowRoot?.querySelector?.(".fill");
                    if (fill?.style?.getPropertyValue?.("mask-image") != src) {
                        fill?.style?.setProperty?.("mask-image", src);
                    }
                });
            }
        }).catch(console.warn.bind(console));
        return this;
    }

    //
    public firstUpdated() { this.updateIcon(); }
    public onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        E(self, { classList: new Set(["ui-icon", "u2-icon"]), inert: true });
        if (!self?.style.getPropertyValue("padding") && this.#options?.padding) { self.style.setProperty("padding", typeof this.#options?.padding == "number" ? (this.#options?.padding + "rem") : this.#options?.padding); };
        this.updateIcon();
    }
}

//
export default UILucideIcon;
