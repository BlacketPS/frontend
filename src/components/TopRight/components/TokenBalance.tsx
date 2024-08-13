import styles from "../topRight.module.scss";

import { BalanceProps } from "../topRight.d";

export default function TokenBalance({ user }: BalanceProps) {
    return (
        <div className={styles.balance}>
            <img src={window.constructCDNUrl("/content/token.png")} draggable={false} />
            {user.tokens.toLocaleString()}
        </div>
    );
}
