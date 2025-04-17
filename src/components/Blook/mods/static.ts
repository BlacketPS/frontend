/* eslint-disable max-depth */

import BlookMod from "./BlookMod.ts";

export default class StaticMod extends BlookMod {
    constructor(data: any) {
        super(data);
    }
    apply(value: number, width: number, height: number) {
        const { ctx } = this;
        const noiseCanvas = new OffscreenCanvas(width, height);
        const noiseCtx = noiseCanvas.getContext("2d");
        const cellSize = 15; // Define cell size for noise granularity

        if (noiseCtx) {
            const imageData = noiseCtx.createImageData(width, height);
            const data = imageData.data;

            for (let y = 0; y < height; y += cellSize) {
                for (let x = 0; x < width; x += cellSize) {
                    const value = Math.random() * 255;
                    for (let dy = 0; dy < cellSize; dy++) {
                        for (let dx = 0; dx < cellSize; dx++) {
                            const index = ((y + dy) * width + (x + dx)) * 4;
                            if (index < data.length) {
                                data[index] = value; // Red
                                data[index + 1] = value; // Green
                                data[index + 2] = value; // Blue
                                data[index + 3] = 255; // Alpha
                            }
                        }
                    }
                }
            }

            noiseCtx.putImageData(imageData, 0, 0);

            const targetImageData = ctx.getImageData(0, 0, width, height);
            const targetData = targetImageData.data;

            const noiseImageData = noiseCtx.getImageData(0, 0, width, height);
            const noiseData = noiseImageData.data;

            for (let i = 0; i < targetData.length; i += 4) {
                const alpha = targetData[i + 3]; // Get the alpha value of the target pixel
                if (alpha >= 10) { // Only apply noise if opacity is 50% or more to avoid blending with transparent areas
                    targetData[i] = (targetData[i] * (1 - 0.2)) + (noiseData[i] * 0.2); // Blend Red
                    targetData[i + 1] = (targetData[i + 1] * (1 - 0.2)) + (noiseData[i + 1] * 0.2); // Blend Green
                    targetData[i + 2] = (targetData[i + 2] * (1 - 0.2)) + (noiseData[i + 2] * 0.2); // Blend Blue
                }
            }

            ctx.putImageData(targetImageData, 0, 0);
        }
    }
}
