import styles from "../topRight.module.scss";

import { BalanceProps } from "../topRight.d";

export default function DiamondBalance({ user }: BalanceProps) {
    return (
        <div className={styles.balance}>
            <img src={window.constructCDNUrl("/content/diamond.png")} draggable={false} />
            {user.diamonds.toLocaleString()}
        </div>
    );
}
