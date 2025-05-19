import styles from "../home.module.scss";

import { SectionProps } from "../home.d";

export default function Section({ header, image, reverse, children }: SectionProps) {
    return (
        <div className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
            <div className={styles.col}>
                <div className={styles.colHeader}>
                    {header.split("\n").map((line, index) => (
                        <span key={index}>
                            {line}

                            {index < header.split("\n").length - 1 && <br />}
                        </span>
                    ))}

                    <p className={styles.colText}>
                        {children}
                    </p>
                </div>

            </div>

            <img src={image} className={styles.sectionImage} />
        </div>
    );
}
