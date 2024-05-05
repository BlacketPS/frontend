import { GenericButtonProps } from "@components/Buttons/GenericButton/genericButton";
import { HTMLAttributes } from "react";

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
