import styles from "./toggle.module.scss";

import { ToggleProps } from "./toggle.d";

export default function Toggle({ checked, children, ...props }: ToggleProps) {
    return (
        <div className={styles.toggleWrapper}>
            <div className={styles.toggleContainer} data-checked={checked} {...props}>
                <input type="checkbox" className={styles.hidden} readOnly checked={checked} />

                <i className="fas fa-check" />
            </div>

            {children && <span>{children}</span>}
        </div>
    );
}
