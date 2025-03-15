import { observe } from './Array';
import { getNode, reflectChildren } from './Reflect';

//
export default class Mp {
    #observable: any[];
    #fragments: DocumentFragment;

    //
    constructor(observable, mapCb) {
        //this.#observable = observable?.map?.(mapCb);
        this.#fragments = document.createDocumentFragment();
        reflectChildren(this.#fragments, this.#observable, mapCb);
    }

    //
    get element(): HTMLElement|DocumentFragment|Text {
        return this.#fragments;
    }
}
