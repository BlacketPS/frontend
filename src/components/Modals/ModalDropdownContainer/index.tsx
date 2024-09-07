import styles from "./modalDropdownContainer.module.scss";

import { ModalDropdownContainerProps } from "./modalDropdownContainer.d";

export default function ModalDropdownContainer({ children }: ModalDropdownContainerProps) {
    return <div className={styles.dropdownContainer}>{children}</div>;
}
