import { HTMLAttributes } from "react";

export interface AdUnitProps extends HTMLAttributes<HTMLDivElement> {
    slot: string;
    width?: number;
    height?: number;
    mobileOnly?: boolean;
}
