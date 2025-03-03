import { Tooltip } from "react-tooltip";
import styles from "../mapEditor.module.scss";

import { ToolButtonProps } from "../mapEditor";

export default function ToolButton({ name, icon, onClick }: ToolButtonProps) {
    return (
        <>
            <Tooltip id={name} place="right">{name}</Tooltip>

            <div className={styles.toolButton} onClick={onClick} data-tooltip-id={name}>
                <i className={icon} />
            </div>
        </>
    );
}
