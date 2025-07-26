import { HTMLAttributes } from "react";
import { PrivateUser, Rarity, UserBlook, UserItem } from "@blacket/types";

export interface ItemContainerOptions {
    showItems?: boolean;
    showBlooks?: boolean;
    showShiny?: boolean;
    showLocked?: boolean;
    showPacks?: boolean;
    onlyRarity?: Rarity;
}

export enum SelectedTypeEnum {
    BLOOK,
    ITEM
}

export interface ItemClickEvent {
    type: SelectedTypeEnum;
    item?: UserBlook | UserItem | null;
}

export interface ItemContainerProps extends HTMLAttributes<HTMLDivElement> {
    user: PrivateUser;
    options?: ItemContainerOptions;
    onClick?: (item: ItemClickEvent) => void;
}
