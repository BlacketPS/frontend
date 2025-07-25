import { ReactNode, useEffect, useState } from "react";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useUser } from "@stores/UserStore";
import Loading from "../../../views/Loading";
import styles from "@stores/DataStore/dataStore.module.scss";

export default function DataLoader({ children }: { children: ReactNode }) {
    const { setUser } = useUser();
    const { setResources, resourceIdToPath } = useResource();
    const {
        setBadges, setBanners, setBlooks, setEmojis, setFonts, setItems, setItemShop,
        setPacks, setRarities, setTitles, setProducts, setSpinnyWheels
    } = useData();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [completed, setCompleted] = useState<number>(0);

    const max = 12 + (localStorage.getItem("token") ? 1 : 0);

    useEffect(() => {
        if (completed >= max) return setLoading(false);

        window.fetch2.get("/api/data/resources")
            .then((res) => {
                setResources(res.data);
                setCompleted((c) => c + 1);
            })
            .catch(setError);
    }, []);

    useEffect(() => {
        if (completed >= max) return;

        const endpoints = [
            ["badges", setBadges],
            ["banners", setBanners],
            ["blooks", setBlooks],
            ["emojis", setEmojis],
            ["items", setItems],
            ["item-shop", setItemShop],
            ["packs", setPacks],
            ["rarities", setRarities],
            ["titles", setTitles],
            ["products", setProducts],
            ["spinny-wheels", setSpinnyWheels]
        ] as const;

        endpoints.forEach(([key, setter]) => {
            window.fetch2.get(`/api/data/${key}`)
                .then((res) => {
                    setter(res.data);
                    setCompleted((c) => c + 1);
                })
                .catch(setError);
        });

        window.fetch2.get("/api/data/fonts")
            .then(async (res) => {
                for (const font of res.data) {
                    const fontFace = new FontFace(font.name, `url("${resourceIdToPath(font.resourceId)}")`);
                    document.fonts.add(fontFace);
                    await fontFace.load();
                }

                setFonts(res.data);
            });

        if (localStorage.getItem("token")) {
            window.fetch2.get("/api/users/me")
                .then((res) => {
                    setUser(res.data);
                    setCompleted((c) => c + 1);
                })
                .catch((res) => {
                    setError(res);
                    localStorage.removeItem("token");
                    setTimeout(() => setLoading(false), 2000);
                });
        } else {
            setUser(null);
            setCompleted((c) => c + 1);
        }
    }, [resourceIdToPath]);

    useEffect(() => {
        if (completed >= max) setLoading(false);
    }, [ completed]);

    if (loading) return <Loading error={error}>
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
    </Loading>;
    else return children;
}
