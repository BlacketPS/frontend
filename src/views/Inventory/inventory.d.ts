import { HTMLAttributes } from "react";

import { GenericButtonProps } from "@components/Buttons/GenericButton/genericButton";
import { AuctionTypeEnum, Blook, Item } from "@blacket/types";

export interface SearchOptions {
    query: string;
    rarity?: number;
    onlyDupes: boolean;
    onlyOwned: boolean;
}

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: Blook;
    locked: boolean;
    quantity: number;
}

export interface ChangeFilterModalProps {
    onSave: () => void;
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

export interface RightItemProps extends HTMLAttributes<HTMLDivElement> {
    item: Item;
    usesLeft: number;
}

export interface RightButtonProps extends GenericButtonProps {
    image?: string;
}

export interface SetHolderProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    icon?: string;
    nothing: boolean;
}

export interface TiledBackgroundProps {
    icon: string;
}

export interface SellBlooksModalProps {
    blook: Blook;
}

export interface AuctionModalProps {
    type: AuctionTypeEnum;
    blook?: Blook;
    item?: Item;
}
