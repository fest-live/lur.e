//
export const H = (str: string)=>{
    const parser = new DOMParser();
    const doc    = parser.parseFromString(str, "text/html");
    if (doc.body.childNodes.length > 1) {
        const frag   = document.createDocumentFragment();
        frag.append(...doc.body.childNodes); return frag;
    }
    return doc.body.childNodes[0];
}

//
export default H;
