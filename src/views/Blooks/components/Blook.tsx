import { useRarity } from "@stores/RarityStore/index";
import styles from "../blooks.module.scss";

import { BlookProps } from "../blooks.d";
import { Rarity } from "blacket-types";

export default function Blook({ blook, locked, quantity, ...props }: BlookProps) {
    const { rarities } = useRarity();

    return (
        <div data-locked={locked} className={styles.blook} {...props}>
            <img src={blook.image || "/content/blooks/Error.png"} data-locked={locked} alt={blook.name} draggable={false} />
            {!locked && <div style={{
                backgroundColor: rarities.find((r: Rarity) => r.id === blook.rarity).color
            }} className={styles.blookQuantity}>{quantity.toLocaleString()}</div>}

            {locked && <i className={`fas fa-lock ${styles.blookLock}`} />}
        </div>
    );
}
