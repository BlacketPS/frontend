import { GenericModalProps } from "./genericModal";

import styles from "./genericModal.module.scss";

export default function GenericModal({ closing = false, noAnimation = false, children }: GenericModalProps) {
    return (
        <div data-closing={closing} data-animated={noAnimation ? false : true} className={styles.modal}>
            <div data-closing={closing} data-animated={noAnimation ? false : true} className={styles.content}>
                <div className={styles.container}>
                    {children}
                </div>
            </div>
        </div>
    );
}
