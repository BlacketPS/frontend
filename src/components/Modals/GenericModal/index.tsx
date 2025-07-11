import styles from "./genericModal.module.scss";

import { GenericModalProps } from "./genericModal.d";

export default function GenericModal({ closing = false, noAnimation = false, children, outside }: GenericModalProps) {
    return (
        <div data-closing={closing} data-animated={noAnimation ? false : true} className={styles.modal}>
            {outside && outside}

            <div data-closing={closing} data-animated={noAnimation ? false : true} className={styles.content}>
                <div data-closing={closing} data-animated={noAnimation ? false : true} className={styles.container}>
                    {children}
                </div>
            </div>
        </div>
    );
}
