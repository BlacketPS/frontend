import styles from "./modalBody.module.scss";

import { ModalBodyProps } from "./modalBody.d";

export default function ModalBody({ children, ...props }: ModalBodyProps) {
    return <div className={styles.text} {...props}>{children}</div>;
}
