import { ReactNode } from "react";

import styles from "./modalBody.module.scss";

export default function ModalBody({ children, ...props }: { children: ReactNode }) {
    return <div className={styles.text} {...props}>{children}</div>;
}
