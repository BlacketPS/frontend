import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import Loading from "../../views/Loading";
import styles from "./dataStore.module.scss";

import { type DataStoreContext } from "./dataStore.d";
import { Banner, Blook, Emoji, Font, Item, Pack, Rarity, Resource, Title } from "blacket-types";

const DataStoreContext = createContext<DataStoreContext>({
    badges: [],
    setBadges: () => { },
    banners: [],
    setBanners: () => { },
    blooks: [],
    setBlooks: () => { },
    emojis: [],
    setEmojis: () => { },
    fonts: [],
    setFonts: () => { },
    items: [],
    setItems: () => { },
    packs: [],
    setPacks: () => { },
    rarities: [],
    setRarities: () => { },
    titles: [],
    setTitles: () => { },

    titleIdToText: () => "",
    fontIdToName: () => ""
});

export function useData() {
    return useContext(DataStoreContext);
}

export function DataStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<any>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [badges, setBadges] = useState<any[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [blooks, setBlooks] = useState<Blook[]>([]);
    const [emojis, setEmojis] = useState<Emoji[]>([]);
    const [fonts, setFonts] = useState<Font[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [packs, setPacks] = useState<Pack[]>([]);
    const [rarities, setRarities] = useState<Rarity[]>([]);
    const [titles, setTitles] = useState<Title[]>([]);

    const { resources, resourceIdToPath, setResources } = useResource();
    const { setUser } = useUser();

    const [completed, setCompleted] = useState<number>(0);
    const [fetchedResources, setFetchedResources] = useState<boolean>(false);
    const max = 10 + (localStorage.getItem("token") ? 1 : 0);

    useEffect(() => {
        window.fetch2.get("/api/data/resources")
            .then((res) => {
                setResources(res.data);
                setCompleted((completed) => completed + 1);

                setFetchedResources(true);
            })
            .catch((res) => setError(res));
    }, []);

    useEffect(() => {
        if (!fetchedResources) return;

        window.fetch2.get("/api/data/badges")
            .then((res) => {
                setBadges(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/banners")
            .then((res) => {
                setBanners(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/blooks")
            .then((res) => {
                setBlooks(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch(() => setError(true));
        window.fetch2.get("/api/data/emojis")
            .then((res) => {
                setEmojis(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/fonts")
            .then(async (res) => {
                console.log(resources);
                for (const font of res.data) {
                    const fontFace = new FontFace(font.name, `url("${resourceIdToPath(font.resourceId)}")`);

                    document.fonts.add(fontFace);

                    await fontFace.load();
                }

                setFonts(res.data);

                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/items")
            .then((res) => {
                setItems(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/packs")
            .then((res) => {
                setPacks(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/rarities")
            .then((res) => {
                setRarities(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));
        window.fetch2.get("/api/data/titles")
            .then((res) => {
                setTitles(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => setError(res));

        if (localStorage.getItem("token")) window.fetch2.get("/api/users/me")
            .then((res) => {
                setUser(res.data);
                setCompleted((completed) => completed + 1);
            })
            .catch((res) => {
                setError(res);

                setTimeout(() => setLoading(false), 2000);

                localStorage.removeItem("token");
            });
        else {
            setUser(null);
            setCompleted((completed) => completed + 1);
        }
    }, [resources]);

    useEffect(() => {
        if (completed >= max) setLoading(false);
    }, [completed]);

    const fontIdToName = (id: number) => fonts.find((font) => font.id === id)?.name ?? fonts[0].name;
    const titleIdToText = (id: number) => titles.find((title) => title.id === id)?.name ?? "Unknown";

    return <DataStoreContext.Provider value={{
        badges, setBadges,
        banners, setBanners,
        blooks, setBlooks,
        emojis, setEmojis,
        fonts, setFonts,
        items, setItems,
        packs, setPacks,
        rarities, setRarities,
        titles, setTitles,

        titleIdToText,
        fontIdToName
    }}>{!loading ? children : <Loading error={error}>
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{
                    width: (100 / max) * completed + "%",
                    backgroundColor: error ? "red" : ""
                }} />
            </div>
        </div>
        {error ? <div className={styles.error}>
            Failed to load game data.
            <div className={styles.subError}>
                {error.data?.message ?? error.message} Please report this issue to a developer.
            </div>
        </div> : ""}
    </Loading>}</DataStoreContext.Provider>;
}
