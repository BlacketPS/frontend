import { layerCanvases, getWidth, getHeight } from "@brender/index";

export const getLayerCtx = (z: number): OffscreenCanvasRenderingContext2D => {
    if (!layerCanvases[z]) {
        layerCanvases[z] = new OffscreenCanvas(getWidth(), getHeight());
    }

    const canvas = layerCanvases[z];
    const ctx = canvas.getContext("2d");

    return ctx!;
};
