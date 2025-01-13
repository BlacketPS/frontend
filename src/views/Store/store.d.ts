import { HTMLAttributes, ReactNode } from "react";
import { Product } from "@blacket/types";

export interface CategoryProps {
    title: string;
    subTitle: string;
    children?: ReactNode;
}

export interface ProductProps extends HTMLAttributes<HTMLDivElement> {
    product: Product;
}

export interface ProductModalProps {
    product: Product;
}
