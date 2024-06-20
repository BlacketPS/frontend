import { StatContainerProps } from "../dashboard";
import styles from "../dashboard.module.scss";

export default function StatContainer({ title, icon, value }: StatContainerProps) {

    /*<div className={styles.statContainer}>
                                <div className={styles.statHeader}>
                                    <img src="https://cdn.blacket.org/static/content/icons/dashboardStatsUserID.png" />
                                    User ID
                                </div>
                                <div className={styles.statDivider} />
                                <div className={styles.statValue}>
                                    {user.id}
                                </div>
                            </div>*/
    return (
        <div className={styles.statContainer}>
            <div className={styles.statHeader}>
                <img src={icon} />
                {title}
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statValue}>
                {value}
            </div>
        </div>
    );
}
