import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { type ConfigStoreContext, Config } from "./config.d";
import { ErrorCode } from "../../views/Error/error.d";
import Error from "../../views/Error/index";

const ConfigStoreContext = createContext<ConfigStoreContext>({ config: null, setConfig: () => { } });

export default function useConfig() {
    return useContext(ConfigStoreContext);
}

export function ConfigStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api")
            .then((res) => setConfig(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch((res) => {
                if (res.status !== 403) setError(true);
                else setError(res.data.message);
            });
    }, []);

    return <ConfigStoreContext.Provider value={{ config, setConfig }}>{
        !loading ? children : error ? <Error
            code={error === true ? ErrorCode.MAINTENANCE : ErrorCode.BLACKLISTED}
            reason={error === true ? "" : error}
        /> : null
    }</ConfigStoreContext.Provider>;
}
