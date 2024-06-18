import { Link } from "react-router-dom";
import Textfit from "react-textfit";
import cardinalToOrdinal from "@functions/core/cardinalToOrdinal";
import useGetAvatarURL from "@functions/resources/useGetAvatarURL";
import styles from "../leaderboard.module.scss";

import { PlacementProps, PlacementType } from "../leaderboard.d";

export default function BigPlacement({ type, placement, user }: PlacementProps) {
    const avatarURL = useGetAvatarURL(user);

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles[`placement${placement}`]}>
            <div className={styles.placementInside}>
                <div className={styles[`username${placement}`]}>
                    <Textfit className={
                        user.color === "rainbow" ? "rainbow" : ""
                    } style={{ color: user.color }} max={100} mode="single">{user.username}</Textfit>
                </div>

                <div className={styles[`score${placement}`]}>
                    <img src={`https://cdn.blacket.org/static/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`} /> {user[type]?.toLocaleString()}
                </div>

                <div className={styles[`place${placement}`]}>
                    <Textfit className={styles.placeText} max={85} mode="single">{placement}</Textfit>
                    <Textfit className={styles.placeSuffix} max={30} mode="single">{cardinalToOrdinal(placement)}</Textfit>
                </div>

                <div className={styles[`avatar${placement}`]}>
                    <img src={avatarURL} draggable={false} />
                </div>
            </div>
        </Link>
    );
}
