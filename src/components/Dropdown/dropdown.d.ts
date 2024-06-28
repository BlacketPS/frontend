import { HTMLAttributes } from "react";

export interface Option {
    name: string;
    value: any;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    options: Option[];
    onPick: (value: any) => void;
}
