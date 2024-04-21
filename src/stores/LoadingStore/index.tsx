import { ReactNode, createContext, useContext, useState } from "react";
import { type LoadingStoreContext } from "./loading.d";
import Loader from "@components/Loader/index";

const LoadingStoreContext = createContext<LoadingStoreContext>({ loading: false, setLoading: () => {} });

export function useLoading() {
    return useContext(LoadingStoreContext);
}

export function LoadingStoreProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean | string>(false);

    return (
        <LoadingStoreContext.Provider value={{ loading, setLoading }}>
            {typeof loading === "string" ? <Loader message={`${loading}...`} /> : loading ? <Loader /> : null}

            {children}
        </LoadingStoreContext.Provider>
    );
}
