import { Link, useNavigate } from "react-router-dom";
import Textfit from "react-textfit";
import { useUser } from "@stores/UserStore/index";
import cardinalToOrdinal from "@functions/core/cardinalToOrdinal";
import { ImageOrVideo, Username } from "@components/index";
import styles from "../leaderboard.module.scss";

import { LittlePlacementProps, PlacementType } from "../leaderboard.d";

export default function LittlePlacement({ type, placement, user }: LittlePlacementProps) {
    const navigate = useNavigate();

    const { getUserAvatarPath } = useUser();

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles.otherStandingHolder} onClick={(e) => {
            if (window.innerWidth <= 850) return e.preventDefault();
        }}>
            <div className={styles.otherStandingContainer}>
                <div className={styles.otherStandingInside}>
                    <div className={styles.otherStandingPlace}>{placement}</div>
                    <div className={styles.otherStandingSuffix}>{cardinalToOrdinal(placement)}</div>

                    <div className={styles.otherStandingAvatar}>
                        <ImageOrVideo src={getUserAvatarPath(user)} draggable={false} />
                    </div>

                    <Textfit className={styles.otherStandingUsername} min={0} max={36} mode="single">
                        <Username user={user} />
                    </Textfit>

                    <div className={styles.otherStandingScore}>
                        {user[type]?.toLocaleString()} <img src={window.constructCDNUrl(`/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`)} />
                    </div>
                </div>

                <div className={styles.otherStandingBottomScores}>
                    <div className={styles.otherStandingBottomScore}>
                        <img src={window.constructCDNUrl(`/content/${type === PlacementType.TOKEN ? "token" : "experience"}.png`)} /> {user[type]?.toLocaleString()} {type === PlacementType.TOKEN ? "Tokens" : "EXP"}
                    </div>

                    <div className={styles.otherStandingBottomButton} onClick={() => navigate(`/dashboard?name=${user.username}`)}>View User</div>
                </div>
            </div>
        </Link>
    );
}
