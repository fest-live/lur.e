import { reflectChildren } from './Reflect';

//
export class Mp {
    #observable: any[];
    #fragments: DocumentFragment;

    //
    constructor(observable, mapCb) {
        this.#fragments = document.createDocumentFragment();
        reflectChildren(this.#fragments, this.#observable = observable, mapCb);
    }

    //
    get element(): HTMLElement|DocumentFragment|Text {
        return this.#fragments as DocumentFragment;
    }
}

//
export const M = (observable, mapCb)=>{
    return new Mp(observable, mapCb);
}

//
export default M;
