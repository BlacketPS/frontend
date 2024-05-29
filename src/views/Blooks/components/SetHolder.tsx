import styles from "../blooks.module.scss";

import { SetHolderProps } from "../blooks.d";

export default function SetHolder({ name, children }: SetHolderProps) {
    return (
        <div className={styles.setHolder}>
            <div className={styles.setTop}>
                <div className={styles.setTopBackground} />
                <div className={styles.setTopText}>{name}</div>
                <div className={styles.setTopDivider} />
            </div>
            <div className={styles.setItems}>
                {children}
            </div>
        </div>
    );
}
