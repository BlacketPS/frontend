import { ClearButtonProps } from "./clearButton.d";

import styles from "./clearButton.module.scss";

export default function ClearButton({ className = "", children, ...props }: ClearButtonProps) {
    if (className !== "") className = ` ${className}`;

    return <div className={`${styles.clearButton}${className}`} role="button" {...props}>{children}</div>;
}
