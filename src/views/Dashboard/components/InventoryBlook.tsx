import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { Blook } from "@components/index";
import styles from "../dashboard.module.scss";

import { BlookProps } from "../dashboard.d";

export default function InventoryBlook({ blook, quantity, shiny, ...props }: BlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useData();

    return (
        <div className={styles.blook} {...props}>
            <Blook shiny={shiny} src={resourceIdToPath(blook.imageId) || window.constructCDNUrl("/content/blooks/Default.png")} alt={blook.name} draggable={false} />
            {quantity > 0 && <div style={{
                backgroundColor: rarities.find((rarity) => rarity.id === blook.rarityId)!.color
            }} className={styles.blookQuantity}>{quantity.toLocaleString()}</div>}
        </div>
    );
}
