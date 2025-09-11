import {ImageOrVideo} from "@components/index";
import styles from "../home.module.scss";

import { HeroImageProps } from "../home.d";

export default function HeroImage({ src, alt, mobile }: HeroImageProps) {
    if (mobile) return (
        <ImageOrVideo src={src} alt={alt} className={styles.heroImageM} />
    );
    else return (
        <div className={styles.heroImageContainer}>
            <ImageOrVideo src={src} alt={alt} className={styles.heroImage} />
        </div>
    );
}
