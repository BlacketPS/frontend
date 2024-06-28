import { useResource } from "@stores/ResourceStore/index";
import { useRarity } from "@stores/RarityStore/index";
import styles from "../inventory.module.scss";

import { ItemProps } from "../inventory.d";

export default function Item({ item, usesLeft, ...props }: ItemProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useRarity();

    return (
        <div className={styles.item} {...props}>
            <img src={resourceIdToPath(item.imageId) || "https://cdn.blacket.org/static/content/blooks/Error.png"} alt={item.name} draggable={false} />

            <div style={{
                backgroundColor: rarities.find((r) => r.id === item.rarityId)!.color
            }} className={styles.itemsLeft}>{usesLeft.toLocaleString()} Left</div>
        </div>
    );
}
