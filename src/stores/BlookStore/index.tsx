import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";
import { type BlookStoreContext } from "./blook.d";
import { Blook } from "blacket-types";

const BlookStoreContext = createContext<BlookStoreContext>({ blooks: [], setBlooks: () => { } });

export function useBlook() {
    return useContext(BlookStoreContext);
}

export function BlookStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [blooks, setBlooks] = useState<Blook[]>([]);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/blooks")
            .then((res: Fetch2Response) => setBlooks(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <BlookStoreContext.Provider value={{ blooks, setBlooks }}>{!loading ? children : <Loading error={error} message="blooks" />}</BlookStoreContext.Provider>;
}
