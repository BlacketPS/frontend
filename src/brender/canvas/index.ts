import { handleKeyDown, handleKeyUp, handleMouseMove } from "@brender/index";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export const layerCanvases: Record<number, OffscreenCanvas> = {};

export function _setCanvas(c: HTMLCanvasElement) {
    canvas = c;
    ctx = c.getContext("2d")!;

    canvas.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);
}

export const getCanvas = () => canvas;

export const getWidth = () => canvas.width ?? 0;
export const getHeight = () => canvas.height ?? 0;

export * from "./frame";
