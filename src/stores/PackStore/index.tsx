import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

import { type PackStoreContext } from "./pack.d";
import { Pack } from "blacket-types";

const PackStoreContext = createContext<PackStoreContext>({ packs: [], setPacks: () => { } });

export function usePack() {
    return useContext(PackStoreContext);
}

export function PackStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [packs, setPacks] = useState<Pack[]>([]);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/packs")
            .then((res) => setPacks(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <PackStoreContext.Provider value={{ packs, setPacks }}>{!loading ? children : <Loading error={error} message="packs" />}</PackStoreContext.Provider>;
}
