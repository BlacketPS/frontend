import { HTMLAttributes } from "react";

export interface ImageOrVideoProps extends HTMLAttributes<HTMLImageElement | HTMLVideoElement> {
    src?: string;
    alt?: string;
}