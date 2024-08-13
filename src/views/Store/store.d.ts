import { ReactNode } from "react";

export interface CategoryProps {
    title: string;
    subTitle: string;
    children?: ReactNode;
}

export type Product = {
    name: string;
    monthly?: boolean;
    price: number;
    lifetime?: number;
    image: string;
    colors: string[];
    type: string;
};