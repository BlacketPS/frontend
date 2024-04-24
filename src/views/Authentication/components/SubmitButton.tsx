import { HTMLProps } from "react";

import styles from "../authentication.module.scss";

export default function SubmitButton({ children, ...props }: HTMLProps<HTMLDivElement>) {
    return <div className={styles.button} {...props}>{children}</div>;
}
