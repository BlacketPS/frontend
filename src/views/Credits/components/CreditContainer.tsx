import { Link } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { ImageOrVideo, Username } from "@components/index";
import styles from "../credits.module.scss";

import { CreditUser } from "../credits.d";

export default function CreditContainer({ user, description }: CreditUser) {
    const { getUserAvatarPath } = useUser();

    return (
        <Link to={`/dashboard?name=${user.username}`} className={styles.creditContainer}>
            <div className={styles.creditAvatar}>
                <ImageOrVideo src={getUserAvatarPath(user)} />
            </div>

            <div className={styles.creditRightSide}>
                <Username className={styles.creditUsername} user={user} />
                <div className={styles.creditDescription}>{description}</div>
            </div>
        </Link>
    );
}