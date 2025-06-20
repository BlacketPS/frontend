import { StripeProductEntity } from "@blacket/types";

export interface ProductPurchaseModalProps {
    product: StripeProductEntity;
    subscription?: boolean;
}

export interface ProductSuccessModalProps {
    product: StripeProductEntity;
    quantity: number;
    subscription?: boolean;
}
