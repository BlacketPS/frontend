import styles from "../topRight.module.scss";

import { TokenBalanceProps } from "../topRight.d";

export default function TokenBalance({ user }: TokenBalanceProps) {
    return (
        <div className={styles.tokenBalance}>
            <img src="https://cdn.blacket.org/static/content/token.png" draggable={false} />
            {user.tokens.toLocaleString()}
        </div>
    );
}
