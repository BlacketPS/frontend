import { handleKeyDown, handleKeyUp, handleMouseMove } from "@brender/index";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export let imageCanvas: OffscreenCanvas;
export let imageCtx: OffscreenCanvasRenderingContext2D;

export let textCanvas: OffscreenCanvas;
export let textCtx: OffscreenCanvasRenderingContext2D;

export function _setCanvas(c: HTMLCanvasElement) {
    canvas = c;
    ctx = c.getContext("2d")!;

    imageCanvas = new OffscreenCanvas(0, 0);
    imageCtx = imageCanvas.getContext("2d")!;
    imageCanvas.width = canvas.width;
    imageCanvas.height = canvas.height;

    textCanvas = new OffscreenCanvas(0, 0);
    textCtx = textCanvas.getContext("2d")!;
    textCanvas.width = canvas.width;
    textCanvas.height = canvas.height;

    canvas.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);
}

export const getWidth = () => canvas.width ?? 0;
export const getHeight = () => canvas.height ?? 0;

export * from "./frame";
