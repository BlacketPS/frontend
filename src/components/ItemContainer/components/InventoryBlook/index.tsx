import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { useSound } from "@stores/SoundStore/index";
import Blook from "../../../Blook/index";
import stylesNormal from "./inventoryBlook.module.scss";
import stylesVh from "./inventoryBlookVh.module.scss";

import { InventoryBlookProps } from "./inventoryBlook";

export default function InventoryBlook({ blook, shiny = false, big = false, locked = false, amount = 0, selectable = true, useVhStyles = false, ...props }: InventoryBlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useData();
    const { playSound } = useSound();

    const rarity = rarities.find((r) => r.id === blook.rarityId);
    if (!rarity) return null;

    const styles = useVhStyles ? stylesVh : stylesNormal;

    return (
        <div
            data-locked={locked}
            data-selectable={selectable}
            className={styles.blook}
            onMouseEnter={() => {
                if (!selectable) return;

                playSound("hover");
            }}
            {...props}
        >
            <Blook
                className={styles.blookImage}
                src={resourceIdToPath(blook.imageId)}
                alt={blook.name}
                data-locked={locked}
                draggable={false}
                shiny={shiny}
                big={big}
            />

            {!locked && amount > 0 && <div
                className={styles.blookQuantity}
                style={{
                    backgroundColor: !rarity.imageId ? rarity.color : "transparent"
                }}
            >
                {rarity.color === "rainbow" && <div
                    className="rainbowOverlay"
                    style={{
                        maskImage: rarity.imageId ? `url(${resourceIdToPath(rarity.imageId)})` : undefined,
                        maskSize: "cover",
                        width: useVhStyles ? "2vh" : 20,
                        height: useVhStyles ? "2vh" : 20
                    }}
                />}
                {rarity.imageId && <img
                    src={resourceIdToPath(rarity.imageId)}
                    className={styles.blookQuantityImage}
                />}

                <div className={styles.blookQuantityText}>{amount >= 99 ? "99+" : amount.toLocaleString()}</div>
            </div>}

            {locked && <i className={`${styles.blookLock} fas fa-lock`} />}
        </div>
    );
}
