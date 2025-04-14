import { canvas } from "@brender/index";
import { lerp as lerpFunction } from "@functions/core/mathematics";

import { BrenderCamera, BrenderEntity } from "..";

export const camera: BrenderCamera = {
    x: 0,
    y: 0,
    scale: 1 | 0,
    targetScale: 1 | 0,

    moveTo(x: number, y: number) {
        this.x = x | 0;
        this.y = y | 0;
    },

    moveBy(dx: number, dy: number) {
        this.x = (this.x + dx) | 0;
        this.y = (this.y + dy) | 0;
    },

    focusOn(entity: BrenderEntity, lerp = 1, deltaTime = 1 / 60) {
        const adjustedLerp = lerp * deltaTime * 60;

        this.x = lerpFunction(this.x, (entity.x - canvas.width / 2 / this.scale + (entity.width ?? entity?.image?.width ?? 0) / 2) | 0, adjustedLerp) | 0;
        this.y = lerpFunction(this.y, (entity.y - canvas.height / 2 / this.scale + (entity.height ?? entity?.image?.height ?? 0) / 2) | 0, adjustedLerp) | 0;
    },

    zoom(amount: number) {
        const oldScale = this.scale;

        this.targetScale = (this.targetScale + amount) | 0;
        this.targetScale = Math.max(0.1, this.targetScale) | 0;

        const centerX = (this.x + canvas.width / 2 / oldScale) | 0;
        const centerY = (this.y + canvas.height / 2 / oldScale) | 0;

        this.x = (centerX - canvas.width / 2 / this.targetScale) | 0;
        this.y = (centerY - canvas.height / 2 / this.targetScale) | 0;
    }
};
