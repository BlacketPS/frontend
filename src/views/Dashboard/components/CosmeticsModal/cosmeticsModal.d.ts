import { HTMLAttributes } from "react";
import { Banner, Font, Title } from "@blacket/types";

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
    banner: Banner;
}

export interface TitleProps extends HTMLAttributes<HTMLDivElement> {
    title: Title;
}

export interface FontProps extends HTMLAttributes<HTMLDivElement> {
    font: Font;
}
