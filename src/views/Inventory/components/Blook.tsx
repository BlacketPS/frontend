import { useResource } from "@stores/ResourceStore/index";
import { useRarity } from "@stores/RarityStore/index";
import styles from "../inventory.module.scss";

import { BlookProps } from "../inventory";
import { Rarity } from "blacket-types";

export default function Blook({ blook, locked, quantity, ...props }: BlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useRarity();

    return (
        <div data-locked={locked} className={styles.blook} {...props}>
            <img src={resourceIdToPath(blook.imageId) || "/content/blooks/Error.png"} data-locked={locked} alt={blook.name} draggable={false} />
            {!locked && <div style={{
                backgroundColor: rarities.find((r: Rarity) => r.id === blook.rarityId).color
            }} className={styles.blookQuantity}>{quantity.toLocaleString()}</div>}

            {locked && <i className={`fas fa-lock ${styles.blookLock}`} />}
        </div>
    );
}
