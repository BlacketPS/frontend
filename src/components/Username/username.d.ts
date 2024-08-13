import { CSSProperties, HTMLAttributes } from "react";
import { PrivateUser, PublicUser } from "blacket-types";

export interface UsernameProps extends HTMLAttributes<HTMLSpanElement> {
    user: Partial<PrivateUser | PublicUser>;
    style?: CSSProperties;
}