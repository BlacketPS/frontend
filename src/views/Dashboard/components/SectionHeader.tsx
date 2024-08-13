import { ReactNode } from "react";
import styles from "../dashboard.module.scss";

export default function SectionHeader({ children }: { children: ReactNode }) {
    return (
        <div className={styles.containerHeader}>
            <div className={styles.containerHeaderInside}>
                {children}
            </div>
        </div>
    );
}