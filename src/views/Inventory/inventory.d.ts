import { HTMLAttributes } from "react";

import { Item } from "@blacket/types";

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

export interface BoosterModalProps {
    booster: Item;
}
