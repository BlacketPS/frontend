import { ReactNode } from "react";

import styles from "./warningContainer.module.scss";

export default function WarningContainer({ children }: { children: ReactNode }) {
    return (
        <div className={styles.warningContainer}>
            <i className="fas fa-exclamation-triangle" />
            <div>{children}</div>
        </div>
    );
}
