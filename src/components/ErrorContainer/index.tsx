import { ReactNode } from "react";

import styles from "./errorContainer.module.scss";

export default function ErrorContainer({ children }: { children: ReactNode }) {
    return (
        <div className={styles.errorContainer}>
            <i className="fas fa-times-circle" />
            <div>{children}</div>
        </div>
    );
}
