import { Link } from "react-router-dom";
import styles from "./clearButton.module.scss";

import { ClearButtonProps } from "./clearButton.d";

export default function ClearButton({ to, className = "", children, ...props }: ClearButtonProps) {
    if (className !== "") className = ` ${className}`;

    if (!to) return <div className={`${styles.clearButton}${className}`} role="button" {...props}>{children}</div>;
    else return <Link to={to} className={`${styles.clearButton}${className}`} {...props}>{children}</Link>;
}
