import { BlookModData } from "../blook.d";

export default class BlookMod {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;

    constructor(data: BlookModData) {
        this.canvas = data.canvas;
        this.ctx = data.ctx;
    }
}
