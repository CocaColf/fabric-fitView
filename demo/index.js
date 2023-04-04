const fitView = (canvas, options = {}) => {
    var _a, _b, _c, _d;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const vpCenter = canvas.getVpCenter();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    canvas.getObjects().forEach(node => {
        const left = node.left;
        const top = node.top;
        if (minX > left)
            minX = left;
        if (minY > top)
            minY = top;
        if (maxX < left)
            maxX = left;
        if (maxY < top)
            maxY = top;
    });
    const virtualBoxWidth = maxX - minX;
    const virtualBoxHeight = maxY - minY;
    const virtualBoxCenter = {
        x: minX + (virtualBoxWidth / 2),
        y: minY + (virtualBoxHeight / 2),
    };
    const translateX = vpCenter.x - virtualBoxCenter.x;
    const translateY = vpCenter.y - virtualBoxCenter.y;
    const w = (canvasWidth - (((_a = options.padding) === null || _a === void 0 ? void 0 : _a.left) || 0) - (((_b = options.padding) === null || _b === void 0 ? void 0 : _b.right) || 0)) / virtualBoxWidth;
    const h = (canvasHeight - (((_c = options.padding) === null || _c === void 0 ? void 0 : _c.top) || 0) - (((_d = options.padding) === null || _d === void 0 ? void 0 : _d.bottom) || 0)) / virtualBoxHeight;
    let ratio = Math.min(w, h);
    if (options.maxZoom && ratio > options.maxZoom) {
        ratio = options.maxZoom;
    }
    else if (options.minZoom && ratio < options.minZoom) {
        ratio = options.minZoom;
    }
    if (canvas.viewportTransform) {
        let vpt = canvas.viewportTransform;
        vpt[4] += translateX;
        vpt[5] += translateY;
        canvas.setViewportTransform(vpt);
    }
    zoomCanvas(canvas, {
        zoomTo: ratio,
        x: vpCenter.x,
        y: vpCenter.y,
    });
};
const zoomCanvas = (canvas, options) => {
    let pointX = canvas.getVpCenter().x;
    let pointY = canvas.getVpCenter().y;
    let zoom = options.zoomTo || 1;
    canvas.zoomToPoint({
        x: options.x ? options.x : pointX,
        y: options.y ? options.y : pointY,
    }, zoom);
};
