import { AgreeHolderProps } from "../authentication.d";

import styles from "../authentication.module.scss";

export default function AgreeHolder({ checked, ...props }: AgreeHolderProps) {
    return (
        <div className={styles.agreeHolder}>
            <div className={`${styles.checkBox} ${checked ? styles.checkYes : styles.checkNo}`} {...props}>
                <i className={`fas fa-check ${styles.checkIcon}`} />
            </div>

            <div className={styles.agreeText}>
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.
            </div>
        </div>
    );
}
