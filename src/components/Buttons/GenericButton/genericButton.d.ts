import { HTMLAttributes } from "react";

export interface GenericButtonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    backgroundColor?: string;
}
