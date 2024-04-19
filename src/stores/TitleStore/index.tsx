import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface TitleStoreContext {
    titles: any,
    setTitles: (blooks: any) => void
}

const TitleStoreContext = createContext<TitleStoreContext>({ titles: null, setTitles: () => { } });

export function useTitle() {
    return useContext(TitleStoreContext);
}

export function TitleStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [titles, setTitles] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/titles")
            .then((res) => setTitles(res.data.titles));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <TitleStoreContext.Provider value={{ titles, setTitles }}>{!loading ? children : <Loading error={error} message="titles" />}</TitleStoreContext.Provider>;
}
