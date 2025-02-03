import styles from "../inventory.module.scss";

import { SetHolderProps } from "../inventory";

export default function SetHolder({ name, icon, nothing, children }: SetHolderProps) {
    return (
        <div className={styles.setHolder}>
            <div className={styles.setTop}>
                <div className={styles.setTopBackground}>
                    {/* TODO: icon at the top of the set */}
                </div>
                <div className={styles.setTopText}>{name}</div>
                <div className={styles.setTopDivider} />
            </div>
            <div className={styles.setItems} data-nothing={nothing}>
                {children}
            </div>
        </div>
    );
}
