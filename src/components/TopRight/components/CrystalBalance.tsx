import styles from "../topRight.module.scss";

import { BalanceProps } from "../topRight.d";

export default function CrystalBalance({ user }: BalanceProps) {
    return (
        <div className={styles.balance}>
            <img src={window.constructCDNUrl("/content/crystal.png")} draggable={false} />
            {user.crystals.toLocaleString()}
        </div>
    );
}
