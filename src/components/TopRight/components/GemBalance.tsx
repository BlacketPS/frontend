import styles from "../topRight.module.scss";

import { BalanceProps } from "../topRight.d";

export default function GemBalance({ user }: BalanceProps) {
    return (
        <div className={styles.balance}>
            <img src={window.constructCDNUrl("/content/gem.png")} draggable={false} />
            {user.gems.toLocaleString()}
        </div>
    );
}
