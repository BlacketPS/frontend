import { ReactNode } from "react";
import styles from "./headerBody.module.scss";

export default function HeaderBody({ children }: { children: ReactNode }) {
    return <div className={styles.headerBody}>{children}</div>;
}
