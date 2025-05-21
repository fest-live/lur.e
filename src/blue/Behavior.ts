export const boundBehaviors = new WeakMap();

// currently, behaviors not triggers when initialized
export const bindBehavior = (element, behSet, behavior)=>{
    const weak = new WeakRef(element);
    if (!behSet.has(behavior)) { behSet.add(behavior); }
    return element;
}

// behavior ([value, prop, old], [element, store, storeSets])=>{}
export const reflectBehaviors = (element, behaviors)=>{
    if (!element) return;
    if (behaviors) {
        const behSet = boundBehaviors.get(element) ?? new Set();
        if (!boundBehaviors.has(element)) { boundBehaviors.set(element, behSet); }
        [...(behaviors?.values?.() || [])].map((e)=>bindBehavior(element, behSet, e));
    }
    return element;
}
