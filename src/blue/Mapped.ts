//import { elMap, reMap } from './DOM';
import { reformChildren } from './Reflect';

//
export class Mp {
    #observable: any[];
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;

    //
    constructor(observable, mapCb = (el)=>el) {
        this.#observable = observable;
        this.#mapCb = mapCb ?? ((el)=>el);
        this.#fragments = document.createDocumentFragment();
        this.#reMap = new WeakMap();
        //reflectChildren(this.#fragments, this.#observable = observable, this.#mapCb = mapCb);
    }

    //
    get element(): HTMLElement|DocumentFragment|Text|null {
        return reformChildren(this.#fragments as DocumentFragment, this.#observable, this.mapper);
    }

    //
    get children() {
        return this.#observable;//.map((...args)=>(reMap.get(args[0]) ?? elMap.get(args[0]) ?? this.#mapCb?.(...args) ?? args[0]));
    }

    //
    get mapper() {
        return (...args)=>{
            //this.#reMap
            if (typeof args?.[0] == "object" || typeof args?.[0] == "function") {
                if (this.#reMap.has(args?.[0])) return this.#reMap.get(args?.[0]);
                const re = this.#mapCb(...args); this.#reMap.set(args?.[0], re);
                return re;
            }
            return this.#mapCb(...args);
        }
    }

    //
    get ["@mapped"]() { return true; };
}

//
export const M = (observable, mapCb?)=>{
    return new Mp(observable, mapCb);
}

//
export default M;
