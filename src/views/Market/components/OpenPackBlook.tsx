import { useEffect, useState } from "react";
import { Blook, ImageOrVideo, RarityLabel } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { useSound } from "@stores/SoundStore/index";
import Textfit from "react-textfit";
import styles from "../market.module.scss";

import { OpenPackBlookProps } from "../market.d";
import { RarityAnimationTypeEnum } from "@blacket/types";

export default function OpenPackBlook({ userBlook, animate = false, isNew }: OpenPackBlookProps) {
    const { resourceIdToPath } = useResource();
    const { blooks, rarities } = useData();
    const { playSound } = useSound();

    const blook = blooks.find((b) => b.id === userBlook.blookId);
    if (!blook) return null;

    const rarity = rarities.find((rarity) => rarity.id === blook.rarityId);
    if (!rarity) return null;

    let delay = 0;

    if (rarity.animationType === RarityAnimationTypeEnum.CHROMA) delay = 4600;
    if (rarity.animationType === RarityAnimationTypeEnum.MYTHICAL) delay = 8600;

    const [show, setShow] = useState(delay === 0);

    useEffect(() => {
        if (!animate) return;
        if (!userBlook.shiny) return;

        setTimeout(() => {
            playSound("shiny");
        }, 500 + (delay ? (delay + 250) : 0));
    }, [animate, userBlook.shiny]);

    useEffect(() => {
        setShow(false);

        if (delay > 0) {
            setShow(false);

            const timeout = setTimeout(() => setShow(true), delay);

            return () => clearTimeout(timeout);
        } else {
            setShow(true);
        }
    }, [delay, animate]);

    if (!show) return null;

    return (
        <div
            className={`${styles.openPackBlookContainer} ${animate ? styles.openPackBlookContainerAnimation1 : ""}`}>
            <ImageOrVideo src={resourceIdToPath(blook.backgroundId)} className={styles.openPackBlookBackground} />

            {userBlook.shiny && <img className={styles.shinySunburst} src={window.constructCDNUrl("/content/sunburst.svg")} />}

            <div className={styles.openPackBlookBlook}>
                <Blook
                    shiny={userBlook.shiny}
                    src={resourceIdToPath(blook.imageId)}
                />
            </div>
            <div className={styles.openPackBlookTopText}>
                <Textfit className={styles.openPackBlookBlookText} mode="single" min={0} max={40}>
                    {blook.name}
                </Textfit>
                <div className={styles.openPackBlookRarityContainer}>
                    <div className={styles.openPackBlookRarityLabel}>
                        <RarityLabel text={rarity.name} backgroundColor={rarity.color} />
                    </div>

                    {userBlook.shiny && <>
                        <div className={styles.openPackBlookRarityDivider} />

                        <div className={styles.openPackBlookRarityLabel}>
                            <RarityLabel text={"Shiny"} backgroundColor={"shiny"} />
                        </div>
                    </>}
                </div>
            </div>
            <div className={styles.openPackBlookBottomText}>
                {blook.chance / (userBlook.shiny ? 100 : 1)}%{isNew ? " - NEW!" : ""}
            </div>
            <div className={styles.openPackBlookShadow} />
        </div >
    );
}
