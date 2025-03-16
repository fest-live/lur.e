import { elMap, reMap } from './DOM';
import { reflectChildren } from './Reflect';

//
export class Mp {
    #observable: any[];
    #fragments: DocumentFragment;
    #mapCb: any;

    //
    constructor(observable, mapCb) {
        this.#fragments = document.createDocumentFragment();
        reflectChildren(this.#fragments, this.#observable = observable, this.#mapCb = mapCb);
    }

    //
    get element(): HTMLElement|DocumentFragment|Text {
        return this.#fragments as DocumentFragment;
    }

    //
    get children() {
        return this.#observable?.map?.((...args)=>(reMap.get(args[0]) ?? elMap.get(args[0]) ?? this.#mapCb?.(...args) ?? args[0]));
    }
}

//
export const M = (observable, mapCb)=>{
    return ()=>(new Mp(observable, mapCb));
}

//
export default M;
