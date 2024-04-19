import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface BlookStoreContext {
    blooks: any,
    setBlooks: (blooks: any) => void
}

const BlookStoreContext = createContext<BlookStoreContext>({ blooks: null, setBlooks: () => { } });

export function useBlook() {
    return useContext(BlookStoreContext);
}

export function BlookStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [blooks, setBlooks] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/blooks")
            .then((res) => setBlooks(res.data.blooks));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <BlookStoreContext.Provider value={{ blooks, setBlooks }}>{!loading ? children : <Loading error={error} message="blooks" />}</BlookStoreContext.Provider>;
}
