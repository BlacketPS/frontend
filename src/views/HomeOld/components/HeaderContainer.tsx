import { ReactNode } from "react";
import styles from "../home.module.scss";

export default function HeaderContainer({ children }: { children: ReactNode }) {
    return <div className={styles.headerContainer}>{children}</div>;
}
