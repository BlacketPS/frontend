import styles from "../cosmeticsModal.module.scss";

import { FontProps } from "../cosmeticsModal.d";

export default function Font({ font, ...props }: FontProps) {

    return (
        <div
            className={styles.fontContainer}
            style={{
                fontFamily: font.name,
                ...props.style
            }}
            {...props}
        >
            {font.name}
        </div>
    );
}
