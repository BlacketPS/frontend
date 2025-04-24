import { HTMLAttributes, ReactNode } from "react";
import { StripeProductEntity } from "@blacket/types";

export interface CategoryProps {
    title: string;
    subTitle: string;
    children?: ReactNode;
}

export interface ProductProps extends HTMLAttributes<HTMLDivElement> {
    product: StripeProductEntity;
}

export interface ProductModalProps {
    product: StripeProductEntity;
}
