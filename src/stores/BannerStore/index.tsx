import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface BannerStoreContext {
    banners: any,
    setBanners: (badges: any) => void
}

const BannerStoreContext = createContext<BannerStoreContext>({ banners: null, setBanners: () => { } });

export function useBanner() {
    return useContext(BannerStoreContext);
}

export function BannerStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [banners, setBanners] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/banners")
            .then((res) => setBanners(res.data.badges));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <BannerStoreContext.Provider value={{ banners, setBanners }}>{!loading ? children : <Loading error={error} message="banners" />}</BannerStoreContext.Provider>;
}
