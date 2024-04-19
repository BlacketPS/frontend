import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface PackStoreContext {
    packs: any,
    setPacks: (blooks: any) => void
}

const PackStoreContext = createContext<PackStoreContext>({ packs: null, setPacks: () => { } });

export function usePack() {
    return useContext(PackStoreContext);
}

export function PackStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [packs, setPacks] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/packs")
            .then((res) => setPacks(res.data.packs));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <PackStoreContext.Provider value={{ packs, setPacks }}>{!loading ? children : <Loading error={error} message="packs" />}</PackStoreContext.Provider>;
}
