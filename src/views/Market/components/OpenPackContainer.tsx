import { useState } from "react";
import styles from "../market.module.scss";

import { OpenPackContainerProps } from "../market.d";

export default function OpenPackContainer({ opening, image }: OpenPackContainerProps) {
    return (
        <div className={styles.openPackContainer} data-opening={opening}>
            <div className={styles.openPackTop} data-opening={opening} />
            <img className={styles.openPackBottom} src={image} data-opening={opening} />
        </div>
    );
}
