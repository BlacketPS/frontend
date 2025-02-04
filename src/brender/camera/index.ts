import { canvas } from "@brender/index";
import { lerp as lerpFunction } from "@functions/core/mathematics";

import { BrenderCamera, BrenderEntity } from "..";

export const camera: BrenderCamera = {
    x: 0,
    y: 0,
    scale: 1,
    targetScale: 1,

    moveTo(x: number, y: number) {
        this.x = x;
        this.y = y;
    },

    moveBy(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    },

    focusOn(entity: BrenderEntity, lerp = 1) {
        // this.x = Math.floor(entity.x - canvas.width / 2 / this.scale + (entity.width ?? entity?.image?.width ?? 0) / 2);
        // this.y = Math.floor(entity.y - canvas.height / 2 / this.scale + (entity.height ?? entity?.image?.height ?? 0) / 2);
        this.x = lerpFunction(this.x, entity.x - canvas.width / 2 / this.scale + (entity.width ?? entity?.image?.width ?? 0) / 2, lerp);
        this.y = lerpFunction(this.y, entity.y - canvas.height / 2 / this.scale + (entity.height ?? entity?.image?.height ?? 0) / 2, lerp);
    },

    zoom(amount: number) {
        const oldScale = this.scale;

        this.targetScale += amount;
        this.targetScale = Math.max(0.1, this.targetScale);

        const centerX = this.x + canvas.width / 2 / oldScale;
        const centerY = this.y + canvas.height / 2 / oldScale;

        this.x = centerX - canvas.width / 2 / this.targetScale;
        this.y = centerY - canvas.height / 2 / this.targetScale;
    }
};
