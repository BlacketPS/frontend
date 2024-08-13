import styles from "../dashboard.module.scss";

import { SmallButtonProps } from "../dashboard.d";

export default function SmallButton({ icon, onClick, children }: SmallButtonProps) {
    return (
        <div className={styles.smallButton} onClick={onClick}>
            <i className={icon} />
            {children}
        </div>
    );
}