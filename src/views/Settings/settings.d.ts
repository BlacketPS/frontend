import { HTMLAttributes } from "react";

export interface SettingsContainerProps extends HTMLAttributes<HTMLDivElement> {
    header: {
        icon: string;
        text: string;
    };
}

export interface UpgradeButtonProps extends HTMLAttributes<HTMLAnchorElement> { }

export interface SecurityKeyProps {
    name: string;
    createdAt: Date;
    onRemove: () => void;
}
