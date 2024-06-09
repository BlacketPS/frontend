import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {useResource} from "@stores/ResourceStore/index";
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

    const { resourceIdToPath } = useResource();

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/fonts")
            .then((res: Fetch2Response) => {
                setFonts(res.data);

                return res.data;
            });

        fetchData()
            .then((res: Font[]) => {
                for (const font of res) {
                    const fontFace = new FontFace(font.name, `url("${resourceIdToPath(font.resourceId)}")`);

                    document.fonts.add(fontFace);

                    fontFace.load();
                }

                setLoading(false);
            })
            .catch((res) => {
                if (res.status !== 403) setError(true);
                else setError(res.data.message);
            });
    }, []);

    return <FontStoreContext.Provider value={{ fonts, setFonts }}>{!loading ? children : <Loading error={error} message="fonts" />}</FontStoreContext.Provider>;
}
