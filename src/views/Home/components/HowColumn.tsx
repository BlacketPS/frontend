import styles from "../home.module.scss";

import { HowColumnProps } from "../home.d";

export default function HowColumn({ image, children }: HowColumnProps) {
    return (
        <div className={styles.howCol}>
            <div className={styles.howImageContainerContainer}>
                <div className={styles.howImageContainer}>
                    <img src={image} />
                </div>
            </div>
            <div className={styles.howText}>
                {children}
            </div>
        </div>
    );
}
