import { HTMLAttributes } from "react";

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
    image?: string;
    motionless?: boolean;
    message?: string;
    className?: string;
}
