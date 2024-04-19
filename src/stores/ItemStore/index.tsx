import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface ItemStoreContext {
    items: any,
    setItems: (blooks: any) => void
}

const ItemStoreContext = createContext<ItemStoreContext>({ items: null, setItems: () => { } });

export function useItem() {
    return useContext(ItemStoreContext);
}

export function ItemStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/items")
            .then((res) => setItems(res.data.items));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <ItemStoreContext.Provider value={{ items, setItems }}>{!loading ? children : <Loading error={error} message="items" />}</ItemStoreContext.Provider>;
}
