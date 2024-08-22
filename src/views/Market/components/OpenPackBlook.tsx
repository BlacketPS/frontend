import { useEffect } from "react";
import { ImageOrVideo } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import Textfit from "@namhong2001/react-textfit";
import styles from "../market.module.scss";

import { OpenPackBlookProps } from "../market.d";
import { RarityAnimationTypeEnum } from "blacket-types";

export default function OpenPackBlook({ blook, animate, isNew }: OpenPackBlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useData();

    const rarity = rarities.find((rarity) => rarity.id === blook.rarityId);

    useEffect(() => {
        if (!rarity) throw new Error(`Rarity with id ${blook.rarityId} not found.`);
    }, [rarity]);

    if (rarity) return (
        <div
            className={`${styles.openPackBlookContainer} ${animate ? styles[`openPackBlookContainerAnimation${Object.keys(RarityAnimationTypeEnum).indexOf(rarity.animationType) + 1}`] : ""}`}>
            <ImageOrVideo src={resourceIdToPath(blook.backgroundId)} className={styles.openPackBlookBackground} />
            <div className={styles.openPackBlookBlook}>
                <ImageOrVideo src={resourceIdToPath(blook.imageId)} />
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
