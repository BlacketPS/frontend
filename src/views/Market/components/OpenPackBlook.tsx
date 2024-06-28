import { useEffect } from "react";
import { useResource } from "@stores/ResourceStore/index";
import { useRarity } from "@stores/RarityStore/index";
import Textfit from "@namhong2001/react-textfit";
import styles from "../market.module.scss";

import { OpenPackBlookProps } from "../market.d";

export default function OpenPackBlook({ blook, animate, isNew }: OpenPackBlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useRarity();

    const rarity = rarities.find((rarity) => rarity.id === blook.rarityId);

    useEffect(() => {
        if (!rarity) throw new Error(`Rarity with id ${blook.rarityId} not found.`);
    }, [rarity]);

    if (rarity) return (
        <div className={`${styles.openPackBlookContainer} ${animate ? styles[`openPackBlookContainerAnimation${rarity.animationType}`] : ""}`}>
            <img src={resourceIdToPath(blook.backgroundId)} className={styles.openPackBlookBackground} />
            <div className={styles.openPackBlookBlook}>
                <img src={resourceIdToPath(blook.imageId)} />
            </div>
            <div className={styles.openPackBlookTopText}>
                <Textfit className={styles.openPackBlookBlookText} mode="single" min={10} max={40}>
                    {blook.name}
                </Textfit>
                <div className={styles.openPackBlookRarityText} style={{ color: rarity.color }}>
                    {rarity.name}
                </div>
            </div>
            <div className={styles.openPackBlookBottomText}>
                {blook.chance}%{isNew ? " - NEW!" : ""}
            </div>
            <div className={styles.openPackBlookShadow} />
        </div>
    );
}
