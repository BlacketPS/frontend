import { Link, useNavigate } from "react-router-dom";
import Textfit from "react-textfit";
import cardinalToOrdinal from "@functions/core/cardinalToOrdinal";
import getAvatarURL from "@functions/resources/getAvatarURL";
import styles from "../leaderboard.module.scss";

import { PlacementProps, PlacementType } from "../leaderboard.d";

export default function LittlePlacement({ type, placement, user }: PlacementProps) {
    const navigate = useNavigate();

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles.otherStandingHolder} onClick={(e) => {
            if (window.innerWidth <= 850) return e.preventDefault();
        }}>
            <div className={styles.otherStandingContainer}>
                <div className={styles.otherStandingInside}>
                    <div className={styles.otherStandingPlace}>{placement}</div>
                    <div className={styles.otherStandingSuffix}>{cardinalToOrdinal(placement)}</div>

                    <div className={styles.otherStandingAvatar}>
                        <img src={getAvatarURL(user)} draggable={false} />
                    </div>

                    <div className={styles.otherStandingUsername}>
                        <Textfit className={
                            user.color === "rainbow" ? "rainbow" : ""
                        } style={{ color: user.color }} max={36} mode="single">{user.username}</Textfit>
                    </div>

                    <div className={styles.otherStandingScore}>
                        {user[type]?.toLocaleString()} <img src={`/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`} />
                    </div>
                </div>

                <div className={styles.otherStandingBottomScores}>
                    <div className={styles.otherStandingBottomScore}>
                        <img src={`/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`} /> {user[type]?.toLocaleString()} {type === PlacementType.TOKEN ? "Tokens" : "EXP"}
                    </div>

                    <div className={styles.otherStandingBottomButton} onClick={() => navigate(`/dashboard?name=${user.username}`)}>View User</div>
                </div>
            </div>
        </Link>
    );
}
