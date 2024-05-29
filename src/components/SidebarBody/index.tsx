import { ReactNode } from "react";
import styles from "./sidebarBody.module.scss";

export default function SidebarBody({ children }: { children: ReactNode }) {
    return <div className={styles.sidebarBody}>{children}</div>;
}
