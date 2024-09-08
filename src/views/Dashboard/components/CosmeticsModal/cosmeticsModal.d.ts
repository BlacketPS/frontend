import { HTMLAttributes } from "react";
import { Banner } from "blacket-types";

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
    banner: Banner;
}
