import { PrivateUser } from "blacket-types";

export enum TopRightContent {
    TOKENS = "tokens",
    EXPERIENCE = "experience"
}

export interface TopRightProps {
    content: string[TopRightContent];
}

export interface BalanceProps {
    user: PrivateUser;
}

export interface UserDropdownProps {
    user: PrivateUser;
}
