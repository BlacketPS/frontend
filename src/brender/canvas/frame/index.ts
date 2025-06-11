import { canvas, ctx, layerCanvases, camera, objects, entities, deletionQueue } from "@brender/index";
import { lerp } from "@functions/core/mathematics";

import { objectLoop } from "./objectLoop";
import { entityLoop } from "./entityLoop";

export let animationFrameId: number | null = null;
export let lastTime: number = 0;
export let frameRate: number = 0;
export const targetFrameRate = 60;

export const start = () => {
    window.addEventListener("resize", handleResize);
    handleResize();

    animationFrameId = requestAnimationFrame(frame);
};

export const stop = () => {
    window.removeEventListener("resize", handleResize);
    if (!animationFrameId) return;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
};

const handleResize = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    for (const layer in layerCanvases) {
        const layerCanvas = layerCanvases[layer];
        if (!layerCanvas) continue;

        layerCanvas.width = canvas.width;
        layerCanvas.height = canvas.height;
    }
};

const clearLayerCanvases = () => {
    for (const layer in layerCanvases) {
        const layerCanvas = layerCanvases[layer];
        if (!layerCanvas) continue;

        const layerCtx = layerCanvas.getContext("2d");
        if (layerCtx) layerCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
    }
};

let previousLength = 0;
let sortedLayers: number[] = [];

const updateSortedLayers = () => {
    const currentLength = Object.keys(layerCanvases).length;

    if (currentLength !== previousLength) {
        sortedLayers = Object.keys(layerCanvases)
            .map(Number)
            .sort((a, b) => a - b);
        previousLength = currentLength;
    }
};

const clearDeletionQueue = () => {
    for (const object of deletionQueue) {
        const index = objects.indexOf(object);
        if (index !== -1) objects.splice(index, 1);

        const deletionIndex = deletionQueue.indexOf(object);
        if (deletionIndex !== -1) deletionQueue.splice(deletionIndex, 1);
    }
};

export const frame = (time: number) => {
    clearDeletionQueue();

    if (camera.scale !== camera.targetScale) camera.scale = lerp(camera.scale, camera.targetScale ?? 1, .2);

    const deltaTime = Math.min(1000 / 60, time - lastTime) / 1000 * targetFrameRate;

    frameRate = Math.round(1000 / deltaTime);
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const object of objects) objectLoop(object, deltaTime);
    for (const entity of entities) entityLoop(entity, deltaTime);

    updateSortedLayers();

    for (const layer of sortedLayers) {
        const layerCanvas = layerCanvases[layer];
        if (!layerCanvas) continue;

        ctx.drawImage(layerCanvas, 0, 0);
    }

    clearLayerCanvases();

    animationFrameId = requestAnimationFrame(frame);
};
