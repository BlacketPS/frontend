import { HTMLAttributes } from "react";

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
    image?: string;
    motionless?: boolean;
    noModal?: boolean;
    message?: string;
    className?: string;
}
