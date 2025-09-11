import { HTMLAttributes } from "react";
import { Blook } from "@blacket/types";

export interface StatButtonProps extends HTMLAttributes<HTMLDivElement> {
    icon: string;
    backgroundColor?: string;
    onClick?: () => void;
}

export interface LookupUserModalProps {
    onClick: (username: string) => Promise<void>;
}

export interface StatContainerProps {
    title: string;
    icon: string;
    value: any;
}

export interface LevelContainerProps {
    experience: number;
}

export interface SmallButtonProps extends HTMLAttributes<HTMLDivElement> {
    icon: string;
    onClick?: () => void;
}

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: Blook;
    quantity: number;
    shiny?: boolean;
}

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    item: Item;
    usesLeft: number;
}

export interface CosmeticsModalProps {
    category: CosmeticsModalCategory;
}

export enum CosmeticsModalCategory {
    AVATAR,
    BANNER,
    TITLE,
    FONT,
    COLOR,
    GRADIENT
}

export interface DailyRewardsModalProps {
    amount: number;
}
