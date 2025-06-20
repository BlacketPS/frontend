import { GetTransactionsResponse } from "./useTransactions";

export function useTransactions() {
    const getTransactions = () => new Promise<GetTransactionsResponse>((resolve, reject) => window.fetch2.get("/api/users/transactions")
        .then((res: GetTransactionsResponse) => resolve(res))
        .catch(reject));

    return { getTransactions };
}
