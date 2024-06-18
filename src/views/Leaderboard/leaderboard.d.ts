import { HTMLAttributes } from "react";
import { User } from "blacket-types";

export enum PlacementType {
    TOKEN = "tokens",
    EXPERIENCE = "experience"
}

export interface BigPlacementProps {
    type: PlacementType;
    placement: 1 | 2 | 3;
    user: User;
}

export interface LittlePlacementProps {
    type: PlacementType;
    placement: number;
    user: User;
}

export interface FilterButtonProps extends HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
}
