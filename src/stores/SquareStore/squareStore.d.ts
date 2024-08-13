import type * as Square from "@square/web-sdk";

export interface SquareStoreContext {
    payments: Square.Payments | null;
}