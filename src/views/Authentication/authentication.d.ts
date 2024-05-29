import { HTMLAttributes } from "react";

export enum AuthenticationType {
    LOGIN = 1,
    REGISTER = 2
}

export interface AuthenticationProps {
    type: AuthenticationType;
}

export interface AgreeHolderProps extends HTMLAttributes<HTMLDivElement> {
    checked: boolean;
}
