import { Link } from "react-router-dom";
import Textfit from "react-textfit";
import { useUser } from "@stores/UserStore/index";
import cardinalToOrdinal from "@functions/core/cardinalToOrdinal";
import { ImageOrVideo } from "@components/index";
import styles from "../leaderboard.module.scss";

import { BigPlacementProps, PlacementType } from "../leaderboard.d";

export default function BigPlacement({ type, placement, user }: BigPlacementProps) {
    const { getUserAvatarPath } = useUser();

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles[`placement${placement}`]}>
            <div className={styles.placementInside}>
                <div className={styles[`username${placement}`]}>
                    <Textfit className={
                        user.color === "rainbow" ? "rainbow" : ""
                    } style={{ color: user.color }} max={75} mode="single">{user.username}</Textfit>
                </div>

                <div className={styles[`score${placement}`]}>
                    <img src={`https://cdn.blacket.org/static/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`} /> {user[type]?.toLocaleString()}
                </div>

                <div className={styles[`place${placement}`]}>
                    <Textfit className={styles.placeText} max={85} mode="single">{placement}</Textfit>
                    <Textfit className={styles.placeSuffix} max={30} mode="single">{cardinalToOrdinal(placement)}</Textfit>
                </div>

                <div className={styles[`avatar${placement}`]}>
                    <ImageOrVideo src={getUserAvatarPath(user)} draggable={false} />
                </div>
            </div>
        </Link>
    );
}
