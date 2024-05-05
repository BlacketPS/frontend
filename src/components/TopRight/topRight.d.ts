import { PublicUser } from "blacket-types";

export enum TopRightContent {
    TOKENS = "tokens"
}

export interface TopRightProps {
    content: string[TopRightContent];
}

export interface TokenBalanceProps {
    user: PublicUser
}

export interface UserDropdownProps {
    user: PublicUser
}
