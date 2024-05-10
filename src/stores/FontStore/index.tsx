import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

import { type FontStoreContext } from "./font.d";
import { Font } from "blacket-types";

const FontStoreContext = createContext<FontStoreContext>({ fonts: [], setFonts: () => { } });

export function useFont() {
    return useContext(FontStoreContext);
}

export function FontStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [fonts, setFonts] = useState<Font[]>([]);

    useEffect(() => {
        const elements: HTMLStyleElement[] = [];

        const fetchData = async () => await window.fetch2.get("/api/data/fonts")
            .then((res: Fetch2Response) => {
                setFonts(res.data);

                return res.data;
            });

        fetchData()
            .then((res: Font[]) => {
                for (const font of res) {
                    const element = document.createElement("style");
                    element.innerHTML = `@font-face { font-family: ${!font.name.includes(" ") ? font.name : `"${font.name}"`}; src: url("${font.resource}"); }`;

                    elements.push(element);
                }

                for (const element of elements) document.head.appendChild(element);

                setLoading(false);
            })
            .catch((res) => {
                if (res.status !== 403) setError(true);
                else setError(res.data.message);
            });

        return () => elements.forEach((element) => element.remove());
    }, []);

    return <FontStoreContext.Provider value={{ fonts, setFonts }}>{!loading ? children : <Loading error={error} message="fonts" />}</FontStoreContext.Provider>;
}
