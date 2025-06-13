import { HTMLAttributes } from "react";

export interface HeaderButtonProps extends HTMLAttributes<HTMLDivElement> {
    icon?: string;
    to?: string;
    scrolled?: boolean;
}

export interface HeroButtonProps extends HTMLAttributes<HTMLDivElement> {
    to?: string;
    mobileOnly?: boolean;
}

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
    header: string;
    image?: string;
    reverse?: boolean;
}

export interface HowColumnProps extends HTMLAttributes<HTMLDivElement> {
    image: string;
}

export interface HeroImageProps extends HTMLAttributes<HTMLDivElement> {
    src: string;
    alt?: string;
    mobile?: boolean;
}
