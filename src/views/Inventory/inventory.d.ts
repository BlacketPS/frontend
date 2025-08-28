import { HTMLAttributes } from "react";

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {
    name?: string;
    icon?: string;
}

export interface SellBlooksModalProps {
    blook: Blook;
    shiny: boolean;
}

export interface AuctionModalProps {
    type: AuctionTypeEnum;
    blook?: Blook;
    item?: Item;
    shiny?: boolean;
}