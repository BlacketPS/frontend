import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore/index";
import Loading from "../../views/Loading";
import styles from "./dataStore.module.scss";

import { type DataStoreContext } from "./dataStore.d";
import { Banner, Blook, Emoji, Font, Item, ItemShop, Pack, Rarity, StripeProductEntity, StripeStoreEntity, Title } from "@blacket/types";

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
    products: [],
    setProducts: () => { },
    stores: [],
    setStores: () => { },

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
    const [products, setProducts] = useState<StripeProductEntity[]>([]);
    const [stores, setStores] = useState<StripeStoreEntity[]>([]);

    const { resources, resourceIdToPath, setResources } = useResource();
    const { setUser } = useUser();

    const [completed, setCompleted] = useState<number>(0);
    const [fetchedResources, setFetchedResources] = useState<boolean>(false);
    const max = 11 + (localStorage.getItem("token") ? 1 : 0);

    useEffect(() => {
        if (!loading) return;
        if (fetchedResources) return;
        if (completed >= max) return;

        window.fetch2.get("/api/data/resources")
            .then((res) => {
                setResources(res.data);
                setCompleted((completed) => completed + 1);

                setFetchedResources(true);
            })
            .catch((res) => setError(res));
    }, [loading]);

    useEffect(() => {
        if (!loading) return;
        if (!fetchedResources) return;
        if (completed >= max) return;

        ([
            ["badges", setBadges],
            ["banners", setBanners],
            ["blooks", setBlooks],
            ["emojis", setEmojis],
            ["items", setItems],
            ["item-shop", setItemShop],
            ["packs", setPacks],
            ["rarities", setRarities],
            ["titles", setTitles],
            ["products", setProducts]
        ] as [string, Dispatch<SetStateAction<any[]>>][]).forEach(([key, setter]) => window.fetch2.get(`/api/data/${key}`)
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
            });

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
    }, [loading, resources]);

    useEffect(() => {
        if (!loading) return;

        if (completed >= max) setLoading(false);
    }, [loading, completed]);

    const fontIdToName = (id: number) => fonts.find((font) => font.id === id)?.name ?? "Nunito";
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
        products, setProducts,
        stores, setStores,

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
            Failed to load data.
            <div className={styles.subError}>
                {error.data?.message ?? error.message} Please report this issue to a developer.
            </div>
        </div> : ""}
    </Loading>}</DataStoreContext.Provider>;
}
