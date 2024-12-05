import { HTMLAttributes } from "react";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    shiny?: boolean;
    src: string;
    alt?: string;
    draggable?: boolean;
    className?: string;
}

export interface Sparkle {
    x: number;
    y: number;
}
