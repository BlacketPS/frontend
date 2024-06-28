import { useResource } from "@stores/ResourceStore/index";
import { useRarity } from "@stores/RarityStore/index";
import styles from "../inventory.module.scss";

import { BlookProps } from "../inventory";

export default function Blook({ blook, locked, quantity, ...props }: BlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useRarity();

    return (
        <div data-locked={locked} className={styles.blook} {...props}>
            <img src={!locked ? (resourceIdToPath(blook.imageId) || "https://cdn.blacket.org/static/content/blooks/Error.png") : "https://cdn.blacket.org/static/content/blooks/Default.png"} data-locked={locked} alt={blook.name} draggable={false} />
            {!locked && <div style={{
                backgroundColor: rarities.find((r) => r.id === blook.rarityId)!.color
            }} className={styles.blookQuantity}>{quantity.toLocaleString()}</div>}

            {locked && <i className={`${styles.blookLock} fas fa-question`} />}
        </div>
    );
}
