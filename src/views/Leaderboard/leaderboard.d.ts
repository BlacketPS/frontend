import { HTMLAttributes } from "react";
import { PublicUser } from "@blacket/types";

export enum PlacementType {
    TOKEN = "tokens",
    EXPERIENCE = "experience"
}

export interface BigPlacementProps {
    type: PlacementType;
    placement: 1 | 2 | 3;
    user: PublicUser;
}

export interface LittlePlacementProps {
    type: PlacementType;
    placement: number;
    user: PublicUser;
}

export interface FilterButtonProps extends HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
}
