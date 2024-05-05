import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

interface EmojiStoreContext {
    emojis: any,
    setEmojis: (blooks: any) => void
}

const EmojiStoreContext = createContext<EmojiStoreContext>({ emojis: null, setEmojis: () => { } });

export function useEmoji() {
    return useContext(EmojiStoreContext);
}

export function EmojiStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [emojis, setEmojis] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/emojis")
            .then((res: Fetch2Response) => setEmojis(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    return <EmojiStoreContext.Provider value={{ emojis, setEmojis }}>{!loading ? children : <Loading error={error} message="emojis" />}</EmojiStoreContext.Provider>;
}
