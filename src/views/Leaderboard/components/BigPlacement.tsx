import { Link } from "react-router-dom";
import Textfit from "react-textfit";
import cardinalToOrdinal from "@functions/core/cardinalToOrdinal";
import useGetAvatarURL from "@functions/resources/useGetAvatarURL";
import styles from "../leaderboard.module.scss";

import { PlacementProps, PlacementType } from "../leaderboard.d";

export default function BigPlacement({ type, placement, user }: PlacementProps) {
    const place = { 1: "One", 2: "Two", 3: "Three" };

    const placementKey = placement as 1 | 2 | 3;

    const avatarURL = useGetAvatarURL(user);

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles[`placement${place[placementKey]}`]}>
            <div className={styles.placementInside}>
                <div className={styles[`username${place[placementKey]}`]}>
                    <Textfit className={
                        user.color === "rainbow" ? "rainbow" : ""
                    } style={{ color: user.color }} max={100} mode="single">{user.username}</Textfit>
                </div>

                <div className={styles[`score${place[placementKey]}`]}>
                    <img src={`/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`} /> {user[type]?.toLocaleString()}
                </div>

                <div className={styles[`place${place[placementKey]}`]} >
                    <Textfit className={styles.placeText} max={85} mode="single">{placement}</Textfit>
                    <Textfit className={styles.placeSuffix} max={30} mode="single">{cardinalToOrdinal(placement)}</Textfit>
                </div>

                <div className={styles[`avatar${place[placementKey]}`]}>
                    <img src={avatarURL} draggable={false} />
                </div>
            </div>
        </Link>
    );
}
