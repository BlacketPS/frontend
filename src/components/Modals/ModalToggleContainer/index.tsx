import { ModalToggleContainerProps } from "./modalToggleContainer.d";

import styles from "./modalToggleContainer.module.scss";

export default function ModalToggleContainer({ children }: ModalToggleContainerProps) {
    return <div className={styles.toggleContainer}>{children}</div>;
}
