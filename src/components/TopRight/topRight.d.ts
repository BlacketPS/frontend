import { User } from "blacket-types";

export enum TopRightContent {
    TOKENS = "tokens"
}

export interface TopRightProps {
    content: string[TopRightContent];
}

export interface TokenBalanceProps {
    user: User;
}

export interface UserDropdownProps {
    user: User;
}
