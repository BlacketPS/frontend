import styles from "../settings.module.scss";

import { SettingsContainerProps } from "../settings.d";

export default function SettingsContainer({ header, children }: SettingsContainerProps) {
    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsContainerHeader}>
                <i className={header.icon} />
                <div>{header.text}</div>
            </div>

            <div className={styles.settingsContainerDivider} />

            {children}
        </div>
    );
}
