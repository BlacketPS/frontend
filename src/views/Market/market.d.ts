import { HTMLAttributes } from "react";

export interface CategoryProps extends HTMLAttributes<HTMLDivElement> {
    header: string;
    internalName: string;
}

export interface PackProps extends HTMLAttributes<HTMLDivElement> {
    pack: any;
}

export interface OpenPackModalProps {
    packId: number;
    userTokens: number;
    onYesButton: () => Promise<void>
}
