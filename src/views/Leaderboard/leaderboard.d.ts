import { HTMLAttributes } from "react";
import { User } from "blacket-types";

export enum PlacementType {
    TOKEN = "tokens",
    EXPERIENCE = "experience"
}

export interface PlacementProps {
    type: PlacementType;
    placement: number;
    user: User;
}

export interface FilterButtonProps extends HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
}
