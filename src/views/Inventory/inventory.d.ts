import { HTMLAttributes } from "react";

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {
    name?: string;
    icon?: string;
}
