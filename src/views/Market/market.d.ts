import { HTMLAttributes } from "react";
import { DataBoostersEntity, ItemShop, MarketOpenPackDto, Pack, RarityAnimationType, UserBlook } from "@blacket/types";

export enum BigButtonClickType {
    OPEN = 1,
    CLOSE = 2,
    NONE = 3
}

export interface SearchOptions {
    query: string;
    onlyPurchasable: boolean;
}

export interface CategoryProps extends HTMLAttributes<HTMLDivElement> {
    header: string;
    internalName: string;
}

export interface PackProps extends HTMLAttributes<HTMLDivElement> {
    pack: Pack;
}

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    itemShop: ItemShop;
}

export interface OpenPackModalProps {
    pack: Pack;
    userTokens: number;
    onYesButton: (dto: MarketOpenPackDto) => Promise;
}

export interface OpenPackContainerProps {
    opening: boolean;
    image: string;
    animationType: RarityAnimationType;
}

export interface OpenPackBlookProps {
    userBlook: UserBlook;
    animate: boolean;
    isNew: boolean;
}

export interface BoosterContainerProps {
    boosters?: DataBoostersEntity | null;
}

export interface TimeRemainingStrings {
    global: {
        chance?: string;
        shiny?: string;
    }
    personal: {
        chance?: string;
        shiny?: string;
    }
}
