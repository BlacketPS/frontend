import { Link } from "react-router-dom";
import styles from "./genericButton.module.scss";

import { GenericButtonProps } from "./genericButton.d";

export default function GenericButton({ to, icon, className = "", backgroundColor, children, ...props }: GenericButtonProps) {
    if (className !== "") className = ` ${className}`;

    if (!to) return (
        <div className={`${styles.button}${className}`} role="button" {...props}>
            <div className={styles.buttonShadow} />
            <div style={{ backgroundColor: backgroundColor && backgroundColor }} className={styles.buttonEdge} />
            <div style={{ backgroundColor: backgroundColor && backgroundColor }} className={styles.buttonInside}>
                {icon && <i className={`${styles.buttonInsideIcon} ${icon}`} />}
                {children}
            </div>
        </div>
    );
    else return (
        <Link to={to} className={`${styles.button}${className}`} {...props}>
            <div className={styles.buttonShadow} />
            <div style={{ backgroundColor: backgroundColor && backgroundColor }} className={styles.buttonEdge} />
            <div style={{ backgroundColor: backgroundColor && backgroundColor }} className={styles.buttonInside}>
                {icon && <i className={`${styles.buttonInsideIcon} ${icon}`} />}
                {children}
            </div>
        </Link>
    );
}
