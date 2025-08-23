import { CSSProperties, HTMLAttributes } from "react";
import { Title } from "@blacket/types";

export interface TitleProps extends HTMLAttributes<HTMLSpanElement> {
    title: Title | number;
    style?: CSSProperties;
}
