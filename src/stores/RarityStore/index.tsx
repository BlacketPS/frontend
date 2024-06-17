import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

import { type RarityStoreContext } from "./rarity.d";
import { Rarity } from "blacket-types";

const RarityStoreContext = createContext<RarityStoreContext>({ rarities: [], setRarities: () => { } });

export function useRarity() {
    return useContext(RarityStoreContext);
}

export function RarityStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [rarities, setRarities] = useState<Rarity[]>([]);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/rarities")
            .then((res: Fetch2Response) => setRarities(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <RarityStoreContext.Provider value={{ rarities, setRarities }}>{!loading ? children : <Loading error={error} message="rarities" />}</RarityStoreContext.Provider>;
}
