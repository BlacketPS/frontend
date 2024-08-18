import { Link } from "react-router-dom";
import Textfit from "react-textfit";
import { useUser } from "@stores/UserStore/index";
import cardinalToOrdinal from "@functions/core/cardinalToOrdinal";
import { ImageOrVideo, Username } from "@components/index";
import styles from "../leaderboard.module.scss";

import { BigPlacementProps, PlacementType } from "../leaderboard.d";

export default function BigPlacement({ type, placement, user }: BigPlacementProps) {
    const { getUserAvatarPath } = useUser();

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles[`placement${placement}`]}>
            <div className={styles.placementInside}>
                <div className={styles[`username${placement}`]}>
                    <Textfit min={0} max={75} mode="single">
                        <Username user={user} />
                    </Textfit>
                </div>

                <Textfit className={styles[`score${placement}`]} min={25} max={40} mode="single">
                    <img src={window.constructCDNUrl(`/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`)} /> {user[type]?.toLocaleString()}
                </Textfit>

                <div className={styles[`place${placement}`]}>
                    <div className={styles.placeText}>{placement}</div>
                    <div className={styles.placeSuffix}>{cardinalToOrdinal(placement)}</div>
                </div>

                <div className={styles[`avatar${placement}`]}>
                    <ImageOrVideo src={getUserAvatarPath(user)} draggable={false} />
                </div>
            </div>
        </Link>
    );
}
