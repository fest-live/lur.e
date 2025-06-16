export const makeDragEvents = (newItem, {layout, dragging, currentCell}, {item, list, items})=>{ // @ts-ignore
    const { setProperty, redirectCell, getBoundingOrientRect, orientOf, convertOrientPxToCX, doAnimate } = await Promise.try(importCdn, ["u2re/dom"]);

    //
    newItem.addEventListener("m-dragstart", (ev)=>{
        const gridSystem = newItem?.parentElement;
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel : [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        //
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];

        //
        const args = {layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        const CXa  = convertOrientPxToCX(rel, args, orientOf(gridSystem));
        const cell = redirectCell([Math.floor(CXa[0]), Math.floor(CXa[1])], args);

        //
        try { dragging[0].value = 0, dragging[1].value = 0; } catch(e){};
        if (ev?.detail?.holding?.modified != null) { ev.detail.holding.modified[0] = 0, ev.detail.holding.modified[1] = 0; }
        if (currentCell[0].value != cell[0]) { try { currentCell[0].value = cell[0]; } catch(e){}; };
        if (currentCell[1].value != cell[1]) { try { currentCell[1].value = cell[1]; } catch(e){}; };
        newItem.dataset.dragging = "";

        //
        setProperty(newItem, "--p-cell-x", newItem.style.getPropertyValue("--cell-x") || 0);
        setProperty(newItem, "--p-cell-y", newItem.style.getPropertyValue("--cell-y") || 0);
    });

    //
    newItem.addEventListener("m-dragend", async (ev)=>{
        // TOOD: detect another grid system
        const gridSystem = newItem?.parentElement;
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect?.(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel : [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        //
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];

        //
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        const CXa  = convertOrientPxToCX(rel, args, orientOf(gridSystem));
        const clamped = [
            Math.max(Math.min(Math.floor(CXa[0]), layout[0]-1), 0),
            Math.max(Math.min(Math.floor(CXa[1]), layout[1]-1), 0)
        ];

        //
        if (ev?.detail?.holding?.modified != null) { ev.detail.holding.modified[0] = 0, ev.detail.holding.modified[1] = 0; }; const cell = redirectCell(clamped, args);
        doAnimate(newItem, cell[0], "x", true)?.then?.(()=>{if (currentCell[0].value != cell[0]) { try { currentCell[0].value = cell[0]; } catch(e) {}}; }); try { dragging[0].value = 0; } catch(e) {};
        doAnimate(newItem, cell[1], "y", true)?.then?.(()=>{if (currentCell[1].value != cell[1]) { try { currentCell[1].value = cell[1]; } catch(e) {}}; }); try { dragging[1].value = 0; } catch(e) {};
        delete newItem.dataset.dragging;
    });
};
