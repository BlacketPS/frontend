import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../inventory.module.scss";

import { BlookProps } from "../inventory";

export default function Blook({ blook, locked, quantity, ...props }: BlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useData();

    return (
        <div data-locked={locked} className={styles.blook} {...props}>
            <ImageOrVideo src={!locked ? resourceIdToPath(blook.imageId) : window.constructCDNUrl("/content/blooks/Default.png")} data-locked={locked} alt={blook.name} draggable={false} />
            {!locked && <div style={{
                backgroundColor: rarities.find((rarity) => rarity.id === blook.rarityId)!.color
            }} className={styles.blookQuantity}>{quantity.toLocaleString()}</div>}

            {locked && <i className={`${styles.blookLock} fas fa-lock`} />}
        </div>
    );
}
