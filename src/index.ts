import { fabric } from 'fabric';

export interface FitViewOptions {
    padding?: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    maxZoom?: number;
    minZoom?: number;
}

interface ZoomOptions {
    zoomTo?: number;
    x?: number;
    y?: number;
}

export const fitView = (canvas: fabric.Canvas, options: FitViewOptions = {}) => {
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const vpCenter = canvas.getVpCenter();

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    canvas.getObjects().forEach(node => {
        const left = node.left!;
        const top = node.top!;
        if (minX > left) minX = left;
        if (minY > top) minY = top;
        if (maxX < left) maxX = left;
        if (maxY < top) maxY = top;
    });

    const virtualBoxWidth = maxX - minX;
    const virtualBoxHeight = maxY - minY;
    const virtualBoxCenter = {
        x: minX + (virtualBoxWidth / 2),
        y: minY + (virtualBoxHeight / 2),
    };

    const translateX = vpCenter.x - virtualBoxCenter.x;
    const translateY = vpCenter.y - virtualBoxCenter.y;

    const w = (canvasWidth - (options.padding?.left || 0) - (options.padding?.right || 0)) / virtualBoxWidth;
    const h = (canvasHeight - (options.padding?.top || 0) - (options.padding?.bottom || 0)) / virtualBoxHeight;

    let ratio = Math.min(w, h);

    if (options.maxZoom && ratio > options.maxZoom) {
        ratio = options.maxZoom;
    } else if (options.minZoom && ratio < options.minZoom) {
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

const zoomCanvas = (canvas: fabric.Canvas, options: ZoomOptions) => {
    let pointX = canvas.getVpCenter().x;
    let pointY = canvas.getVpCenter().y;

    let zoom = options.zoomTo || 1;

    canvas.zoomToPoint(
        {
            x: options.x ? options.x : pointX,
            y: options.y ? options.y : pointY,
        },
        zoom,
    );
}