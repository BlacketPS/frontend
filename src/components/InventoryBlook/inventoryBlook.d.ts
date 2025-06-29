import { HTMLAttributes } from "react";
import { Blook } from "@blacket/types";

export interface InventoryBlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: Blook;
    shiny?: boolean;
    locked?: boolean;
    quantity?: number;
    selectable?: boolean;
    useVhStyles?: boolean;
}
