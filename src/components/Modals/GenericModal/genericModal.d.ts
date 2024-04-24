import { HTMLAttributes, ReactNode } from "react";

export interface GenericModalProps extends HTMLAttributes<HTMLDivElement> {
    closing?: boolean;
    noAnimation?: boolean;
    children: ReactNode;
}
