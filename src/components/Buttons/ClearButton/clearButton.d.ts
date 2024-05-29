import { HTMLAttributes } from "react";

export interface ClearButtonProps extends HTMLAttributes<HTMLDivElement | HTMLAnchorElement> {
    to?: string;
    className?: string;
}
