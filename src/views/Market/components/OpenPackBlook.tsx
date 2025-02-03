import { useEffect } from "react";
import { Blook, ImageOrVideo } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import Textfit from "react-textfit";
import styles from "../market.module.scss";

import { OpenPackBlookProps } from "../market.d";
import { RarityAnimationTypeEnum } from "@blacket/types";

export default function OpenPackBlook({ userBlook, animate, isNew }: OpenPackBlookProps) {
    const { resourceIdToPath } = useResource();
    const { blooks, rarities } = useData();

    const blook = blooks.find((b) => b.id === userBlook.blookId);
    if (!blook) return null;

    const rarity = rarities.find((rarity) => rarity.id === blook.rarityId);
    if (!rarity) return null;

    return (
        <div
            className={`${styles.openPackBlookContainer} ${animate ? styles[`openPackBlookContainerAnimation${Object.keys(RarityAnimationTypeEnum).indexOf(rarity.animationType) + 1}`] : ""}`}>
            <ImageOrVideo src={resourceIdToPath(blook.backgroundId)} className={styles.openPackBlookBackground} />

            {userBlook.shiny && <ImageOrVideo className={styles.shinySunburst} src={window.constructCDNUrl("/content/sunburst.svg")} />}

            <div className={styles.openPackBlookBlook}>
                <Blook
                    shiny={userBlook.shiny}
                    src={resourceIdToPath(blook.imageId)}
                />
            </div>
            <div className={styles.openPackBlookTopText}>
                <Textfit className={styles.openPackBlookBlookText} mode="single" min={10} max={40}>
                    {userBlook.shiny && "Shiny"} {blook.name}
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
