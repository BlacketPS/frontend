import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import type * as Square from "@square/web-sdk";
import { payments } from "@square/web-sdk";

import { type SquareStoreContext } from "./squareStore.d";

const SquareStoreContext = createContext<SquareStoreContext>({
    payments: null as unknown as Square.Payments
});

export function useSquare() {
    return useContext(SquareStoreContext);
}

export function SquareStoreProvider({ children }: { children: ReactNode }) {
    const [instance, setInstance] = useState<Square.Payments | null>(null);

    useEffect(() => {
        async function loadPayment(): Promise<void> {
            await payments(import.meta.env.VITE_SQUARE_APPLICATION_ID).then((res) => {
                if (res === null) throw new Error("Square Web Payments SDK failed to load.");

                setInstance(res);

                return res;
            });
        }

        loadPayment();
    }, []);

    return <SquareStoreContext.Provider value={{ payments: instance }}>{children}</SquareStoreContext.Provider>;
}
