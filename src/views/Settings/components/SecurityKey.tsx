import styles from "../settings.module.scss";

import { SecurityKeyProps } from "../settings.d";

export default function SecurityKey({ name, createdAt, onRemove }: SecurityKeyProps) {
    return (
        <div className={styles.securityKey}>
            <div className={styles.securityKeyInfo}>
                <div className={styles.securityKeyName}>{name}</div>
                <div className={styles.securityKeyDate}>Created at {new Date(createdAt).toLocaleDateString()}</div>
            </div>

            <div className={styles.securityKeyActions}>
                <div className={styles.securityKeyAction} onClick={onRemove}>
                    <i className="fas fa-trash" />
                </div>
            </div>
        </div>
    );
}
