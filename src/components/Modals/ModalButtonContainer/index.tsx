import { Loader } from "@components/index";
import { ModalButtonContainerProps } from "./modalButtonContainer.d";

import styles from "./modalButtonContainer.module.scss";

export default function ModalButtonContainer({ loading = false, children }: ModalButtonContainerProps) {
    return <div className={styles.buttonContainer} data-loading={loading}>{loading ? <Loader className={styles.loader} /> : children}</div>;
}
