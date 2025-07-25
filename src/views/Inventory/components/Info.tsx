import styles from "../inventory.module.scss";

import { InfoProps } from "../inventory.d";

export default function Info({ name, icon, children, ...props }: InfoProps) {
    return (
        <div className={styles.info} {...props}>
            <div className={styles.infoText}>
                <i className={icon} />
                {name}
            </div>
            
            <b>{children}</b>
        </div>
    );
}
