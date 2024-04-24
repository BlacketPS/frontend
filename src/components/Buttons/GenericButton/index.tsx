import { GenericButtonProps } from "./genericButton.d";

import styles from "./genericButton.module.scss";

export default function GenericButton({ className = "", backgroundColor, children, ...props }: GenericButtonProps) {
    if (className !== "") className = ` ${className}`;

    return (
        <div className={`${styles.button}${className}`} role="button" {...props}>
            <div className={styles.buttonShadow} />
            <div style={{ backgroundColor: backgroundColor && backgroundColor }} className={styles.buttonEdge} />
            <div style={{ backgroundColor: backgroundColor && backgroundColor }} className={styles.buttonInside}>{children}</div>
        </div>
    );
}
