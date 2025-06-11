import { HTMLAttributes } from "react";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    custom?: boolean;
    shiny?: boolean;
    src: string;
    alt?: string;
    draggable?: boolean;
    className?: string;
}

export interface InventoryBlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: Blook;
    shiny?: boolean;
    locked?: boolean;
    quantity?: number;
    selectable?: boolean;
    useVhStyles?: boolean;
}
