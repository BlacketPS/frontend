import { ModalToggleContainerProps } from "./modalToggleContainer.d";

import styles from "./modalToggleContainer.module.scss";

export default function ModalToggleContainer({ children, ...props }: ModalToggleContainerProps) {
    return <div className={styles.toggleContainer} {...props}>{children}</div>;
}
