import { HTMLAttributes } from "react";

export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    initialColor?: [string, Dispatch<SetStateAction<string>>];
    hideInput?: boolean;
    open?: [boolean, Dispatch<SetStateAction<boolean>>]
    onPick: (color: string) => void;
}
