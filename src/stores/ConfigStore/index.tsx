import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface ConfigStoreContext {
    config: any,
    setConfig: (config: any) => void
}

const ConfigStoreContext = createContext<ConfigStoreContext>({ config: null, setConfig: () => { } });

export function useConfig() {
    return useContext(ConfigStoreContext);
}

export function ConfigStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [config, setConfig] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api")
            .then((res) => setConfig(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <ConfigStoreContext.Provider value={{ config, setConfig }}>{!loading ? children : <Loading error={error} message="server information" />}</ConfigStoreContext.Provider>;
}
