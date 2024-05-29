import { HTMLAttributes, ReactNode } from "react";

export interface ModalButtonContainerProps extends HTMLAttributes<HTMLDivElement> {
    loading?: boolean;
    children: ReactNode;
}
