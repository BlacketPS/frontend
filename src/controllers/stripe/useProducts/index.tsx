import { StripeStoreEntity } from "@blacket/types";

export function useStores() {
    const getStores = () => new Promise<StripeStoreEntity[]>((resolve, reject) => window.fetch2.get("/api/stripe/stores")
        .then((res: Fetch2Response & { data: StripeStoreEntity[] }) => resolve(res.data))
        .catch(reject));

    return { getStores };
}
