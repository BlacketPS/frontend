import { HTMLAttributes } from "react";

export interface SmallButton {
    icon: string;
    text: string;
    link?: string;
    onlyMe?: boolean;
    onlyOther?: boolean;
    onClick?: () => void;
}

export interface LookupUserModalProps {
    onClick: (username: string) => Promise<void>;
}

export interface StatContainerProps {
    title: string;
    icon: string;
    value: any;
}

export interface LevelContainerProps {
    experience: number;
}

export interface SmallButtonProps extends HTMLAttributes<HTMLDivElement> {
    icon: string;
    onClick?: () => void;
}