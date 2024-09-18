import { PublicUser } from "@blacket/types";
import { HTMLAttributes } from "react";

export interface CreditUser {
    user: PublicUser;
    description: string;
}

export interface Credit extends CreditUser {
    user: string;
}

export interface CreditContainerProps extends HTMLAttributes<HTMLDivElement> {
    credit: CreditUser;
}

export interface CreditModalProps {
    credit: CreditUser;
}
