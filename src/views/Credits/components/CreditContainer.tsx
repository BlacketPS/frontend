import { useUser } from "@stores/UserStore/index";
import { Blook, Username } from "@components/index";
import styles from "../credits.module.scss";

import { CreditContainerProps } from "../credits.d";

export default function CreditContainer({ credit, ...props }: CreditContainerProps) {
    const { getUserAvatarPath } = useUser();

    return (
        <div className={styles.creditContainer} {...props}>
            <div className={styles.creditAvatar}>
                <Blook
                    src={getUserAvatarPath(credit.user)}
                    shiny={credit.user.avatar?.shiny}
                    draggable={false}
                />
            </div>

            <div className={styles.creditRightSide}>
                <Username className={styles.creditUsername} user={credit.user} />
                <div className={styles.creditDescription}>{credit.description}</div>
            </div>
        </div>
    );
}
