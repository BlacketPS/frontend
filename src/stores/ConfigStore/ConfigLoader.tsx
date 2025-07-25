import { ReactNode, useEffect } from "react";
import { useConfig } from "./index";

import Error from "../../views/Error";
import { ErrorCode } from "../../views/Error/error.d";

export function ConfigLoader({ children }: { children: ReactNode }) {
    const { loading, error, fetchConfig } = useConfig();

    useEffect(() => {
        fetchConfig();
    }, []);

    if (loading) return null;

    if (error) return (
        <Error
            code={error === true ? ErrorCode.MAINTENANCE : ErrorCode.BLACKLISTED}
            reason={error === true ? "" : error}
        />
    );
    else return children;
}
