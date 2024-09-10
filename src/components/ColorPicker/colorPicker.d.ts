import { HTMLAttributes } from "react";

export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    initialColor?: string;
    onPick: (color: string) => void;
}
