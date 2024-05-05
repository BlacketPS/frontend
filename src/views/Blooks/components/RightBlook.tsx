import { useRarity } from "@stores/RarityStore/index";
import Textfit from "react-textfit";
import styles from "../blooks.module.scss";

import { RightBlookProps } from "../blooks.d";
import { Rarity } from "blacket-types";

export default function RightBlook({ blook, owned, noBlooksOwned }: RightBlookProps) {
    const { rarities } = useRarity();

    if (noBlooksOwned) return (
        <div className={styles.rightSide}>
            <div className={styles.rightNoBlooksOwned}>
                You don't own any blooks.
            </div>
        </div>
    );

    return (
        <div className={styles.rightSide}>
            <img src={blook.background || "/content/blooks/backgrounds/Default.png"} alt="Blook Background" draggable={false} className={styles.rightBlookBackground} />
            <div className={styles.rightTopText}>
                <Textfit mode="single" max={window.innerWidth > 1000 ? 40 : 27} className={styles.rightBlookName}>{blook.name}</Textfit>
                <div style={{
                    color: rarities.find((r: Rarity) => r.id === (blook.rarity)).color
                }} className={styles.rightBlookRarity}>{rarities.find((r: Rarity) => r.id === blook.rarity).name}</div>
            </div>

            <div className={styles.rightBlookImage}>
                <img src={blook.image || "/content/blooks/Error.png"} alt={blook.name} />
            </div>

            <div className={styles.rightBottomText}>{owned.toLocaleString() || 0} Owned</div>
            <div className={styles.rightShadow} />
        </div>
    );
}
