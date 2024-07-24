import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import Loading from "../../views/Loading";
import styles from "./dataStore.module.scss";

import { type DataStoreContext } from "./dataStore.d";
import { Banner, Blook, Emoji, Font, Item, ItemShop, Pack, Rarity, Title } from "blacket-types";

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
    itemShop: [],
    setItemShop: () => { },
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
    const [itemShop, setItemShop] = useState<ItemShop[]>([]);
    const [packs, setPacks] = useState<Pack[]>([]);
    const [rarities, setRarities] = useState<Rarity[]>([]);
    const [titles, setTitles] = useState<Title[]>([]);

    const { resources, resourceIdToPath, setResources } = useResource();
    const { setUser } = useUser();

    const [completed, setCompleted] = useState<number>(0);
    const [fetchedResources, setFetchedResources] = useState<boolean>(false);
    const max = 11 + (localStorage.getItem("token") ? 1 : 0);

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

        // we need to cast here bcuz it assumses every entry in the array is a string or a setter, but actually the first is always a string and the second is always a setter
        ([
            ["badges", setBadges],
            ["banners", setBanners],
            ["blooks", setBlooks],
            ["emojis", setEmojis],
            ["items", setItems],
            ["item-shop", setItemShop],
            ["packs", setPacks],
            ["rarities", setRarities],
            ["titles", setTitles]] as [string, Dispatch<SetStateAction<any[]>>][]).forEach(([key, setter]) => window.fetch2.get(`/api/data/${key}`)
                .then((res) => {
                    setter(res.data);
                    setCompleted((completed) => completed + 1);
                })
                .catch((res) => setError(res)));

        window.fetch2.get("/api/data/fonts")
            .then(async (res) => {
                for (const font of res.data) {
                    const fontFace = new FontFace(font.name, `url("${resourceIdToPath(font.resourceId)}")`);

                    document.fonts.add(fontFace);

                    await fontFace.load();
                }

                setFonts(res.data);

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
        itemShop, setItemShop,
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
        {error ? <div className={styles.error}>2
            Failed to load game data.
            <div className={styles.subError}>
                {error.data?.message ?? error.message} Please report this issue to a developer.
            </div>
        </div> : ""}
    </Loading>}</DataStoreContext.Provider>;
}
