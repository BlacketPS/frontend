import { canvas, camera } from "@brender/index";

export const isOnScreen = (x: number, y: number, w: number, h: number) => (
    x + w >= camera.x &&
    x <= camera.x + canvas!.width / camera.scale &&
    y + h >= camera.y &&
    y <= camera.y + canvas!.height / camera.scale
);
