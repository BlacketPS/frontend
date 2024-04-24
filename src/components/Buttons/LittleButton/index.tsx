import { LittleButtonProps } from "./littleButton.d";

import styles from "./littleButton.module.scss";

export default function LittleButton({ className = "", children, ...props }: LittleButtonProps) {
    if (className !== "") className = ` ${className}`;

    return <div className={`${styles.littleButton}${className}`} role="button" {...props}>{children}</div>;
}
