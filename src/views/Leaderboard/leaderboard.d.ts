import { PublicUser } from "blacket-types";
import { HTMLAttributes } from "react";

export interface LeaderboardUser extends PublicUser {
    id: string;
    username: string;
    titleId: string;
    color: string;
    tokens: number | null;
    experience: number | null;
    avatar: string;
    customAvatar: string | null;
}

export enum PlacementType {
    TOKEN = "tokens",
    EXPERIENCE = "experience"
}

export interface PlacementProps {
    type: PlacementType;
    placement: number;
    user: LeaderboardUser;
}

export interface FilterButtonProps extends HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
}
