import { HTMLAttributes } from "react";

export enum SelectedTypeEnum {
    BLOOK,
    ITEM
}

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {
    name?: string;
    icon?: string;
}