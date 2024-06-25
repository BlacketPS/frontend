import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

import { Item } from "blacket-types";

interface ItemStoreContext {
    items: Item[],
    setItems: (items: Item[]) => void;
}

const ItemStoreContext = createContext<ItemStoreContext>({ items: [], setItems: () => { } });

export function useItem() {
    return useContext(ItemStoreContext);
}

export function ItemStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/items")
            .then((res: Fetch2Response) => setItems(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <ItemStoreContext.Provider value={{ items, setItems }}>{!loading ? children : <Loading error={error} message="items" />}</ItemStoreContext.Provider>;
}
