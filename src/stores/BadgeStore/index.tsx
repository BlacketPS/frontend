import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface BadgeStoreContext {
    badges: any,
    setBadges: (badges: any) => void
}

const BadgeStoreContext = createContext<BadgeStoreContext>({ badges: null, setBadges: () => { } });

export function useBadge() {
    return useContext(BadgeStoreContext);
}

export function BadgeStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [badges, setBadges] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/badges")
            .then((res) => setBadges(res.data.badges));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <BadgeStoreContext.Provider value={{ badges, setBadges }}>{!loading ? children : <Loading error={error} message="badges" />}</BadgeStoreContext.Provider>;
}
