import { HTMLAttributes } from "react";

export interface GenericButtonProps extends HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    to?: string;
    icon?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
    backgroundColor?: string;
    useVhStyles?: boolean;
}
