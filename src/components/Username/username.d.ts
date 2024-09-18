import { CSSProperties, HTMLAttributes } from "react";
import { User, PrivateUser, PublicUser } from "@blacket/types";

export interface UsernameProps extends HTMLAttributes<HTMLSpanElement> {
    user: Partial<User | PrivateUser | PublicUser>;
    style?: CSSProperties;
}