import { useState } from "react";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { SearchBox } from "@components/index";
import { InventoryBlook } from "../../../components";
import { useChangeAvatar } from "@controllers/cosmetics/useChangeAvatar/index";
import styles from "../cosmeticsModal.module.scss";

export default function AvatarCategory() {
    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { user } = useUser();
    const { packs, blooks } = useData();

    const { changeAvatar } = useChangeAvatar();

    if (!user) return null;

    const nonPackBlooks = blooks
        .filter((blook) => !blook.packId)
        .sort((a, b) => a.priority - b.priority);

    const onSelect = (id: number) => {
        setLoading(true);

        changeAvatar({ blookId: id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    return (
        <>
            <SearchBox
                placeholder="Search for a blook..."
                onChange={(e) => setSearch(e.target.value)}
                containerProps={{
                    style: { padding: "unset", margin: "unset", width: "100%", marginBottom: "10px", boxShadow: "unset" }
                }}
            />

            <div className={styles.holder}>
                <InventoryBlook blook={blooks.find((blook) => blook.id === 1)!} quantity={0} onClick={() => onSelect(1)} data-selectable={true} />

                {packs.sort((a, b) => a.priority - b.priority).map((pack) => {
                    const filteredBlooks = blooks
                        .filter((blook) => blook.packId === pack.id)
                        .filter((blook) => blook.name.toLowerCase().includes(search.toLowerCase()))
                        .sort((a, b) => a.priority - b.priority);

                    if (filteredBlooks.length > 0) return filteredBlooks
                        .filter((blook) => blook.name.toLowerCase().includes(search.toLowerCase()))
                        .map((blook) => user.blooks[blook.id] && <InventoryBlook key={blook.id} blook={blook} quantity={0} onClick={() => onSelect(blook.id)} data-selectable={true} />);
                })}

                {nonPackBlooks
                    .filter((blook) => blook.name.toLowerCase().includes(search.toLowerCase()))
                    .map((blook) => user.blooks[blook.id] && <InventoryBlook key={blook.id} blook={blook} quantity={0} onClick={() => onSelect(blook.id)} data-selectable={true} />)
                }
            </div>
        </>
    );
}
