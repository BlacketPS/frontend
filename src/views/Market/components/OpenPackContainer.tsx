import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";

import { OpenPackContainerProps } from "../market.d";

export default function OpenPackContainer({ opening, image }: OpenPackContainerProps) {
    return (
        <div className={styles.openPackContainer} data-opening={opening}>
            <div className={styles.openPackTop} style={{ backgroundImage: `url(${window.constructCDNUrl("/content/packSeelOpen.svg")})` }} data-opening={opening} />
            <ImageOrVideo className={styles.openPackBottom} src={image} data-opening={opening} />
        </div>
    );
}
