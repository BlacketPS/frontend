import { HTMLAttributes } from "react";

export interface InventoryBlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: UserBlook;
    shiny?: boolean;
    big?: boolean;
    locked?: boolean;
    amount?: number;
    selectable?: boolean;
    useVhStyles?: boolean;
}
