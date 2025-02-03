import { camera, canvas } from "@brender/index";

export const pressing: { [key: string]: boolean } = {};
export const mousePosition = { x: 0, y: 0 };

export const handleKeyDown = (e: KeyboardEvent) => pressing[e.key.toLowerCase()] = true;
export const handleKeyUp = (e: KeyboardEvent) => delete pressing[e.key.toLowerCase()];

export const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX - rect.left) / camera.scale + camera.x;
    const y = (e.clientY - rect.top) / camera.scale + camera.y;

    mousePosition.x = x;
    mousePosition.y = y;
};
