import { ReactNode } from "react";
import styles from "../inventory.module.scss";

export default function BlooksHolder({ children }: { children: ReactNode }) {
    return (
        <div className={styles.leftSide}>
            <div className={styles.blooksHolder}>
                {children}
            </div>
        </div>
    );
}
