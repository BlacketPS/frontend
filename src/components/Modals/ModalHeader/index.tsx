import { ReactNode } from "react";

import styles from "./modalHeader.module.scss";

export default function ModalHeader({ children }: { children: ReactNode }) {
    return (
        <>
            <div className={styles.header}>{children}</div>
            <div className={styles.divider} />
        </>
    );
}
