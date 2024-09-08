import { useState } from "react";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { SearchBox } from "@components/index";
import { Banner } from ".";
import { useChangeBanner } from "@controllers/cosmetics/useChangeBanner/index";
import styles from "../cosmeticsModal.module.scss";

export default function BannerCategory() {
    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { user } = useUser();
    const { banners } = useData();

    const { changeBanner } = useChangeBanner();

    if (!user) return null;

    const onSelect = (id: number) => {
        setLoading(true);

        changeBanner({ bannerId: id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    return (
        <>
            <SearchBox
                placeholder="Search for a banner..."
                onChange={(e) => setSearch(e.target.value)}
                containerProps={{
                    style: { padding: "unset", margin: "unset", width: "100%", marginBottom: "10px", boxShadow: "unset" }
                }}
            />

            <div className={styles.holder} data-column={true}>
                <Banner banner={banners.find((banner) => banner.id === 1)!} onClick={() => onSelect(1)} />

                {banners
                    .filter((banner) => banner.name.toLowerCase().includes(search.toLowerCase()))
                    .map((banner) => user.banners.includes(banner.id) && <Banner key={banner.id} banner={banner} onClick={() => onSelect(banner.id)} />)
                }
            </div>
        </>
    );
}
