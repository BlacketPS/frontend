import { HTMLAttributes } from "react";

export interface LabeledContainerProps extends HTMLAttributes<HTMLDivElement> {
    icon?: string;
    label?: string;
    children?: React.ReactNode;
}
