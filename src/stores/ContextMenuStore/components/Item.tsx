import styles from "../contextMenu.module.scss";

import { ItemProps } from "../contextMenu.d";

export default function Item({ icon, color, children, onClick }: ItemProps) {
    return (
        <div className={styles.item} style={{ color }} onClick={onClick}>
            <span>{children}</span>
            <i className={icon} />
        </div>
    );
}
