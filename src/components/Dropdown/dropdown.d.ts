import { HTMLAttributes } from "react";

export interface Option {
    label: string;
    value: any;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    search?: {
        enabled: boolean;
        placeholder: string;
    }
    options: Option[];
    onChange: (value: any) => void;
}
