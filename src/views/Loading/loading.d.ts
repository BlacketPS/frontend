import { HTMLAttributes } from "react";

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
    error?: boolean;
}