import { HTMLAttributes } from "react";

import { GenericButtonProps } from "@components/Buttons/GenericButton/genericButton";
import { Blook, Item } from "blacket-types";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: Blook;
    locked: boolean;
    quantity: number;
}

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    item: Item;
    usesLeft: number;
}

export interface RightBlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: Blook;
    owned: number;
    noBlooksOwned: boolean;
}

export interface RightButtonProps extends GenericButtonProps { }

export interface SetHolderProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    nothing: boolean;
}

export interface SellBlooksModalProps {
    blook: Blook;
}
