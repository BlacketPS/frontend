import styles from "../error.module.scss";

import { ImageProps } from "../error.d";

export default function Image({ src, alt }: ImageProps) {
    return (
        <div className={styles.imageContainer}>
            <img className={styles.image} src={src} alt={alt} draggable={false} />
            <div className={styles.imageOverlay} />
        </div>
    );
}
