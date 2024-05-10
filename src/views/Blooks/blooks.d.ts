import { HTMLAttributes } from "react";

import { GenericButtonProps } from "@components/Buttons/GenericButton/genericButton";
import { Blook } from "blacket-types";

export interface BlookProps extends HTMLAttributes<HTMLDivElement> {
    blook: any;
    locked: boolean;
    quantity: number;
}

export interface RightBlookProps {
    blook: any;
    owned: boolean;
    noBlooksOwned: boolean;
}

export interface RightButtonProps extends GenericButtonProps { }

export interface SetHolderProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
}

export interface SellBlooksModalProps {
    blook: Blook;
}
