import { Store } from "@blacket/types";

export function useProducts() {
    const getProducts = () => new Promise<Store[]>((resolve, reject) => window.fetch2.get("/api/stripe/products")
        .then((res: Fetch2Response & { data: Store[] }) => resolve(res.data))
        .catch(reject));

    return { getProducts };
}
