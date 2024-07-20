import styles from "../topRight.module.scss";

import { BalanceProps } from "../topRight.d";

export default function ExperienceBalance({ user }: BalanceProps) {
    return (
        <div className={styles.balance}>
            <img src="https://cdn.blacket.org/static/content/experience.png" draggable={false} />
            {user.experience.toLocaleString()}
        </div>
    );
}
