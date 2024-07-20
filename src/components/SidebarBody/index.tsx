import styles from "./sidebarBody.module.scss";

import { SidebarBodyProps } from "./sidebarBody.d";

export default function SidebarBody({ pushOnMobile, children }: SidebarBodyProps) {
    return <div className={styles.sidebarBody} data-push={pushOnMobile}>{children}</div>;
}
