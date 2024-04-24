import { PageHeaderProps } from "./pageHeader.d";

import styles from "./pageHeader.module.scss";

export default function PageHeader({ children, ...props }: PageHeaderProps) {
    return <div className={styles.pageHeader} {...props}>{children}</div>;
}
