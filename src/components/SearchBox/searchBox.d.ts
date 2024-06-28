import { InputHTMLAttributes } from "react";

interface ButtonArray {
    icon: string;
    tooltip: string;
    onClick: () => void;
}

export interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
    noPadding?: boolean;
    buttons?: ButtonArray[];
    containerProps?: HTMLAttributes<HTMLDivElement>;
}
