import { ReactNode } from "react";
import { useLoading } from "@stores/LoadingStore/index";
import Loader from "@components/Loader";

export function LoadingWrapper({ children }: { children: ReactNode }) {
    const { loading } = useLoading();

    return (
        <>
            {typeof loading === "string" ? <Loader message={`${loading}...`} /> : loading ? <Loader /> : null}

            {children}
        </>
    );
}
