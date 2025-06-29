import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import stylesNormal from "./inventoryItem.module.scss";
import stylesVh from "./inventoryItemVh.module.scss";

import { InventoryItemProps } from "./inventoryItem.d";

export default function InventoryItem({ item, selectable = true, useVhStyles = false, ...props }: InventoryItemProps) {
    const { resourceIdToPath } = useResource();
    const { rarities, items } = useData();

    const i = items.find((i) => i.id === item.itemId);
    if (!i) return null;

    const rarity = rarities.find((r) => r.id === i.rarityId);
    if (!rarity) return null;

    const styles = useVhStyles ? stylesVh : stylesNormal;

    return (
        <div data-selectable={selectable} className={styles.item} {...props}>
            <img src={resourceIdToPath(i.imageId)} alt={i.name} draggable={false} />

            <div
                className={styles.itemQuantity}
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
                    className={styles.itemQuantityImage}
                />}

                <div className={styles.itemQuantityText}>{item.usesLeft >= 99 ? "99+" : item.usesLeft.toLocaleString()}</div>
            </div>
        </div>
    );
}
