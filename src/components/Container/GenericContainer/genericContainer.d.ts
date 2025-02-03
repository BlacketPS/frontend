import { HTMLAttributes } from "react";

export interface GenericContainerProps extends HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}
