import styles from "../market.module.scss";

import { CategoryProps } from "../market.d";

export default function Category({ header, children }: CategoryProps) {
    return (<>
        <div className={styles.categoryHeader}>{header}</div>

        <div className={styles.categoryContent}>
            {children}
        </div>
    </>);
}
