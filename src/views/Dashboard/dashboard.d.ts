import { HTMLAttributes } from "react";
import { Blook } from "blacket-types";

export interface SmallButton {
    icon: string;
    text: string;
    link?: string;
    onlyMe?: boolean;
    onlyOther?: boolean;
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
}

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
    item: Item;
    usesLeft: number;
}
