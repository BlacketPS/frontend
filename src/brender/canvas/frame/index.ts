import { canvas, ctx, imageCanvas, imageCtx, textCanvas, textCtx, camera, objects, entities } from "@brender/index";
import { lerp } from "@functions/core/mathematics";

import { objectLoop } from "./objectLoop";
import { entityLoop } from "./entityLoop";

export let animationFrameId: number | null = null;
export let lastTime: number = 0;
export let frameRate: number = 0;

export const start = () => {
    animationFrameId = requestAnimationFrame(frame);
};

export const stop = () => {
    if (!animationFrameId) return;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
};

export const frame = (time: number) => {
    if (camera.scale !== camera.targetScale) camera.scale = lerp(camera.scale, camera.targetScale ?? 1, .2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = (time - lastTime) / 8.33;
    frameRate = Math.round(1000 / (time - lastTime));
    lastTime = time;

    ctx.drawImage(imageCanvas, 0, 0);
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    ctx.drawImage(textCanvas, 0, 0);
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

    for (const object of objects) objectLoop(object, deltaTime);
    for (const entity of entities) entityLoop(entity, deltaTime);

    animationFrameId = requestAnimationFrame(frame);
};
