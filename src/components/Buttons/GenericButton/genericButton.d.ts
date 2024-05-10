import { HTMLAttributes } from "react";

export interface GenericButtonProps extends HTMLAttributes<HTMLDivElement | HTMLAnchorElement> {
    to?: string;
    icon?: string;
    className?: string;
    backgroundColor?: string;
}
