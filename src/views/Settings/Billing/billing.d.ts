import { HTMLAttributes } from "react";

import { Transaction } from "@blacket/types";

export interface TransactionProps extends HTMLAttributes<HTMLDivElement> {
    transaction: Transaction;
    selected?: boolean;
}
