import { useResource } from "@stores/ResourceStore/index";
import { useRarity } from "@stores/RarityStore/index";
import Textfit from "react-textfit";
import styles from "../inventory.module.scss";

import { RightBlookProps } from "../inventory";
import { Rarity } from "blacket-types";

export default function RightBlook({ blook, owned, noBlooksOwned, ...props }: RightBlookProps) {
    const { resourceIdToPath } = useResource();
    const { rarities } = useRarity();

    if (noBlooksOwned) return (
        <div className={styles.rightSide}>
            <div className={styles.rightNoBlooksOwned}>
                You don't own any blooks.
            </div>
        </div>
    );

    return (
        <div className={styles.rightSide} {...props}>
            <div className={styles.rightSideContent}>
                <div className={styles.rightBlookBackground}>
                    <img src={resourceIdToPath(blook.backgroundId) || "https://cdn.blacket.org/static/content/blooks/backgrounds/Default.png"} alt="Blook Background" draggable={false} />
                </div>
                <div className={styles.rightTopText}>
                    <Textfit mode="single" max={window.innerWidth > 1000 ? 40 : 27} className={styles.rightBlookName}>{blook.name}</Textfit>
                    <div style={{
                        color: rarities.find((r: Rarity) => r.id === (blook.rarityId)).color
                    }} className={styles.rightBlookRarity}>{rarities.find((r: Rarity) => r.id === blook.rarityId).name}</div>
                </div>

                <div className={styles.rightBlookImage}>
                    <img src={resourceIdToPath(blook.imageId) || "https://cdn.blacket.org/static/content/blooks/Error.png"} alt={blook.name} />
                </div>

                <div className={styles.rightBottomText}>{owned?.toLocaleString() || 0} Owned</div>
                <div className={styles.rightShadow} />
            </div>
        </div>
    );
}
