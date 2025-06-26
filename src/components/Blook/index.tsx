import { ImageOrVideo } from "@components/index";
import styles from "./blook.module.scss";

import { BlookProps } from "./blook.d";

export default function Blook({ custom = false, shiny = false, src, alt, draggable, className, ...props }: BlookProps) {
    return (
        <div style={{
            filter: shiny ? "drop-shadow(0px 0px 2px #fff)" : "none"
        }}>
            <div
                className={`${className ? `${className} ` : ""}${styles.blook}`}
                {...props}
            >
                {custom && <div className={styles.customIndicatorContainer}>
                    <div className={styles.customIndicator}>
                        <span>C</span>
                    </div>
                </div>}

                {shiny && <>
                    <div
                        style={{ maskImage: `url('${src.replaceAll("'", "\\'")}` }}
                        className={styles.overlay}
                    />

                    <div
                        style={{ maskImage: `url('${src.replaceAll("'", "\\'")}` }}
                        className={styles.shimmerOverlay}
                    />
                </>}

                <ImageOrVideo
                    className={styles.image}
                    src={src}
                    alt={alt}
                    draggable={draggable}
                />
            </div>
        </div>
    );
}
