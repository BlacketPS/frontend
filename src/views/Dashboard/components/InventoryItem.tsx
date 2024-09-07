import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import styles from "../dashboard.module.scss";

import { ItemProps } from "../dashboard.d";

export default function InventoryItem({ item, usesLeft, ...props }: ItemProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useData();

    return (
        <div className={styles.item} {...props}>
            <img src={resourceIdToPath(item.imageId)} alt={item.name} draggable={false} />

            <div style={{
                backgroundColor: rarities.find((r) => r.id === item.rarityId)!.color
            }} className={styles.itemsLeft}>{usesLeft.toLocaleString()} Left</div>
        </div>
    );
}
