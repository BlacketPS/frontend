import styles from "../mapEditor.module.scss";

import { ToolButtonProps } from "../mapEditor";

export default function ToolButton({ icon, onClick }: ToolButtonProps) {
    return (
        <div className={styles.toolButton} onClick={onClick}>
            <i className={icon} />
        </div>
    );
}
