import { HTMLAttributes } from "react";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    custom?: boolean;
    shiny?: boolean;
    src: string;
    alt?: string;
    draggable?: boolean;
    className?: string;
}

export interface BlookModData {
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
}
