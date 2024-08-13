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
                    <img src={`https://cdn.blacket.org/static/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`} /> {user[type]?.toLocaleString()}
                </Textfit>

                <div className={styles[`place${placement}`]}>
                    <Textfit className={styles.placeText} min={0} max={85} mode="single">{placement}</Textfit>
                    <Textfit className={styles.placeSuffix} min={0} max={30} mode="single">{cardinalToOrdinal(placement)}</Textfit>
                </div>

                <div className={styles[`avatar${placement}`]}>
                    <ImageOrVideo src={getUserAvatarPath(user)} draggable={false} />
                </div>
            </div>
        </Link>
    );
}
