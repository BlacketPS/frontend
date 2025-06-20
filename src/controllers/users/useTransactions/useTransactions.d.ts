import { Transaction } from "@blacket/types";

export interface GetTransactionsResponse extends Fetch2Response {
    data: Transaction[];
}
