import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { Blook } from "@components/index";
import styles from "../inventory.module.scss";

import { BlookProps } from "../inventory";

export default function InventoryBlook({ blook, shiny, locked, quantity, ...props }: BlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useData();

    return (
        <div data-locked={locked} className={styles.blook} {...props}>
            <Blook
                className={styles.blookImage}
                // src={!locked ? resourceIdToPath(blook.imageId) : window.constructCDNUrl("/content/blooks/Default.png")}
                src={resourceIdToPath(blook.imageId)}
                alt={blook.name}
                data-locked={locked}
                draggable={false}
                shiny={shiny}
            />

            {!locked && <div style={{
                backgroundColor: rarities.find((rarity) => rarity.id === blook.rarityId)!.color
            }} className={styles.blookQuantity}>{quantity.toLocaleString()}</div>}

            {locked && <i className={`${styles.blookLock} fas fa-lock`} />}
        </div>
    );
}
