import { canvas } from "@brender/index";

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

    focusOn(entity: BrenderEntity) {
        this.x = Math.floor(entity.x - canvas.width / 2 / this.scale + (entity.width ?? entity?.image?.width ?? 0) / 2);
        this.y = Math.floor(entity.y - canvas.height / 2 / this.scale + (entity.height ?? entity?.image?.height ?? 0) / 2);
    },

    zoom(amount: number) {
        this.targetScale += amount;
        this.targetScale = Math.max(.1, this.targetScale);
    }
};
