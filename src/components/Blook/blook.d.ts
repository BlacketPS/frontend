import { HTMLAttributes } from "react";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    custom?: boolean;
    shiny?: boolean;
    big?: boolean;
    src: string;
    alt?: string;
    draggable?: boolean;
    className?: string;
}
