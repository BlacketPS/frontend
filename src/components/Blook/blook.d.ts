import { HTMLAttributes } from "react";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    custom?: boolean;
    shiny?: boolean;
    shinySparkles?: boolean;
    src: string;
    alt?: string;
    draggable?: boolean;
    className?: string;
}

export interface Sparkle {
    x: number;
    y: number;
}
