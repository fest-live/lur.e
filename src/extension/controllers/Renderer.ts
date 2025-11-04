import { RAFBehavior } from "fest/dom";

//
export const makeRenderer = () => {
    const canvas = document.createElement("canvas");
    const fallback = document.createElement("div");
    canvas.width = 1;
    canvas.height = 1;

    //
    canvas.classList.add("u2-renderer");
    canvas.classList.add("u2-implement");
    fallback.classList.add("u2-fallback");
    fallback.classList.add("u2-renderer");

    //
    fallback.style.inlineSize = "stretch";
    fallback.style.blockSize = "stretch";
    fallback.style.contain = "layout paint";
    //fallback.style.containerType = "size";
    fallback.style.containIntrinsicInlineSize = "1px";
    fallback.style.containIntrinsicBlockSize = "1px";
    fallback.style.maxInlineSize = "min(100cqi, 100dvi)";
    fallback.style.maxBlockSize = "min(100cqb, 100dvb)";
    fallback.style.pointerEvents = "auto";

    //
    //return fallback;

    //
    canvas.style.inlineSize = "stretch";
    canvas.style.blockSize = "stretch";
    canvas.style.objectFit = "contain";
    canvas.style.objectPosition = "center";
    canvas.style.imageRendering = "auto";
    canvas.style.imageRendering = "optimizeQuality";
    canvas.style.imageRendering = "smooth";
    canvas.style.imageRendering = "high-quality";
    canvas.style.contain = "layout paint";
    //canvas.style.containerType = "size";
    canvas.style.containIntrinsicInlineSize = "1px";
    canvas.style.containIntrinsicBlockSize = "1px";
    canvas.style.maxInlineSize = "min(100cqi, 100dvi)";
    canvas.style.maxBlockSize = "min(100cqb, 100dvb)";
    canvas.style.pointerEvents = "auto";

    // @ts-ignore
    canvas.layoutsubtree = true;
    canvas.setAttribute("layoutsubtree", "true");

    //\
    const ctx = canvas?.getContext?.("2d") as CanvasRenderingContext2D | null;
    if (!ctx) { return fallback; }

    //
    if ((ctx as any)?.drawElement == null && (ctx as any)?.drawElementImage == null) {
        return fallback;
    }

    //
    const drawElementAct = (ctx as any)?.drawElementImage != null ? (ctx as any)?.drawElementImage?.bind?.(ctx) : (ctx as any)?.drawElement?.bind?.(ctx);
    if (drawElementAct == null) {
        return fallback;
    }

    //
    const makeInteractive = (element?: HTMLElement)=>{
        const drawElement = element ?? (canvas.children?.[0] as HTMLElement);
        if (drawElement == null) return;

        //
        try {
            (ctx as any).setHitTestRegions([{
                element: drawElement,
                rect: {
                    x: 0,
                    y: 0,
                    width: drawElement?.offsetWidth * devicePixelRatio,
                    height: drawElement?.offsetHeight * devicePixelRatio
                }
            }]);
        } catch(e) {
            console.warn(e);
        }
    }

    //
    const rafDebounce = RAFBehavior();
    const doRender = () => {
        const drawElement = canvas.children?.[0];
        if (drawElementAct == null || drawElement == null || !canvas.checkVisibility() || canvas.dataset.dragging != null || canvas.closest?.("[data-dragging]") != null) return;

        //
        ctx.reset();
        ctx.save();
        ctx.scale(devicePixelRatio || 1, devicePixelRatio || 1);
        try { drawElementAct(drawElement, 0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio); } catch(e) { console.warn(e); }
        makeInteractive();
        ctx.restore();
    }

    //https://localhost/#task2
    const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries.find((entry) => entry.target === canvas);
        const newWidth  = Math.min(entry?.devicePixelContentBoxSize?.[0]?.inlineSize || canvas.width, (canvas?.offsetParent || document.documentElement)?.clientWidth * devicePixelRatio);
        const newHeight = Math.min(entry?.devicePixelContentBoxSize?.[0]?.blockSize || canvas.height, (canvas?.offsetParent || document.documentElement)?.clientHeight * devicePixelRatio);

        //
        if (newWidth != canvas.width) { canvas.width = newWidth; };
        if (newHeight != canvas.height) { canvas.height = newHeight; };
        if (newWidth != canvas.width || newHeight != canvas.height) { rafDebounce(doRender); };
        //
    });

    //
    requestAnimationFrame(()=>{ // @ts-ignore
        resizeObserver.observe(canvas, {box: ['device-pixel-content-box'], fireOnEveryPaint: true});
    });

    //
    (async ()=>{
        while (true) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            if (canvas.checkVisibility() && canvas.dataset.dragging == null && canvas.closest?.("[data-dragging]") == null) {
                doRender();
            }
        }
    })();

    //
    return canvas;
}
